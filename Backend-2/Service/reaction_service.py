from dbconnect import get_db_connection

def save_reaction_service(data):
    user_id = data.get('user_id')
    video_id = data.get('video_id')
    reaction = data.get('reaction')

    if not user_id or not video_id or not reaction:
        return {"success": False, "message": "User ID, Video ID, and Reaction are required."}

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO reactions (user_id, video_id, reaction)
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (user_id, video_id, reaction))
        conn.commit()

        cursor.close()
        conn.close()

        return {"success": True, "message": "Reaction saved successfully."}

    except Exception as e:
        return {"success": False, "message": f"An error occurred: {str(e)}"}

def get_all_reactions_service():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT id, user_id, video_id, reaction, created_at FROM reactions")
        reactions = cursor.fetchall()

        cursor.close()
        conn.close()

        return reactions

    except Exception as e:
        return {"success": False, "message": f"An error occurred: {str(e)}"}
