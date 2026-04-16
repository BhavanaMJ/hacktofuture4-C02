import jwt
from django.conf import settings
from datetime import datetime, timedelta

SECRET = "your-secret-key"

def generate_jwt(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=24),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")

def validate_jwt(token: str):
    try:
        payload = jwt.decode(token, SECRET, algorithms=["HS256"])
        return {"valid": True, "payload": payload}

    except jwt.ExpiredSignatureError:
        return {"valid": False, "error": "TOKEN_EXPIRED"}

    except jwt.InvalidTokenError:
        return {"valid": False, "error": "INVALID_TOKEN"}