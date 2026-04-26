import { useEffect, useState, useRef } from "react";
import React from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const STATUSES = [
  { key: "all",            label: "Toutes",         badge: "" },
  { key: "en attente",     label: "En attente",     badge: "gray" },
  { key: "en préparation", label: "En préparation", badge: "yellow" },
  { key: "prête",          label: "Prête",          badge: "blue" },
  { key: "servie",         label: "Servie",         badge: "green" },
  { key: "annulée",        label: "Annulée",        badge: "red" },
];

const NEXT_STATUS = {
  "en attente":     "en préparation",
  "en préparation": "prête",
  "prête":          "servie",
};

export default function Orders() {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");
  const [toast, setToast]         = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [itemsMap, setItemsMap]   = useState({});   // orderId → items[]
  const pollRef = useRef(null);

  const showToast = (msg, type="success") => {
    setToast({msg, type});
    setTimeout(() => setToast(null), 3000);
  };

  const load = () => {
    API.get("/orders")
      .then(res => { setOrders(res.data); setError(null); })
      .catch(err => setError(err.response?.data?.message || "Impossible de charger les commandes."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // Poll every 15 s for real-time feel
    pollRef.current = setInterval(load, 15000);
    return () => clearInterval(pollRef.current);
  }, []);

  const changeStatus = async (id, newStatus) => {
    try {
      await API.put(`/orders/${id}`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id===id ? {...o, status:newStatus} : o));
      showToast(`Statut mis à jour : ${newStatus}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de la mise à jour.", "error");
    }
  };

  const loadItems = async (orderId) => {
    if (itemsMap[orderId]) { setExpandedId(expandedId===orderId ? null : orderId); return; }
    try {
      const res = await API.get(`/orders/${orderId}/items`);
      setItemsMap(prev => ({...prev, [orderId]: res.data}));
      setExpandedId(orderId);
    } catch { showToast("Impossible de charger les détails.", "error"); }
  };

  const getBadge = (status) => (STATUSES.find(s=>s.key===status)?.badge || "gray");

  const filtered = orders.filter(o => {
    const matchStatus = filter==="all" || o.status===filter;
    const q = search.toLowerCase();
    const matchSearch = !q
      || String(o.id).includes(q)
      || (o.student_name||"").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const countByStatus = (key) =>
    key==="all" ? orders.length : orders.filter(o=>o.status===key).length;

  const fmt = (d) => {
    try { return new Date(d).toLocaleTimeString("fr-MA",{hour:"2-digit",minute:"2-digit"}); }
    catch { return "—"; }
  };

  return (
    <div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
        <div>
          <div className="page-title">Gestion des Commandes</div>
          <div className="page-sub">{orders.length} commande{orders.length!==1?"s":""} — actualisation auto toutes les 15 s</div>
        </div>
        <input
          className="form-input"
          style={{width:240}}
          placeholder="🔍 Rechercher par étudiant ou #ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs">
        {STATUSES.map(s => (
          <button
            key={s.key}
            className={`filter-tab ${filter===s.key?"active":""}`}
            onClick={() => setFilter(s.key)}
          >
            {s.label}
            <span style={{marginLeft:4,opacity:.65}}>({countByStatus(s.key)})</span>
          </button>
        ))}
      </div>

      {loading && <div className="loading"><div className="spinner"/>Chargement…</div>}
      {!loading && error && (
        <div className="alert error">{error}
          <button className="btn btn-sm btn-outline" style={{marginLeft:10}} onClick={load}>Réessayer</button>
        </div>
      )}

      {!loading && !error && filtered.length===0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">Aucune commande trouvée</div>
          <div className="empty-state-desc">Aucune commande ne correspond à votre filtre.</div>
        </div>
      )}

      {!loading && !error && filtered.length>0 && (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Étudiant</th>
                <th>Heure</th>
                <th>Plats</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => {
                const next  = NEXT_STATUS[o.status];
                const final = o.status === "servie" || o.status === "annulée";
                const isExpanded = expandedId === o.id;

                return (
                  <React.Fragment key={o.id}>
                    <tr>
                      <td style={{fontWeight:800,color:"var(--purple)"}}>#{o.id}</td>

                      <td>
                        <div style={{fontWeight:600}}>
                          {o.student_name || `Étudiant #${o.user_id}`}
                        </div>
                        <div style={{fontSize:11,color:"var(--text-muted)"}}>
                          ID: {o.user_id}
                        </div>
                      </td>

                      <td style={{color:"var(--text-muted)",fontSize:13}}>
                        {fmt(o.created_at)}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => loadItems(o.id)}
                        >
                          {o.item_count} plat{o.item_count !== 1 ? "s" : ""}{" "}
                          {isExpanded ? "▲" : "▼"}
                        </button>
                      </td>

                      <td style={{fontWeight:700}}>
                        {o.total ? Number(o.total).toFixed(2) + " DH" : "—"}
                      </td>

                      <td>
                        <span className={`badge ${getBadge(o.status)}`}>
                          {o.status}
                        </span>
                      </td>

                      <td>
                        {!final && next ? (
                          <div style={{display:"flex",gap:6}}>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => changeStatus(o.id, next)}
                            >
                              → {next}
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => changeStatus(o.id, "annulée")}
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <span style={{color:"var(--text-muted)",fontSize:12}}>
                            Finalisée
                          </span>
                        )}
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {isExpanded && itemsMap[o.id] && (
                      <tr>
                        <td colSpan={7} style={{background:"#f8f9fa",padding:"12px 16px"}}>
                          <div style={{fontSize:12,color:"var(--text-muted)",marginBottom:6}}>
                            Détail des plats :
                          </div>

                          <table style={{width:"100%",fontSize:12}}>
                            <thead>
                              <tr>
                                <th>Plat</th>
                                <th style={{textAlign:"right"}}>Qté</th>
                                <th style={{textAlign:"right"}}>Prix</th>
                                <th style={{textAlign:"right"}}>Total</th>
                              </tr>
                            </thead>

                            <tbody>
                              {itemsMap[o.id].map(item => (
                                <tr key={item.id}>
                                  <td>{item.dish_name}</td>
                                  <td style={{textAlign:"right"}}>{item.quantity}</td>
                                  <td style={{textAlign:"right"}}>{item.price} DH</td>
                                  <td style={{textAlign:"right",fontWeight:600}}>
                                    {Number(item.subtotal).toFixed(2)} DH
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}