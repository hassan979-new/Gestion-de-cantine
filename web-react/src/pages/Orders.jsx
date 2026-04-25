import { useEffect, useState } from "react";
import API from "../services/api";

export default function Orders(){
    const [orders, setOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState(("all"));


    const loadOrders = () => {
        API.get("/orders").then((res) => {
            let data = res.data;

            if (statusFilter !== "all") {
                data = data.filter(order=>order.status === statusFilter);
            }

            setOrders(data);
        });
    };

    useEffect(()=>{
        loadOrders();
    }, [statusFilter]);

    const changeStatus = async (id, newStatus) => {
        await API.put(`/orders/${id}`, {
            status: newStatus
        });

        loadOrders();
    }


    return (
    <div className="grid gap-4">
  {orders.map(o => (
    <div key={o.id} className="bg-white p-4 rounded shadow">

      <h3 className="font-bold">Order #{o.id}</h3>

      <p className="text-gray-500">{o.status}</p>

      <div className="flex gap-2 mt-2">

        <button className="bg-yellow-500 text-white px-2 py-1 rounded"
          onClick={() => changeStatus(o.id,"en préparation")}
        >
          Prep
        </button>

        <button className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={() => changeStatus(o.id,"prête")}
        >
          Ready
        </button>

        <button className="bg-green-500 text-white px-2 py-1 rounded"
          onClick={() => changeStatus(o.id,"servie")}
        >
          Served
        </button>

      </div>

    </div>
  ))}
</div>
  );
}