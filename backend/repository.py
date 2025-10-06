from sqlalchemy.orm import Session
from . import models, schemas

class PostRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create_post(self, post: schemas.PostCreate):
        db_post = models.Post(**post.dict())
        self.db.add(db_post)
        self.db.commit()
        self.db.refresh(db_post)
        return db_post
    
    def get_post(self, post_id:int):
        return self.db.query(models.Post).filter(models.Post.id == post_id).first()
    
    def get_posts(self, skip: int = 0, limit: int = 10):
        return self.db.query(models.Post).offset(skip).limit(limit).all()
    
    def update_post(self, post_id:int, post: schemas.PostCreate):
        db_post = self.get_post(post_id)
        if not db_post:
            return None
        db_post.title = post.title
        db_post.author = post.author
        db_post.text = post.text
        self.db.commit()
        self.db.refresh(db_post)
        return db_post
    
    def delete_post(self, post_id: int):
        db_post = self.get_post(post_id)
        if not db_post:
            return None
        self.db.delete(db_post)
        self.db.commit()
        return db_post
