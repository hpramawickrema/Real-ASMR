from flask import Blueprint, request, jsonify
from Service.admin_service import login_admin_service
from werkzeug.security import generate_password_hash
from dbconnect import get_db_connection

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/register', methods=['POST'])
def register_admin():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"success": False, "message": "All fields are required."}), 400

    hashed = generate_password_hash(password)

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM admins WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"success": False, "message": "Admin already exists."}), 409

        cursor.execute(
            "INSERT INTO admins (username, email, password) VALUES (%s, %s, %s)",
            (username, email, hashed)
        )
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"success": True, "message": "Admin registered successfully."}), 201

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


@admin_bp.route('/admin/login', methods=['POST'])
def login_admin():
    data = request.get_json()
    return jsonify(login_admin_service(data))
