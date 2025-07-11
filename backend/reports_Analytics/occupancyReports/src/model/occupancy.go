package model

import "go.mongodb.org/mongo-driver/bson/primitive"

type Occupancy struct {
	ID           primitive.ObjectID `bson:"_id,omitempty"`
	SpaceID      int                `bson:"spaceId"`
	Date         string             `bson:"date"`
	Reservations int                `bson:"reservations"`
}
