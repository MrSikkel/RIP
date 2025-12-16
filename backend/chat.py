from fastapi import WebSocket
from typing import List

class ChatManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def onOpen(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def onClose(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def onMessage(self, sender: WebSocket, message: str):
        for connection in self.active_connections:
            if connection != sender:
                await connection.send_text(message)

    def onError(self, websocket: WebSocket, error: Exception):
        self.onClose(websocket)
