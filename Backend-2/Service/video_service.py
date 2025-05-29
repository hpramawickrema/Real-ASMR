import os
import uuid
from werkzeug.utils import secure_filename
from Model.video import Video
from dbconnect import get_db_connection
import os
import uuid
from werkzeug.utils import secure_filename
from Model.video import Video
from dbconnect import get_db_connection

UPLOAD_FOLDER = 'uploads'

def add_video(title, description, tags, video_file, cover_file=None):
    # Save video
    video_filename = secure_filename(str(uuid.uuid4()) + os.path.splitext(video_file.filename)[-1])
    video_path = os.path.join('uploads', video_filename)
    video_file.save(video_path)

    cover_filename = None
    if cover_file:
        cover_filename = secure_filename(str(uuid.uuid4()) + os.path.splitext(cover_file.filename)[-1])
        cover_path = os.path.join('uploads', cover_filename)
        cover_file.save(cover_path)

    # Insert into DB
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO videos (title, description, tags, video_url, cover_url) VALUES (%s, %s, %s, %s, %s)",
        (title, description, tags, '/uploads/' + video_filename, '/uploads/' + cover_filename if cover_filename else None)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return {"success": True, "message": "Video uploaded successfully."}


def get_all_videos():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM videos")
        result = cursor.fetchall()
        cursor.close()
        conn.close()
        return result
    except Exception as e:
        return {"success": False, "message": str(e)}

def get_video_by_id(video_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM videos WHERE id = %s", (video_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result if result else {"success": False, "message": "Video not found"}
    except Exception as e:
        return {"success": False, "message": str(e)}

def update_video(video_id, data):
    try:
        title = data.get('title')
        description = data.get('description')
        tags = data.get('tags')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE videos SET title = %s, description = %s, tags = %s WHERE id = %s
        """, (title, description, tags, video_id))

        conn.commit()
        cursor.close()
        conn.close()

        return {"success": True, "message": "Video updated successfully"}
    except Exception as e:
        return {"success": False, "message": str(e)}

def delete_video(video_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # First get the video info to delete the file
        cursor.execute("SELECT video_url, cover_url FROM videos WHERE id = %s", (video_id,))
        video = cursor.fetchone()
        
        if not video:
            return {"success": False, "message": "Video not found."}, 404

        # Delete the video file
        if video[0]:  # video_url
            video_path = os.path.join('uploads', os.path.basename(video[0]))
            if os.path.exists(video_path):
                os.remove(video_path)

        # Delete the cover file if exists
        if video[1]:  # cover_url
            cover_path = os.path.join('uploads', os.path.basename(video[1]))
            if os.path.exists(cover_path):
                os.remove(cover_path)

        # Delete from database
        cursor.execute("DELETE FROM videos WHERE id = %s", (video_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return {"success": True, "message": "Video deleted successfully."}, 200

    except Exception as e:
        return {"success": False, "message": str(e)}, 500
