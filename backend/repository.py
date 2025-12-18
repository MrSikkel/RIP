from sqlalchemy.orm import Session
from backend import models, schemas, auth

class PostRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_user(self, user: schemas.UserCreate):
        hashed_password = auth.get_password_hash(user.password)  # Используем из auth.py
        db_user = models.User(email=user.email, hashed_password=hashed_password)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def get_user_by_email(self, email: str):
        return self.db.query(models.User).filter(models.User.email == email).first()

    def create_post(self, post: schemas.PostCreate, owner_id: int):
        db_post = models.Post(**post.dict(), owner_id=owner_id)
        self.db.add(db_post)
        self.db.commit()
        self.db.refresh(db_post)
        return db_post

    def get_post(self, post_id: int):
        return self.db.query(models.Post).filter(models.Post.id == post_id).first()

    def get_posts(self, skip: int = 0, limit: int = 10, owner_id: int = None):
        query = self.db.query(models.Post)
        if owner_id:
            query = query.filter(models.Post.owner_id == owner_id)
        return query.offset(skip).limit(limit).all()

    def update_post(self, post_id: int, post: schemas.PostCreate, owner_id: int):
        db_post = self.get_post(post_id)
        if not db_post or db_post.owner_id != owner_id:
            return None
        db_post.title = post.title
        db_post.author = post.author
        db_post.text = post.text
        self.db.commit()
        self.db.refresh(db_post)
        return db_post

    def delete_post(self, post_id: int, owner_id: int):
        db_post = self.get_post(post_id)
        if not db_post or db_post.owner_id != owner_id:
            return None
        self.db.delete(db_post)
        self.db.commit()
        return db_post