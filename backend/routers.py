from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from . import schemas, repository, database, auth, models

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Регистрация
@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = repository.PostRepository(db).get_user_by_email(user.email)
    if db_user:
        raise HTTPException(400, "Email already registered")
    if user.password != user.password_confirm:
        raise HTTPException(400, "Passwords do not match")
    created_user = repository.PostRepository(db).create_user(user)
    token = auth.create_access_token({"sub": created_user.email})
    return schemas.Token(access_token=token)

# Логин
@router.post("/login", response_model=schemas.Token)
def login(form_data: auth.OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = repository.PostRepository(db).get_user_by_email(form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(401, "Incorrect email or password")
    token = auth.create_access_token({"sub": user.email})
    return schemas.Token(access_token=token)

# Создание поста (защищён)
@router.post("/posts/form", response_model=schemas.Post)
def create_post_form(
    title: str = Form(...),
    author: str = Form(...),
    text: str = Form(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    repo = repository.PostRepository(db)
    post_data = schemas.PostCreate(title=title, author=author, text=text)
    return repo.create_post(post_data, owner_id=current_user.id)

# Получение поста (только своего)
@router.get("/posts/{post_id}", response_model=schemas.Post)
def read_post(post_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    repo = repository.PostRepository(db)
    db_post = repo.get_post(post_id)
    if db_post is None or db_post.owner_id != current_user.id:
        raise HTTPException(404, "Post not found")
    return db_post

# Получение списка (только своих)
@router.get("/posts/", response_model=list[schemas.Post])
def read_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    repo = repository.PostRepository(db)
    return repo.get_posts(skip=skip, limit=limit, owner_id=current_user.id)

# Обновление (только своего)
@router.put("/posts/{post_id}", response_model=schemas.Post)
def update_post(post_id: int, post: schemas.PostCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    repo = repository.PostRepository(db)
    db_post = repo.update_post(post_id, post, owner_id=current_user.id)
    if db_post is None:
        raise HTTPException(404, "Post not found")
    return db_post

# Удаление (только своего)
@router.delete("/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    repo = repository.PostRepository(db)
    db_post = repo.delete_post(post_id, owner_id=current_user.id)
    if db_post is None:
        raise HTTPException(404, "Post not found")
    return {"message": f"Post {post_id} deleted successfully"}