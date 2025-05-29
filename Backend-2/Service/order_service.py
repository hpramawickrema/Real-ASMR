from dbconnect import get_db_connection
from datetime import datetime

def process_order_service(data):
    product_id = data.get('product_id')
    qty = int(data.get('qty'))
    user_id = data.get('user_id')
    address = data.get('address')
    contact_number = data.get('contact_number')

    if not all([product_id, qty, user_id, address, contact_number]):
        return {"success": False, "message": "All fields are required."}

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Fetch current qty and price
        cursor.execute("SELECT qty, price FROM products WHERE id = %s", (product_id,))
        product = cursor.fetchone()

        if not product:
            return {"success": False, "message": "Product not found."}

        current_qty, price = product

        if qty > current_qty:
            return {"success": False, "message": "Insufficient stock."}

        # Update product qty
        new_qty = current_qty - qty
        cursor.execute("UPDATE products SET qty = %s WHERE id = %s", (new_qty, product_id))

        # Insert order details
        total_price = price * qty
        cursor.execute("""
            INSERT INTO orders (user_id, product_id, qty, total_price, address, contact_number, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (user_id, product_id, qty, total_price, address, contact_number, datetime.now()))

        conn.commit()
        cursor.close()
        conn.close()

        return {"success": True, "message": "Order placed successfully."}

    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}
