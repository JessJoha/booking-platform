package models

import (
	"time"

	"gorm.io/gorm"
)

// Review represents a user review for a space or booking
type Review struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	UserID      string         `json:"user_id" gorm:"not null;index" validate:"required"`
	SpaceID     string         `json:"space_id" gorm:"not null;index" validate:"required"`
	BookingID   string         `json:"booking_id" gorm:"not null;index" validate:"required"`
	Rating      int            `json:"rating" gorm:"not null" validate:"required,min=1,max=5"`
	Title       string         `json:"title" gorm:"size:200" validate:"max=200"`
	Content     string         `json:"content" gorm:"type:text" validate:"required,min=10,max=2000"`
	Images      []ReviewImage  `json:"images,omitempty" gorm:"foreignKey:ReviewID"`
	Tags        []ReviewTag    `json:"tags,omitempty" gorm:"many2many:review_tag_associations;"`
	
	// Review metadata
	IsVerified  bool           `json:"is_verified" gorm:"default:false"`
	IsAnonymous bool           `json:"is_anonymous" gorm:"default:false"`
	Language    string         `json:"language" gorm:"size:10;default:'en'"`
	
	// Moderation fields
	Status         ReviewStatus   `json:"status" gorm:"type:varchar(20);default:'pending'"`
	ModerationNote string         `json:"moderation_note,omitempty" gorm:"type:text"`
	ModeratedBy    string         `json:"moderated_by,omitempty" gorm:"size:100"`
	ModeratedAt    *time.Time     `json:"moderated_at,omitempty"`
	
	// Engagement metrics
	HelpfulCount   int            `json:"helpful_count" gorm:"default:0"`
	NotHelpfulCount int           `json:"not_helpful_count" gorm:"default:0"`
	ReportCount    int            `json:"report_count" gorm:"default:0"`
	
	// Response from business
	BusinessResponse *BusinessResponse `json:"business_response,omitempty" gorm:"foreignKey:ReviewID"`
	
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// ReviewStatus represents the status of a review
type ReviewStatus string

const (
	ReviewStatusPending   ReviewStatus = "pending"
	ReviewStatusApproved  ReviewStatus = "approved"
	ReviewStatusRejected  ReviewStatus = "rejected"
	ReviewStatusFlagged   ReviewStatus = "flagged"
	ReviewStatusArchived  ReviewStatus = "archived"
)

