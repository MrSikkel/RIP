import { useEffect, useRef, useState } from "react";

type Message = {
  author: string;
  text: string;
  self: boolean;
};

const WS_URL = "ws://localhost:8000/ws/chat";

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const [author, text] = event.data.split(": ");
      setMessages((prev) => [
        ...prev,
        { author, text, self: false },
      ]);
    };

    socket.onerror = (e) => {
      console.error("WebSocket error", e);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      socket.close();
    };
  }, []);

  const sendMessage = () => {
    if (!author || !text || !socketRef.current) return;

    const msg = `${author}: ${text}`;
    socketRef.current.send(msg);

    setMessages((prev) => [
      ...prev,
      { author, text, self: true },
    ]);

    setText("");
  };

  return (
    <div>
      <h1>Чат</h1>

      <input
        placeholder="Ваше имя"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <div style={{ margin: "10px 0" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.self ? "right" : "left",
              color: m.self ? "aqua" : "white",
            }}
          >
            <b>{m.author}</b>: {m.text}
          </div>
        ))}
      </div>

      <input
        placeholder="Сообщение"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>
  );
};

export default ChatPage;
