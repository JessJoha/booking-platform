import boto3

def send_sms(phone_number, message):
    client = boto3.client('sns', region_name='us-east-1')
    response = client.publish(
        PhoneNumber=phone_number,
        Message=message
    )
    return response