import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from "recharts";
import API from "../services/api";

const STATUS_COLORS = {
  "en attente":     "#f59e0b",
  "en préparation": "#3b82f6",
  "prête":          "#8b5cf6",
  "servie":         "#10b981",
  "annulée":        "#ef4444",
};

const PIE_COLORS = ["#f59e0b","#3b82f6","#8b5cf6","#10b981","#ef4444"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const load = () => {
    setLoading(true);
    setError(null);
    API.get("/orders/stats")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "Impossible de charger les statistiques."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <div className="loading"><div className="spinner" /> Chargement du tableau de bord…</div>;

  if (error) return (
    <div>
      <div className="page-header"><div className="page-title">Dashboard</div></div>
      <div className="alert error">{error} <button className="btn btn-sm btn-outline" style={{marginLeft:12}} onClick={load}>Réessayer</button></div>
    </div>
  );

  const statusData = stats.statusBreakdown || [];
  const totalAll   = statusData.reduce((s, r) => s + Number(r.count), 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-sub">Vue d'ensemble de l'activité cantine</div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Commandes aujourd'hui</div>
            <div className="stat-value">{stats.totalOrdersToday}</div>
          </div>
          <div className="stat-icon purple">📋</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Plat le plus commandé</div>
            <div className="stat-value" style={{fontSize:18}}>{stats.mostOrderedDish}</div>
          </div>
          <div className="stat-icon teal">🏆</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Revenu estimé (aujourd'hui)</div>
            <div className="stat-value">{Number(stats.estimatedRevenue).toFixed(0)} DH</div>
          </div>
          <div className="stat-icon orange">💰</div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total commandes</div>
            <div className="stat-value">{totalAll}</div>
          </div>
          <div className="stat-icon red">📦</div>
        </div>
        {/* ── Pending card ── */}
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Pending Orders</div>
            <div className="stat-value">
              {stats.pendingOrders}
            </div>
          </div>
          <div className="stat-icon red">⏰</div>
        </div>
      </div>

      

      {/* ── Charts Row 1 ── */}
      <div className="two-col" style={{marginBottom:20}}>

        {/* Area chart – commandes par jour */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Commandes des 7 derniers jours</div>
              <div className="card-sub">Nombre de commandes par date</div>
            </div>
          </div>
          <div className="card-body">
            {stats.dailyOrders?.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats.dailyOrders}>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7928CA" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#7928CA" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{fontSize:11,fill:"#7b809a"}} axisLine={false} tickLine={false}/>
                  <YAxis allowDecimals={false} tick={{fontSize:11,fill:"#7b809a"}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{borderRadius:8,border:"none",boxShadow:"0 4px 12px rgba(0,0,0,.1)",fontSize:12}}/>
                  <Area type="monotone" dataKey="count" name="Commandes" stroke="#7928CA" strokeWidth={2.5} fill="url(#grad)"/>
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{padding:"40px 0"}}>
                <div className="empty-state-icon">📊</div>
                <div className="empty-state-title">Pas encore de données</div>
              </div>
            )}
          </div>
        </div>

        {/* Pie chart – répartition par statut */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Répartition par statut</div>
              <div className="card-sub">Toutes les commandes</div>
            </div>
          </div>
          <div className="card-body">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="status"
                    cx="50%" cy="50%"
                    outerRadius={80}
                    label={({status, percent}) => `${status} ${(percent*100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={STATUS_COLORS[entry.status] || PIE_COLORS[i % PIE_COLORS.length]}/>
                    ))}
                  </Pie>
                  <Tooltip formatter={(val, name) => [val, name]}
                    contentStyle={{borderRadius:8,border:"none",boxShadow:"0 4px 12px rgba(0,0,0,.1)",fontSize:12}}/>
                  <Legend iconType="circle" iconSize={9} wrapperStyle={{fontSize:11}}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{padding:"40px 0"}}>
                <div className="empty-state-icon">🥧</div>
                <div className="empty-state-title">Pas encore de données</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bar chart – top 5 plats ── */}
      <div className="card" style={{marginBottom:20}}>
        <div className="card-header">
          <div>
            <div className="card-title">Top 5 plats commandés</div>
            <div className="card-sub">Quantité totale commandée</div>
          </div>
        </div>
        <div className="card-body">
          {stats.topDishes?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.topDishes} layout="vertical" margin={{left:10}}>
                <XAxis type="number" allowDecimals={false} tick={{fontSize:11,fill:"#7b809a"}} axisLine={false} tickLine={false}/>
                <YAxis type="category" dataKey="dish_name" tick={{fontSize:12,fill:"#344767"}} axisLine={false} tickLine={false} width={150}/>
                <Tooltip contentStyle={{borderRadius:8,border:"none",boxShadow:"0 4px 12px rgba(0,0,0,.1)",fontSize:12}}/>
                <Bar dataKey="total" name="Quantité" radius={[0,6,6,0]}>
                  {stats.topDishes.map((_, i) => (
                    <Cell key={i} fill={["#7928CA","#9c4dff","#11cdef","#fb8c00","#f44335"][i]}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{padding:"40px 0"}}>
              <div className="empty-state-icon">🍽</div>
              <div className="empty-state-title">Pas encore de commandes</div>
            </div>
          )}
        </div>
      </div>

      {/* ── Status summary table ── */}
      {statusData.length > 0 && (
        <div className="card">
          <div className="card-header"><div className="card-title">Résumé par statut</div></div>
          <div className="card-body" style={{paddingTop:8}}>
            <table className="data-table">
              <thead>
                <tr><th>Statut</th><th>Nombre</th><th>Part</th></tr>
              </thead>
              <tbody>
                {statusData.map((row) => (
                  <tr key={row.status}>
                    <td>
                      <span className={`badge ${
                        row.status==="servie"?"green":
                        row.status==="prête"?"blue":
                        row.status==="en préparation"?"yellow":
                        row.status==="annulée"?"red":"gray"}`}>
                        {row.status}
                      </span>
                    </td>
                    <td style={{fontWeight:700}}>{row.count}</td>
                    <td style={{color:"var(--text-muted)"}}>
                      {totalAll > 0 ? ((row.count/totalAll)*100).toFixed(1)+"%" : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}