import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== passwordConfirm) {
      alert("Пароли не совпадают");
      return;
    }
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, password_confirm: passwordConfirm }),
      });
      if (!res.ok) throw new Error("Registration failed");
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch (e: any) {
      alert("Ошибка: " + (e.message || "Неизвестная ошибка"));
    }
  };

  return (
    <div className="rega">
      <h1>Регистрация</h1>
      <input className="rega-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="rega-input" type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />
      <input className="rega-input" type="password" placeholder="Повторите пароль" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
      <button className="rega-button" onClick={handleRegister}>Зарегистрироваться</button>
      <p>Есть аккаунт? <a href="/login">Войти</a></p>
    </div>
  );
};

export default RegisterPage;