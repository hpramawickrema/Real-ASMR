# Controller/comment_controller.py

from flask import Blueprint, request, jsonify
from Service.comment_service import get_comments_service, create_comment_service

comment_bp = Blueprint('comment', __name__)

@comment_bp.route('/api/videos/<int:video_id>/comments', methods=['GET'])
def list_comments(video_id):
    try:
        comments = get_comments_service(video_id)
        return jsonify(comments), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@comment_bp.route('/api/videos/<int:video_id>/comments', methods=['POST'])
def add_comment(video_id):
    data = request.get_json() or {}
    comment, error = create_comment_service(video_id, data)
    if error:
        return jsonify({"success": False, "message": error}), 400

    # If you need the created_at timestamp, you can refetch or adjust the service
    return jsonify(comment), 201
