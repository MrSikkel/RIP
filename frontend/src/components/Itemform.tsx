import React, { useState, useEffect } from "react";
import type { Item } from "./Itemlist";

type ItemFormProps = {
  onSubmit: (item: Omit<Item, "id">) => void;
  initialData?: Item;
  onCancel?: () => void;
};

const ItemForm: React.FC<ItemFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description });
    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Название"
        value={title}
        className="add_form_input"
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Описание"
        className="add_form_input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button className="btn_add_item" type="submit">{initialData ? "Сохранить" : "Добавить"}</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Отмена
        </button>
      )}
    </form>
  );
};

export default ItemForm;
