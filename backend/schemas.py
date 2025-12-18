from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str
    password_confirm: str

class UserOut(BaseModel):
    id: int
    email: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class PostBase(BaseModel):
    title: str
    author: str
    text: str

class PostCreate(PostBase):
    pass

class Post(PostBase):
    id: int
    owner_id: int  # Добавили owner_id

    class Config:
        orm_mode = True