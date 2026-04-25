import { useEffect, useState } from "react";
import API from "../services/api";

export default function Menus() {
  const [menus, setMenus] = useState([]);
  const [dish, setDish] = useState("");
  const [price, setPrice] = useState("");

  const loadMenus = () => {
    API.get("/menus/today").then((res)=>{
        setMenus(res.data);
    })
  }

  useEffect(() => {
    loadMenus();
  }, []);

  const addMenu = async () => {
    await API.post("/menus", {
        dish_name: dish,
        price: price,
        available: 1,
        menu_date: new Date().toISOString().split("T")[0],
    
    });

    setDish("");
    setPrice("");
    loadMenus();
  }

  const deletMenu = async(id) => {
    if (!window.confirm("Delete this menu item?")) {
      return;
    }

    await API.delete(`/menus/${id}`);

    loadMenus();
  }

  const toggleAvailability = async (menu) => {
    await API.put(`/menus/${menu.id}`, {
      available: menu.available ? 0 : 1
    });

    loadMenus();
  }

  return (
    <div className="grid grid-cols-3 gap-4">
  {menus.map(m => (
    <div key={m.id} className="bg-white p-4 rounded shadow">

      <h3 className="text-lg font-bold">{m.dish_name}</h3>
      <p className="text-gray-600">{m.price} DH</p>

      <p className={m.available ? "text-green-500" : "text-red-500"}>
        {m.available ? "Available" : "Unavailable"}
      </p>

      <button
        className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
        onClick={() => deleteMenu(m.id)}
      >
        Delete
      </button>

    </div>
  ))}
</div>
  );
}