# Notification routes
post '/notifications/send' do
  begin
    data = JSON.parse(request.body.read)
    
    # Validate required fields
    required_fields = %w[user_id type subject content recipient]
    missing_fields = required_fields.select { |field| data[field].nil? || data[field].empty? }
    
    if missing_fields.any?
      halt 400, json({ error: "Missing required fields: #{missing_fields.join(', ')}" })
    end

    # Create notification record
    notification = Notification.create!(
      user_id: data['user_id'],
      type: data['type'],
      status: 'pending',
      subject: data['subject'],
      content: data['content'],
      recipient: data['recipient'],
      metadata: data['metadata']&.to_json
    )

    # Send notification based on type
    result = case data['type']
             when 'email'
               EmailService.new.send_email(notification)
             when 'sms'
               SmsService.new.send_sms(notification)
             when 'push'
               PushNotificationService.new.send_push_notification(notification)
             else
               { success: false, error: 'Invalid notification type' }
             end

    if result[:success]
      json({ success: true, notification: notification.to_hash, delivery_result: result })
    else
      json({ success: false, error: result[:error] })
    end

  rescue JSON::ParserError
    halt 400, json({ error: 'Invalid JSON format' })
  rescue ActiveRecord::RecordInvalid => e
    halt 400, json({ error: e.message })
  rescue => e
    halt 500, json({ error: e.message })
  end
end

get '/notifications/:id' do
  begin
    notification = Notification.find(params[:id])
    json({ success: true, notification: notification.to_hash })
  rescue ActiveRecord::RecordNotFound
    halt 404, json({ error: 'Notification not found' })
  rescue => e
    halt 500, json({ error: e.message })
  end
end

get '/notifications/user/:user_id' do
  begin
    page = params[:page]&.to_i || 1
    per_page = params[:per_page]&.to_i || 20
    status = params[:status]
    type = params[:type]

    notifications = Notification.by_user(params[:user_id]).recent
    notifications = notifications.by_status(status) if status
    notifications = notifications.by_type(type) if type
    
    # Simple pagination
    offset = (page - 1) * per_page
    total_count = notifications.count
    notifications = notifications.limit(per_page).offset(offset)

    json({
      success: true,
      notifications: notifications.map(&:to_hash),
      pagination: {
        page: page,
        per_page: per_page,
        total_count: total_count,
        total_pages: (total_count.to_f / per_page).ceil
      }
    })
  rescue => e
    halt 500, json({ error: e.message })
  end
end

# Template management routes
post '/templates' do
  begin
    data = JSON.parse(request.body.read)
    
    template = NotificationTemplate.create!(
      name: data['name'],
      template_type: data['template_type'],
      subject_template: data['subject_template'],
      content_template: data['content_template'],
      active: data['active'] || true
    )

    json({ success: true, template: template.to_hash })
  rescue JSON::ParserError
    halt 400, json({ error: 'Invalid JSON format' })
  rescue ActiveRecord::RecordInvalid => e
    halt 400, json({ error: e.message })
  rescue => e
    halt 500, json({ error: e.message })
  end
end

get '/templates' do
  begin
    type = params[:type]
    active_only = params[:active] == 'true'

    templates = NotificationTemplate.all
    templates = templates.by_type(type) if type
    templates = templates.active if active_only

    json({
      success: true,
      templates: templates.map(&:to_hash)
    })
  rescue => e
    halt 500, json({ error: e.message })
  end
end

# WebSocket-style endpoint for push notifications
get '/notifications/user/:user_id/push' do
  begin
    push_service = PushNotificationService.new
    notifications = push_service.get_user_notifications(params[:user_id])
    
    json({
      success: true,
      notifications: notifications
    })
  rescue => e
    halt 500, json({ error: e.message })
  end
end

put '/notifications/:id/read' do
  begin
    notification = Notification.find(params[:id])
    push_service = PushNotificationService.new
    push_service.mark_as_read(notification.user_id, notification.id)
    
    json({ success: true, message: 'Notification marked as read' })
  rescue ActiveRecord::RecordNotFound
    halt 404, json({ error: 'Notification not found' })
  rescue => e
    halt 500, json({ error: e.message })
  end
end
