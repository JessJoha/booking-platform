import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email, code):
    sender_email = os.getenv('GMAIL_USER')
    sender_password = os.getenv('GMAIL_APP_PASSWORD') 
    subject = "Your Recovery Code"
    body = f"Hello,\n\nYour recovery code is: {code}\nThis code will expire in 5 minutes.\n\n- MiniCourt Team"

    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(message)
            print(f"Recovery email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")
