from flask import Blueprint, request, jsonify
from Service.video_service import add_video, get_all_videos, get_video_by_id, update_video, delete_video

video_bp = Blueprint('video', __name__)

@video_bp.route('/upload-video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({"success": False, "message": "Video file is required"}), 400

    video_file = request.files['video']
    cover_file = request.files.get('cover')  # ✅ New: optional cover image upload

    title = request.form.get('title')
    description = request.form.get('description')
    tags = request.form.get('tags')

    # ✅ Pass cover_file to service layer too
    result = add_video(title, description, tags, video_file, cover_file)
    return jsonify(result)

@video_bp.route('/videos', methods=['GET'])
def get_videos():
    return jsonify(get_all_videos())

@video_bp.route('/videos/<int:video_id>', methods=['GET'])
def get_video(video_id):
    return jsonify(get_video_by_id(video_id))

@video_bp.route('/videos/<int:video_id>', methods=['PUT'])
def update_video_route(video_id):
    data = request.json
    return jsonify(update_video(video_id, data))

@video_bp.route('/videos/<int:video_id>', methods=['DELETE'])
def delete_video_route(video_id):
    response, status_code = delete_video(video_id)
    return jsonify(response), status_code