import React from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import ItemsPage from "./pages/ItemsPage";
import ChatPage from "./pages/ChatPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <nav style={{ marginBottom: "16px" }}>
          <Link to="/">Объекты</Link> |{" "}
          <Link to="/chat">Чат</Link>
        </nav>
        <ItemsPage />
      </div>
    ),
  },
  {
    path: "/chat",
    element: (
      <div>
        <nav style={{ marginBottom: "16px" }}>
          <Link to="/">Объекты</Link> |{" "}
          <Link to="/chat">Чат</Link>
        </nav>
        <ChatPage />
      </div>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
