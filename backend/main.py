from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from backend import models, database
from backend.database import engine
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
from backend.chat import ChatManager
from backend.routers import router
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(router, prefix="/api")

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


app.mount("/assets", StaticFiles(directory="frontend_dist/assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith(("api/", "docs", "openapi.json", "ws", "redoc")):
        raise HTTPException(status_code=404, detail="Not found")
    file_path = f"frontend_dist/{full_path}"
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse("frontend_dist/index.html")