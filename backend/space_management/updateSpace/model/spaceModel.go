package model

type Space struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	Location    string `json:"location"`
	Type        string `json:"type"`
	Description string `json:"description"`
}
