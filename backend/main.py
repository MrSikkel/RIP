from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from . import models, database
from .database import engine

from .chat import ChatManager
from .routers import router
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chat_manager = ChatManager()

@app.websocket("/ws/chat")
async def chat_endpoint(websocket: WebSocket):
    await chat_manager.onOpen(websocket)

    try:
        while True:
            message = await websocket.receive_text()
            await chat_manager.onMessage(websocket, message)

    except WebSocketDisconnect:
        chat_manager.onClose(websocket)

    except Exception as e:
        chat_manager.onError(websocket, e)
