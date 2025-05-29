from werkzeug.security import generate_password_hash, check_password_hash
from dbconnect import get_db_connection
import jwt
import datetime


SECRET_KEY = 'your_super_secret_key'

def register_user_service(data):
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return {"success": False, "message": "All fields are required."}

    hashed_password = generate_password_hash(password)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return {"success": False, "message": "Email already registered."}

        insert_query = """
            INSERT INTO users (username, email, password)
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (username, email, hashed_password))
        conn.commit()

        cursor.close()
        conn.close()

        return {"success": True, "message": "User registered successfully."}

    except Exception as e:
        return {"success": False, "message": f"An error occurred: {str(e)}"}

from werkzeug.security import check_password_hash
from dbconnect import get_db_connection


def generate_jwt(payload):
    return jwt.encode(
        {
            **payload,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
        },
        SECRET_KEY,
        algorithm="HS256"
    )

def login_user_service(data):
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return {"success": False, "message": "Email and password are required."}

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute(
            "SELECT id, username, email, password FROM users WHERE email = %s",
            (email,)
        )
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user and check_password_hash(user[3], password):
            user_id, username, user_email = user[0], user[1], user[2]

            # 🔐 Generate JWT
            token = generate_jwt({
                "user_id": user_id,
                "name": username,
                "email": user_email
            })

            return {
                "success": True,
                "message": "Login successful.",
                "user_id": user_id,
                "name": username,
                "email": user_email,
                "token": token  # 👉 include JWT
            }
        else:
            return {"success": False, "message": "Invalid email or password."}

    except Exception as e:
        return {"success": False, "message": f"An error occurred: {str(e)}"}