from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from Service.user_service import login_user_service
from dbconnect import get_db_connection

user_bp = Blueprint('user', __name__)

@user_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"success": False, "message": "All fields are required."}), 400

    hashed_password = generate_password_hash(password)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            return jsonify({"success": False, "message": "Email already registered."}), 409

        # Insert new user
        insert_query = """
            INSERT INTO users (username, email, password)
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (username, email, hashed_password))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"success": True, "message": "User registered successfully."})

    except Exception as e:
        return jsonify({"success": False, "message": f"An error occurred: {str(e)}"}), 500

@user_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    return jsonify(login_user_service(data))

@user_bp.route('/users', methods=['GET'])
def view_all_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Retrieve all users (only username and email)
        cursor.execute("SELECT username, email FROM users")
        users = cursor.fetchall()

        # Format result as list of dicts
        user_list = [{"username": row[0], "email": row[1]} for row in users]

        cursor.close()
        conn.close()

        return jsonify({"success": True, "users": user_list})

    except Exception as e:
        return jsonify({"success": False, "message": f"Error fetching users: {str(e)}"}), 500


