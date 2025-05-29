from werkzeug.security import check_password_hash
from dbconnect import get_db_connection
import jwt
import datetime

SECRET_KEY = 'your_super_secret_key'

def generate_jwt(payload):
    return jwt.encode(
        {
            **payload,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

def login_admin_service(data):
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return {"success": False, "message": "Email and password are required."}

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id, username, email, password FROM admins WHERE email = %s", (email,))
        admin = cursor.fetchone()
        cursor.close()
        conn.close()

        if admin and check_password_hash(admin[3], password):
            token = generate_jwt({
                "admin_id": admin[0],
                "name": admin[1],
                "email": admin[2]
            })

            return {
                "success": True,
                "message": "Admin login successful.",
                "admin_id": admin[0],
                "name": admin[1],
                "email": admin[2],
                "token": token
            }
        else:
            return {"success": False, "message": "Invalid email or password."}

    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}
