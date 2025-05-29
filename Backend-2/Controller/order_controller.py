import jwt
from flask import Blueprint, request, jsonify
from Service.order_service import process_order_service
from dbconnect import get_db_connection

order_bp = Blueprint('order', __name__)




@order_bp.route('/buy', methods=['POST'])
def buy_product():
    data = request.get_json()
    token = data.get('token')

    # Token validation
    payload = verify_jwt_token(token)
    if not payload:
        return jsonify({"success": False, "message": "Invalid or expired token."}), 401

    data['user_id'] = payload.get('user_id')

    result = process_order_service(data)
    return jsonify(result)

SECRET_KEY = 'your_super_secret_key'

def verify_jwt_token(token):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token




@order_bp.route('/orders', methods=['POST'])
def get_user_orders():
    data = request.get_json()
    token = data.get('token')

    # JWT verification
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = decoded.get('user_id')
    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": "Token expired."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"success": False, "message": "Invalid token."}), 401

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT o.id, o.product_id, p.name, p.image, o.qty, o.total_price, o.status, o.created_at
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.user_id = %s
            ORDER BY o.created_at DESC
        """, (user_id,))

        rows = cursor.fetchall()
        orders = []
        for row in rows:
            order = {
                "order_id": row[0],
                "product_id": row[1],
                "product_name": row[2],
                "product_image": row[3],
                "qty": row[4],
                "total_price": float(row[5]),
                "status": row[6].capitalize(),
                "created_at": row[7].strftime("%Y-%m-%d %H:%M:%S")
            }
            orders.append(order)

        cursor.close()
        conn.close()

        return jsonify({"success": True, "orders": orders})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)})



@order_bp.route('/order/update', methods=['POST'])
def update_order_status():
    data = request.get_json()
    token = data.get('token')
    order_id = data.get('order_id')
    new_status = data.get('status')

    # Validate inputs
    if not token or not order_id or not new_status:
        return jsonify({"success": False, "message": "Missing required fields."}), 400

    # Verify token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        if not payload.get('user_id') or not payload.get('email'):
            return jsonify({"success": False, "message": "Invalid token."}), 403
    except jwt.ExpiredSignatureError:
        return jsonify({"success": False, "message": "Token expired."}), 401
    except jwt.InvalidTokenError:
        return jsonify({"success": False, "message": "Invalid token."}), 403

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("UPDATE orders SET status = %s WHERE id = %s", (new_status, order_id))
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({"success": True, "message": "Order status updated successfully."})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500




@order_bp.route('/orders/all', methods=['GET'])
def get_all_orders():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT o.id, o.user_id, u.username, u.email, o.product_id, p.name, p.image, o.qty, o.total_price, o.status, o.created_at
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN products p ON o.product_id = p.id
            ORDER BY o.created_at DESC
        """)

        rows = cursor.fetchall()
        orders = []
        for row in rows:
            orders.append({
                "order_id": row[0],
                "user_id": row[1],
                "username": row[2],
                "email": row[3],
                "product_id": row[4],
                "product_name": row[5],
                "product_image": row[6],
                "qty": row[7],
                "total_price": float(row[8]),
                "status": row[9].capitalize(),
                "created_at": row[10].strftime("%Y-%m-%d %H:%M:%S")
            })

        cursor.close()
        conn.close()

        return jsonify({"success": True, "orders": orders})

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
