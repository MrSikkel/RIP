import { createBrowserRouter, RouterProvider, Link, Navigate, Outlet } from "react-router-dom";
import ItemsPage from "./pages/ItemsPage";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";  // Новый
import RegisterPage from "./pages/RegisterPage";  // Новый
import "./index.css";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: (
          <div>
            <button className="exit-button" onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}>Выйти</button>
            <nav style={{ marginBottom: "16px" }}>
              <Link to="/">Объекты</Link> |{" "}
              <Link to="/chat">Чат</Link> |{" "}
            </nav>
            <ItemsPage />
          </div>
        ),
      },
      {
        path: "/chat",
        element: (
          <div>
            <button className="exit-button" onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}>Выйти</button>
            <nav style={{ marginBottom: "16px" }}>
              <Link to="/">Объекты</Link> |{" "}
              <Link to="/chat">Чат</Link> |{" "}
            </nav>
            <ChatPage />
          </div>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;