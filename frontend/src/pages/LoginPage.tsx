import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${email}&password=${password}`,
      });
      if (!res.ok) throw new Error("Неверный логин");
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch (e) {
      alert("Ошибка: " + e.message);
    }
  };

  return (
    <div className="rega">
      <h1>Вход</h1>
      <input className="rega-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="rega-input" type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="rega-button" onClick={handleLogin}>Войти</button>
      <p>Нет аккаунта? <a href="/register">Зарегистрироваться</a></p>
    </div>
  );
};

export default LoginPage;