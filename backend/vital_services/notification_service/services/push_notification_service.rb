require 'net/http'
require 'json'

class PushNotificationService
  def initialize
    @redis = Redis.new(
      host: ENV['REDIS_HOST'] || 'localhost',
      port: ENV['REDIS_PORT'] || 6379,
      password: ENV['REDIS_PASSWORD']
    )
  end

  def send_push_notification(notification)
    begin
      # Store notification in Redis for real-time delivery
      notification_data = {
        id: notification.id,
        user_id: notification.user_id,
        subject: notification.subject,
        content: notification.content,
        timestamp: Time.current.to_i
      }

      # Store in user's notification queue
      @redis.lpush("user_notifications:#{notification.user_id}", notification_data.to_json)
      @redis.expire("user_notifications:#{notification.user_id}", 86400) # 24 hours

      # Publish to real-time channel
      @redis.publish("notifications", notification_data.to_json)

      notification.mark_as_sent!
      
      { success: true, message: 'Push notification sent successfully' }
    rescue => e
      notification.mark_as_failed!(e.message)
      { success: false, error: e.message }
    end
  end

  def get_user_notifications(user_id, limit = 50)
    notifications = @redis.lrange("user_notifications:#{user_id}", 0, limit - 1)
    notifications.map { |n| JSON.parse(n) }
  end

  def mark_as_read(user_id, notification_id)
    notifications = @redis.lrange("user_notifications:#{user_id}", 0, -1)
    updated_notifications = notifications.map do |n|
      parsed = JSON.parse(n)
      if parsed['id'] == notification_id
        parsed['read'] = true
      end
      parsed.to_json
    end

    @redis.del("user_notifications:#{user_id}")
    updated_notifications.each { |n| @redis.rpush("user_notifications:#{user_id}", n) }
  end
end
