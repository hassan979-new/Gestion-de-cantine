import { useState, useEffect, use } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { PieChart, Pie, Cell } from "recharts";
import API from "../services/api";


export default function Dashboard() {

  const [stats, setStats] = useState(null);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  useEffect(()=> {
    API.get("/orders/stats")
    .then((res) => {
      setStats(res.data);
    })
  }, [])

  if (!stats) {
    return <p className="text-gray-400">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Overview of cantine activity</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4">

        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-5 rounded-xl shadow">
          <h2 className="text-sm">Total commandes</h2>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-5 rounded-xl shadow">
          <h2 className="text-sm">Plat le plus commandé</h2>
          <p className="text-xl font-bold">{stats.mostOrderedDish}</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white p-5 rounded-xl shadow">
          <h2 className="text-sm">Revenu estimé</h2>
          <p className="text-2xl font-bold">
            {(stats.totalOrders * 25).toFixed(0)} DH
          </p>
        </div>

      </div>

      {/* Daily orders */}
      <div className="bg-gray-900 p-5 rounded-xl shadow">

        <h2 className="text-white mb-4 font-bold">
          Commandes par jour
        </h2>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={stats.dailyOrders}>

              <XAxis dataKey="day" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />

              <Bar dataKey="count" fill="#4f46e5" />

            </BarChart>

            <PieChart width={300} height={300}>
              <Pie
                data={stats.dailyOrders}
                dataKey="count"
                nameKey="day"
                outerRadius={100}
              >
                {stats.dailyOrders?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}