import React, { useState } from "react";
import type { Item } from "./PostList";
import ItemForm from "./PostForm";

type ItemProps = {
  item: Item;
  onDelete: (id: number) => void;
  onEdit: (updatedItem: Item) => void;
};

const ItemComponent: React.FC<ItemProps> = ({ item, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (data: Omit<Item, "id">) => {
    onEdit({ ...item, ...data });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div>
        <ItemForm
          initialData={item}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div>
      <h3>{item.title}</h3>
      <p><strong>Автор:</strong> {item.author}</p> {}
      <p><strong>Описание:</strong> {item.text}</p> {}
      <button className="btn_change_item" onClick={() => setIsEditing(true)}>Редактировать</button>
      <button className="btn_delete_item" onClick={() => onDelete(item.id)}>Удалить</button>
    </div>
  );
};

export default ItemComponent;
