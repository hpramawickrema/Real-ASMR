# Service/comment_service.py

from dbconnect import get_db_connection

def get_comments_service(video_id):
    """
    Fetch all comments for a given video_id.
    Returns a list of dicts.
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT id, video_id, user_id, username, body, created_at "
        "FROM comments WHERE video_id = %s "
        "ORDER BY created_at DESC",
        (video_id,)
    )
    comments = cursor.fetchall()

    cursor.close()
    conn.close()
    return comments

def create_comment_service(video_id, data):
    """
    Insert a new comment for video_id.
    Expects data dict with keys: user_id, username, body.
    Returns the newly created comment (with id, created_at).
    """
    user_id = data.get('user_id')
    username = data.get('username')
    body = data.get('body')

    if not user_id or not username or not body:
        return None, "All fields (user_id, username, body) are required."

    conn = get_db_connection()
    cursor = conn.cursor()

    insert_sql = """
        INSERT INTO comments (video_id, user_id, username, body)
        VALUES (%s, %s, %s, %s)
    """
    cursor.execute(insert_sql, (video_id, user_id, username, body))
    conn.commit()

    new_id = cursor.lastrowid
    cursor.close()
    conn.close()

    # Return the inserted comment
    return {
        "id": new_id,
        "video_id": video_id,
        "user_id": user_id,
        "username": username,
        "body": body,
        "created_at": None  # frontend can ignore or you can fetch it in controller
    }, None
