class NotificationTemplate < ActiveRecord::Base
  self.table_name = 'notification_templates'

  validates :name, presence: true, uniqueness: true
  validates :template_type, presence: true, inclusion: { in: %w[email sms push] }
  validates :subject_template, presence: true
  validates :content_template, presence: true

  scope :by_type, ->(type) { where(template_type: type) }
  scope :active, -> { where(active: true) }

  def render_subject(variables = {})
    template = subject_template
    variables.each do |key, value|
      template = template.gsub("{{#{key}}}", value.to_s)
    end
    template
  end

  def render_content(variables = {})
    template = content_template
    variables.each do |key, value|
      template = template.gsub("{{#{key}}}", value.to_s)
    end
    template
  end

  def to_hash
    {
      id: id,
      name: name,
      template_type: template_type,
      subject_template: subject_template,
      content_template: content_template,
      active: active,
      created_at: created_at,
      updated_at: updated_at
    }
  end
end
