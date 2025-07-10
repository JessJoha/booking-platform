class Notification < ActiveRecord::Base
  self.table_name = 'notifications'

  validates :user_id, presence: true
  validates :type, presence: true, inclusion: { in: %w[email sms push] }
  validates :status, presence: true, inclusion: { in: %w[pending sent failed] }
  validates :subject, presence: true
  validates :content, presence: true

  scope :by_user, ->(user_id) { where(user_id: user_id) }
  scope :by_status, ->(status) { where(status: status) }
  scope :by_type, ->(type) { where(type: type) }
  scope :recent, -> { order(created_at: :desc) }

  def to_hash
    {
      id: id,
      user_id: user_id,
      type: type,
      status: status,
      subject: subject,
      content: content,
      recipient: recipient,
      metadata: metadata,
      sent_at: sent_at,
      created_at: created_at,
      updated_at: updated_at
    }
  end

  def mark_as_sent!
    update!(status: 'sent', sent_at: Time.current)
  end

  def mark_as_failed!(error_message = nil)
    metadata_hash = metadata ? JSON.parse(metadata) : {}
    metadata_hash['error'] = error_message if error_message
    update!(status: 'failed', metadata: metadata_hash.to_json)
  end
end
