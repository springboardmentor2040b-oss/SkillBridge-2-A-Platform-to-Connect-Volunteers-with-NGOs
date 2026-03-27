# jwt_handler.py
import time
from typing import Dict, Optional
from jose import jwt
from decouple import config

JWT_SECRET = config("SECRET_KEY", default="your_secret_key")
JWT_ALGORITHM = config("ALGORITHM", default="HS256")

def token_response(token: str):
    return {
        "access_token": token
    }

def signJWT(email: str, role: str, name: Optional[str] = None, ngo_id: Optional[str] = None, role_in_ngo: Optional[str] = None) -> Dict[str, str]:
    payload = {
        "email": email,
        "role": role,
        "name": name,
        "ngo_id": ngo_id,
        "role_in_ngo": role_in_ngo,
        "expires": time.time() + 3600
    }

    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token_response(token)

def decodeJWT(token: str) -> Optional[dict]:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token["expires"] >= time.time() else None
    except Exception as e:
        print(f"JWT decode error: {e}")
        return None
