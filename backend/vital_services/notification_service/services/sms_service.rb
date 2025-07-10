class SmsService
  def initialize
    @client = Twilio::REST::Client.new(
      ENV['TWILIO_ACCOUNT_SID'],
      ENV['TWILIO_AUTH_TOKEN']
    )
  end

  def send_sms(notification)
    begin
      message = @client.messages.create(
        from: ENV['TWILIO_PHONE_NUMBER'],
        to: notification.recipient,
        body: notification.content
      )

      notification.mark_as_sent!
      
      { success: true, message: 'SMS sent successfully', sid: message.sid }
    rescue => e
      notification.mark_as_failed!(e.message)
      { success: false, error: e.message }
    end
  end

  def send_bulk_sms(notifications)
    results = []
    notifications.each do |notification|
      results << send_sms(notification)
    end
    results
  end
end
