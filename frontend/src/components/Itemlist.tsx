import React, { useState, useEffect } from "react";
import ItemComponent from "./Item";
import ItemForm from "./Itemform"

export type Item = {
  id: number;
  title: string;
  description: string;
};
/*Список элементов(моковые данные) */
const ItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const mockData: Item[] = [
      { id: 1, title: "Эспрессо", description: "Крепкий кофе" },
      { id: 2, title: "Латте", description: "Кофе с молоком" },
      { id: 3, title: "Капучино", description: "Кофе с молочной пенкой" },
    ];
    setItems(mockData);
  }, []);
  /*Удаление*/
  const deleteItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };
  /*Добавление*/
   const addItem = (newItem: Omit<Item, "id">) => {
    const newPost: Item = { id: Date.now(), ...newItem };
    setItems((prevItems) => [...prevItems, newPost]);
  };
  /*Редактирование*/
  const updateItem = (updatedItem: Item) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  /*Сама форма вывода */
  return (
    
    <div>
      <h2>Добавить новый элемент</h2>
      <ItemForm onSubmit={addItem}/>
      <h2>Список элементов</h2>
      {items.length === 0 ? (
        <p>Список пуст</p>
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
