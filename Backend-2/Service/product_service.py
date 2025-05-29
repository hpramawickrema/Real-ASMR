import os
import uuid
from werkzeug.utils import secure_filename
from dbconnect import get_db_connection

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def add_product_service(data, file):
    name = data.get('name')
    qty = data.get('qty')
    price = data.get('price')
    description = data.get('description')

    if not all([name, qty, price, description, file]):
        return {"success": False, "message": "All fields including image are required."}

    if not allowed_file(file.filename):
        return {"success": False, "message": "Invalid image format."}

    try:
        # 🔐 Generate a unique image filename using UUID
        file_ext = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_ext}"
        secure_name = secure_filename(unique_filename)
        image_path = os.path.join(UPLOAD_FOLDER, secure_name)

        # Save file to disk
        file.save(image_path)

        # Save record in DB
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO products (name, qty, price, description, image)
            VALUES (%s, %s, %s, %s, %s)
        """, (name, qty, price, description, f"/{image_path}"))
        conn.commit()
        cursor.close()
        conn.close()

        return {"success": True, "message": "Product added successfully."}
    except Exception as e:
        return {"success": False, "message": f"Error: {str(e)}"}

def get_all_products_service():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, name, qty, price, description, image, created_at FROM products ORDER BY created_at DESC")
        products = cursor.fetchall()

        cursor.close()
        conn.close()

        return {"success": True, "products": products}
    except Exception as e:
        return {"success": False, "message": str(e)}


def update_product_service(product_id, data):
    name = data.get('name')
    qty = data.get('qty')
    price = data.get('price')
    description = data.get('description')

    if not all([name, qty, price, description]):
        return {"success": False, "message": "All fields are required."}

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE products
            SET name = %s, qty = %s, price = %s, description = %s
            WHERE id = %s
        """, (name, qty, price, description, product_id))
        conn.commit()
        cursor.close()
        conn.close()
        return {"success": True, "message": "Product updated successfully."}
    except Exception as e:
        return {"success": False, "message": str(e)}


def delete_product_service(product_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM products WHERE id = %s", (product_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return {"success": True, "message": "Product deleted successfully."}
    except Exception as e:
        return {"success": False, "message": str(e)}