import React, { useEffect, useState } from "react";
import ItemComponent from "./PostCard";
import ItemForm from "./PostForm";

export type Item = {
  id: number;
  title: string;
  author: string;
  text: string;
};

const API_URL = "http://localhost:8000/posts";

const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((post: any) => ({
          id: post.id,
          title: post.title,
          author: post.author,
          text: post.text,
        }));
        setItems(formatted);
      });
  }, []);

  //-------------------ДОБАВЛЕНИЕ----------------//
const addItem = async (newItem: Omit<Item, "id">) => {
    const formData = new FormData();
    formData.append("title", newItem.title);
    formData.append("author", newItem.author);
    formData.append("text", newItem.text);

    const res = await fetch(`${API_URL}/form`, {
        method: "POST",
        body: formData,
    });

    const created = await res.json();

    const formatted: Item = {
        id: created.id,
        title: created.title,
        author: created.author,
        text: created.text,
    };

    setItems((prev) => [...prev, formatted]);
};

  //-------------------ОБНОВЛЕНИЕ----------------//
const updateItem = async (updatedItem: Item) => {
  const res = await fetch(`${API_URL}/${updatedItem.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedItem), // Отправляем данные как JSON
  });

  const data = await res.json();

  const formatted: Item = {
    id: data.id,
    title: data.title,
    author: data.author,
    text: data.text,
  };

  setItems((prev) =>
    prev.map((item) => (item.id === formatted.id ? formatted : item))
  );
};
  //-------------------УДАЛЕНИЕ----------------//
  const deleteItem = async (id: number) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h2>Добавить новый пост</h2>

      <ItemForm onSubmit={addItem} />

      <h2>Список постов</h2>

      {items.length === 0 ? (
        <p>Список пуст. Добавьте первый пост.</p>
      ) : (
        items.map((item) => (
          <ItemComponent
            key={item.id}
            item={item}
            onEdit={updateItem}
            onDelete={deleteItem}
          />
        ))
      )}
    </div>
  );
};

export default ItemList;
