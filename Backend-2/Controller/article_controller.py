from flask import Blueprint, request, jsonify
from Service.article_service import create_article_service, get_article_by_id_service, get_all_articles_service, delete_article_service

article_bp = Blueprint('article', __name__)

@article_bp.route('/articles', methods=['POST'])
def create_article():
    data = request.get_json()
    response, status_code = create_article_service(data)
    return jsonify(response), status_code

@article_bp.route('/articles/<int:article_id>', methods=['GET'])
def get_article_by_id(article_id):
    response, status_code = get_article_by_id_service(article_id)
    return jsonify(response), status_code

@article_bp.route('/articles', methods=['GET'])
def get_all_articles():
    response, status_code = get_all_articles_service()
    return jsonify(response), status_code

@article_bp.route('/articles/<int:article_id>', methods=['DELETE'])
def delete_article(article_id):
    response, status_code = delete_article_service(article_id)
    return jsonify(response), status_code