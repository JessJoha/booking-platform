package consumer

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	"occupancyReports/src/config"

	"github.com/IBM/sarama"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ReservationEvent struct {
	SpaceID int    `json:"spaceId"`
	Date    string `json:"date"`
	Action  string `json:"action"`
}

func StartKafkaListener() {
	topic := os.Getenv("KAFKA_TOPIC")
	consumer := config.InitKafkaConsumer()

	partitions, err := consumer.Partitions(topic)
	if err != nil {
		log.Fatalf("Error getting partitions: %v", err)
	}

	for _, partition := range partitions {
		pc, err := consumer.ConsumePartition(topic, partition, sarama.OffsetNewest)
		if err != nil {
			log.Printf("Error consuming partition %d: %v", partition, err)
			continue
		}

		go func(pc sarama.PartitionConsumer) {
			for msg := range pc.Messages() {
				var event ReservationEvent
				err := json.Unmarshal(msg.Value, &event)
				if err != nil {
					log.Printf("Invalid event format: %v", err)
					continue
				}

				log.Printf("📥 Event received: %+v", event)
				handleEvent(event)
			}
		}(pc)
	}
}

func handleEvent(event ReservationEvent) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"spaceId": event.SpaceID, "date": event.Date}

	var increment int
	if event.Action == "created" {
		increment = 1
	} else if event.Action == "deleted" {
		increment = -1
	} else if event.Action == "updated" {

		log.Printf("Updated event received, but no specific action is required for updates")
		return
	} else {
		log.Printf("⚠️ Unknown action type: %s", event.Action)
		return
	}

	update := bson.M{
		"$inc": bson.M{"reservations": increment},
	}

	opts := options.Update().SetUpsert(true)

	result, err := config.OccupancyCollection.UpdateOne(ctx, filter, update, opts)
	if err != nil {
		log.Printf("Failed to update MongoDB: %v", err)
		return
	}

	log.Printf("MongoDB updated: %+v", result)
}
