import React, { useState } from "react";
import type { Item } from "./Itemlist";
import ItemForm from "./Itemform";

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
  /*При клике на edit мы просто вызываем ту же форму что и для создания*/
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
      <p>{item.description}</p>
      <button className="btn_change_item" onClick={() => setIsEditing(true)}>Редактировать</button>
      <button className="btn_delete_item" onClick={() => onDelete(item.id)}>Удалить</button>
    </div>
  );
};

export default ItemComponent;
