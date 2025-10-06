from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import schemas, repository, database

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi import Form

@router.post("/posts/form", response_model=schemas.Post)
def create_post_form(
    title: str = Form(...),
    author: str = Form(...),
    text: str = Form(...),
    db: Session = Depends(get_db)
):
    repo = repository.PostRepository(db)
    post_data = schemas.PostCreate(title=title, author=author, text=text)
    return repo.create_post(post_data)


@router.get("/posts/{post_id}", response_model=schemas.Post)
def read_post(post_id: int, db: Session = Depends(get_db)):
    repo = repository.PostRepository(db)
    db_post = repo.get_post(post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@router.get("/posts/", response_model=list[schemas.Post])
def read_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    repo = repository.PostRepository(db)
    return repo.get_posts(skip=skip, limit=limit)

@router.put("/posts/{post_id}", response_model=schemas.Post)
def update_post(post_id: int, post: schemas.PostCreate, db: Session = Depends(get_db)):
    repo = repository.PostRepository(db)
    db_post = repo.update_post(post_id, post)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@router.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    repo = repository.PostRepository(db)
    db_post = repo.delete_post(post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": f"Post {post_id} deleted successfully"}
