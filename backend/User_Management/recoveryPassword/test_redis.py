import redis

try:
    client = redis.Redis(host='34.224.240.158', port=6379, decode_responses=True)
    client.ping()
    print("✅ Connection to Redis successful.")
except Exception as e:
    print("❌ Connection failed:", e)
