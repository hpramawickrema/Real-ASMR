from flask import Blueprint, request, jsonify
from Service.product_service import (
    add_product_service,
    get_all_products_service,
    update_product_service,
    delete_product_service
)

product_bp = Blueprint('product', __name__)


# Add product (with image upload)
@product_bp.route('/api/products/add', methods=['POST'])
def add_product():
    if 'image' not in request.files:
        return jsonify({"success": False, "message": "Image is required."}), 400

    file = request.files['image']
    data = request.form.to_dict()

    result = add_product_service(data, file)
    return jsonify(result)


# Get all products
@product_bp.route('/api/products', methods=['GET'])
def get_all_products():
    result = get_all_products_service()
    return jsonify(result)


# Update product (no image update)
@product_bp.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.json
    result = update_product_service(product_id, data)
    return jsonify(result)


# Delete product
@product_bp.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    result = delete_product_service(product_id)
    return jsonify(result)