// ReviewImage represents an image attached to a review
type ReviewImage struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	ReviewID uint   `json:"review_id" gorm:"not null;index"`
	URL      string `json:"url" gorm:"not null"`
	Caption  string `json:"caption" gorm:"size:500"`
	Order    int    `json:"order" gorm:"default:0"`
	
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// ReviewTag represents tags that can be applied to reviews
type ReviewTag struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name" gorm:"unique;not null;size:50"`
	Description string `json:"description" gorm:"size:200"`
	Category    string `json:"category" gorm:"size:50"` // e.g., "service", "cleanliness", "amenities"
	IsPositive  *bool  `json:"is_positive,omitempty"` // true for positive, false for negative, null for neutral
	
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// BusinessResponse represents a response from the business to a review
type BusinessResponse struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	ReviewID uint   `json:"review_id" gorm:"not null;unique;index"`
	Content  string `json:"content" gorm:"type:text;not null" validate:"required,min=10,max=1000"`
	AuthorID string `json:"author_id" gorm:"not null"` // ID of the business user who responded
	
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// RatingMetric represents aggregated rating metrics for spaces
type RatingMetric struct {
	ID      uint   `json:"id" gorm:"primaryKey"`
	SpaceID string `json:"space_id" gorm:"not null;unique;index"`
	
	// Overall metrics
	TotalReviews    int     `json:"total_reviews" gorm:"default:0"`
	AverageRating   float64 `json:"average_rating" gorm:"default:0"`
	
	// Rating distribution
	FiveStarCount   int `json:"five_star_count" gorm:"default:0"`
	FourStarCount   int `json:"four_star_count" gorm:"default:0"`
	ThreeStarCount  int `json:"three_star_count" gorm:"default:0"`
	TwoStarCount    int `json:"two_star_count" gorm:"default:0"`
	OneStarCount    int `json:"one_star_count" gorm:"default:0"`
	
	// Quality metrics
	VerifiedReviewsCount int     `json:"verified_reviews_count" gorm:"default:0"`
	RecentRating         float64 `json:"recent_rating" gorm:"default:0"` // Last 30 days
	TrendDirection       string  `json:"trend_direction" gorm:"size:10"` // "up", "down", "stable"
	
	LastUpdated time.Time `json:"last_updated"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ReviewHelpfulness tracks user feedback on review helpfulness
type ReviewHelpfulness struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	ReviewID uint   `json:"review_id" gorm:"not null;index"`
	UserID   string `json:"user_id" gorm:"not null;index"`
	IsHelpful bool  `json:"is_helpful" gorm:"not null"`
	
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// ReviewReport represents a report about inappropriate content
type ReviewReport struct {
	ID       uint         `json:"id" gorm:"primaryKey"`
	ReviewID uint         `json:"review_id" gorm:"not null;index"`
	UserID   string       `json:"user_id" gorm:"not null;index"`
	Reason   ReportReason `json:"reason" gorm:"type:varchar(50);not null"`
	Details  string       `json:"details" gorm:"type:text"`
	Status   ReportStatus `json:"status" gorm:"type:varchar(20);default:'pending'"`
	
	ProcessedBy string     `json:"processed_by,omitempty" gorm:"size:100"`
	ProcessedAt *time.Time `json:"processed_at,omitempty"`
	
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// ReportReason represents the reason for reporting a review
type ReportReason string

const (
	ReportReasonSpam         ReportReason = "spam"
	ReportReasonOffensive    ReportReason = "offensive"
	ReportReasonInappropriate ReportReason = "inappropriate"
	ReportReasonFake         ReportReason = "fake"
	ReportReasonOther        ReportReason = "other"
)

// ReportStatus represents the status of a report
type ReportStatus string

const (
	ReportStatusPending  ReportStatus = "pending"
	ReportStatusApproved ReportStatus = "approved"
	ReportStatusRejected ReportStatus = "rejected"
	ReportStatusResolved ReportStatus = "resolved"
)

// ReviewAnalytics represents analytics data for reviews
type ReviewAnalytics struct {
	ID      uint   `json:"id" gorm:"primaryKey"`
	SpaceID string `json:"space_id" gorm:"not null;index"`
	Date    time.Time `json:"date" gorm:"not null;index"`
	
	// Daily metrics
	NewReviews      int     `json:"new_reviews" gorm:"default:0"`
	AverageRating   float64 `json:"average_rating" gorm:"default:0"`
	ResponseRate    float64 `json:"response_rate" gorm:"default:0"` // Percentage of reviews with business response
	
	// Sentiment analysis
	PositiveCount   int `json:"positive_count" gorm:"default:0"`
	NeutralCount    int `json:"neutral_count" gorm:"default:0"`
	NegativeCount   int `json:"negative_count" gorm:"default:0"`
	
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// AutoMigrate runs database migrations for all models
func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&Review{},
		&ReviewImage{},
		&ReviewTag{},
		&BusinessResponse{},
		&RatingMetric{},
		&ReviewHelpfulness{},
		&ReviewReport{},
		&ReviewAnalytics{},
	)
}

// TableName methods for custom table names
func (Review) TableName() string {
	return "reviews"
}

func (ReviewImage) TableName() string {
	return "review_images"
}

func (ReviewTag) TableName() string {
	return "review_tags"
}

func (BusinessResponse) TableName() string {
	return "business_responses"
}

func (RatingMetric) TableName() string {
	return "rating_metrics"
}

func (ReviewHelpfulness) TableName() string {
	return "review_helpfulness"
}

func (ReviewReport) TableName() string {
	return "review_reports"
}

func (ReviewAnalytics) TableName() string {
	return "review_analytics"
}
