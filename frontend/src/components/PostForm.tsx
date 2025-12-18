import React, { useEffect, useState } from "react";
import type { Item } from "./PostList";
import "../index.css";

type ItemFormProps = {
  onSubmit: (item: Omit<Item, "id">) => void;
  initialData?: Item;
  onCancel?: () => void;
};

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [text, setText] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title ?? "");
      setAuthor(initialData.author ?? "");
      setText(initialData.text ?? ""); 
    } else {
      setTitle("");
      setAuthor("");
      setText("");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // предотвращаем перезагрузку страницы
    if (!title.trim() || !author.trim() || !text.trim()) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    onSubmit({
      title: title.trim(),
      author: author.trim(),
      text: text.trim(),
    });

    if (!initialData) {
      setTitle("");
      setAuthor("");
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Заголовок:
          <input
            type="text"
            className="add-item-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
            required
          />
        </label>
      </div>

      <div>
        <label>
          Автор:
          <input
            type="text"
            className="add-item-input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Автор"
            required
          />
        </label>
      </div>

      <div>
        <label>
          Описание:
          <input
            type="text"
            className="add-item-input"
            value={text} // Используем text
            onChange={(e) => setText(e.target.value)} // Обработчик для text
            placeholder="Описание"
            required
          />
        </label>
      </div>

      <div style={{ marginTop: 8 }}>
        <button className="submit-button" type="submit">{initialData ? "Сохранить" : "Добавить"}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default ItemForm;
