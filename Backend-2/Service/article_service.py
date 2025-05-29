# Service/article_service.py

from dbconnect import get_db_connection

def create_article_service(data):
    title = data.get('title')
    body = data.get('body')  # HTML content allowed
    author = data.get('author')

    if not title or not body or not author:
        return {"success": False, "message": "All fields are required."}, 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO articles (title, body, author)
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (title, body, author))
        conn.commit()

        cursor.close()
        conn.close()

        return {"success": True, "message": "Article created successfully."}, 201

    except Exception as e:
        return {"success": False, "message": str(e)}, 500

def get_article_by_id_service(article_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id, title, body, author, created_at FROM articles WHERE id = %s", (article_id,))
        article = cursor.fetchone()

        cursor.close()
        conn.close()

        if article:
            return {
                "success": True,
                "article": {
                    "id": article[0],
                    "title": article[1],
                    "body": article[2],
                    "author": article[3],
                    "created_at": article[4]
                }
            }, 200
        else:
            return {"success": False, "message": "Article not found."}, 404

    except Exception as e:
        return {"success": False, "message": str(e)}, 500


def get_all_articles_service():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT id, title, author, created_at FROM articles ORDER BY created_at DESC")
        rows = cursor.fetchall()

        cursor.close()
        conn.close()

        articles = []
        for row in rows:
            articles.append({
                "id": row[0],
                "title": row[1],
                "author": row[2],
                "created_at": row[3]
            })

        return {"success": True, "articles": articles}, 200

    except Exception as e:
        return {"success": False, "message": str(e)}, 500

def delete_article_service(article_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # First check if article exists
        cursor.execute("SELECT id FROM articles WHERE id = %s", (article_id,))
        article = cursor.fetchone()
        
        if not article:
            return {"success": False, "message": "Article not found."}, 404

        # Delete the article
        cursor.execute("DELETE FROM articles WHERE id = %s", (article_id,))
        conn.commit()

        cursor.close()
        conn.close()

        return {"success": True, "message": "Article deleted successfully."}, 200

    except Exception as e:
        return {"success": False, "message": str(e)}, 500