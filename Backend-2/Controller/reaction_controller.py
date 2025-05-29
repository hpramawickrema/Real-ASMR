from flask import Blueprint, request, jsonify
from Service.reaction_service import save_reaction_service, get_all_reactions_service

reaction_bp = Blueprint('reaction', __name__)

@reaction_bp.route('/save-reaction', methods=['POST'])
def save_reaction():
    data = request.get_json()
    return jsonify(save_reaction_service(data))

@reaction_bp.route('/reactions', methods=['GET'])
def get_all_reactions():
    return jsonify(get_all_reactions_service())
