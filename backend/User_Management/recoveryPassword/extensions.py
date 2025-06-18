from flask_sqlalchemy import SQLAlchemy
import redis
import os

db = SQLAlchemy()

redis_client = redis.Redis(
    host=os.getenv('REDIS_HOST'),
    port=int(os.getenv('REDIS_PORT')),
    decode_responses=True
)
