from flask import Flask, send_from_directory
from flask_cors import CORS  # ✅ Import CORS

from Controller.admin_controller import admin_bp
from Controller.article_controller import article_bp
from Controller.comment_controller import comment_bp
from Controller.order_controller import order_bp
from Controller.product_controller import product_bp
from Controller.reaction_controller import reaction_bp
from Controller.user_controller import user_bp
from Controller.video_controller import video_bp

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

# Register the blueprint for video routes
app.register_blueprint(video_bp, url_prefix='/api')
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(reaction_bp, url_prefix='/api')
app.register_blueprint(article_bp, url_prefix='/api')
app.register_blueprint(comment_bp)
app.register_blueprint(product_bp)
app.register_blueprint(order_bp, url_prefix='/api')
app.register_blueprint(admin_bp, url_prefix='/api')

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory('uploads', filename)

if __name__ == '__main__':
    app.run(debug=True)