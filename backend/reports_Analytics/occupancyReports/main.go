package main

import (
	"log"

	"occupancyReports/src/config"
	"occupancyReports/src/consumer"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	log.Println("🚀 Starting occupancyReports service...")

	config.ConnectMongoDB()

	consumer.StartKafkaListener()

	select {}
}
