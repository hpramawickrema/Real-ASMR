class Video:
    def __init__(self, title, description, tags, video_url, cover_url=None):
        self.title = title
        self.description = description
        self.tags = tags
        self.video_url = video_url
        self.cover_url = cover_url  # ✅ new field for cover image
