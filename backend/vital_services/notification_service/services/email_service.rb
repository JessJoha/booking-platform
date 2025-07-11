class EmailService
  def initialize
    Mail.defaults do
      delivery_method :smtp, {
        address: ENV['SMTP_HOST'] || 'smtp.gmail.com',
        port: ENV['SMTP_PORT'] || 587,
        user_name: ENV['SMTP_USER'],
        password: ENV['SMTP_PASSWORD'],
        authentication: 'plain',
        enable_starttls_auto: true
      }
    end
  end

  def send_email(notification)
    begin
      mail = Mail.new do
        from    ENV['FROM_EMAIL'] || 'noreply@bookingplatform.com'
        to      notification.recipient
        subject notification.subject
        body    notification.content
      end

      mail.deliver!
      notification.mark_as_sent!
      
      { success: true, message: 'Email sent successfully' }
    rescue => e
      notification.mark_as_failed!(e.message)
      { success: false, error: e.message }
    end
  end

  def send_bulk_emails(notifications)
    results = []
    notifications.each do |notification|
      results << send_email(notification)
    end
    results
  end
end
