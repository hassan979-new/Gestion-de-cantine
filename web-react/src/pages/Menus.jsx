import { useEffect, useState } from "react";
import API from "../services/api";

const DISH_EMOJIS = ["🍛","🥗","🍲","🥘","🍜","🥙","🫕","🍱","🍝","🥗"];

export default function Menus() {
  const [menus, setMenus]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [toast, setToast]       = useState(null);
  const [form, setForm] = useState({
    dish_name: "",
    price: "",
    menu_date: new Date().toISOString().split("T")[0],
  });
  // Date picker for viewing other days
  const [viewDate, setViewDate] = useState(new Date().toISOString().split("T")[0]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = (date) => {
    setLoading(true);
    setError(null);
    API.get(`/menus?date=${date}`)
      .then((res) => setMenus(res.data))
      .catch((err) => setError(err.response?.data?.message || "Impossible de charger les menus."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(viewDate); }, [viewDate]);

  const handleAdd = async () => {
    if (!form.dish_name.trim() || !form.price || !form.menu_date) {
      showToast("Veuillez remplir tous les champs.", "error");
      return;
    }
    setSaving(true);
    try {
      await API.post("/menus", {
        dish_name: form.dish_name.trim(),
        price: Number(form.price),
        available: 1,
        menu_date: form.menu_date,
      });
      showToast("Plat ajouté avec succès !");
      setShowModal(false);
      setForm({ dish_name: "", price: "", menu_date: viewDate });
      load(viewDate);
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de l'ajout.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce plat définitivement ?")) return;
    try {
      await API.delete(`/menus/${id}`);
      setMenus(prev => prev.filter(m => m.id !== id));
      showToast("Plat supprimé.");
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de la suppression.", "error");
    }
  };

  const handleToggle = async (menu) => {
    const newVal = menu.available ? 0 : 1;
    try {
      await API.put(`/menus/${menu.id}`, { available: newVal });
      setMenus(prev => prev.map(m => m.id === menu.id ? { ...m, available: newVal } : m));
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur.", "error");
    }
  };

  const today = new Date().toISOString().split("T")[0];
  const isToday = viewDate === today;

  return (
    <div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
        <div>
          <div className="page-title">Gestion des Menus</div>
          <div className="page-sub">
            {isToday ? "Menu du jour" : `Menu du ${new Date(viewDate+"T00:00:00").toLocaleDateString("fr-MA",{weekday:"long",day:"numeric",month:"long"})}`}
          </div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <input
            type="date"
            className="form-input"
            style={{width:170}}
            value={viewDate}
            onChange={e => setViewDate(e.target.value)}
          />
          <button className="btn btn-primary" onClick={() => { setForm(f=>({...f,menu_date:viewDate})); setShowModal(true); }}>
            + Ajouter un plat
          </button>
        </div>
      </div>

      {loading && <div className="loading"><div className="spinner"/>Chargement…</div>}
      {error   && <div className="alert error">{error} <button className="btn btn-sm btn-outline" style={{marginLeft:10}} onClick={()=>load(viewDate)}>Réessayer</button></div>}

      {!loading && !error && menus.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🍽</div>
          <div className="empty-state-title">Aucun plat pour cette date</div>
          <div className="empty-state-desc">Ajoutez des plats pour composer ce menu.</div>
        </div>
      )}

      {!loading && !error && menus.length > 0 && (
        <div className="menus-grid">
          {menus.map((m, i) => (
            <div key={m.id} className="menu-card">
              <div className="menu-card-img">{DISH_EMOJIS[i % DISH_EMOJIS.length]}</div>
              <div className="menu-card-body">
                <div className="menu-card-name">{m.dish_name}</div>
                <div className="menu-card-price">Prix : <strong>{m.price} DH</strong></div>
                <div style={{marginBottom:12}}>
                  <span className={`badge ${m.available ? "green" : "red"}`}>
                    {m.available ? "✓ Disponible" : "✕ Indisponible"}
                  </span>
                </div>
                <div className="menu-card-actions">
                  <button
                    className={`btn btn-sm ${m.available ? "btn-outline" : "btn-primary"}`}
                    onClick={() => handleToggle(m)}
                  >
                    {m.available ? "Désactiver" : "Activer"}
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">Ajouter un plat</div>
            <div className="form-group">
              <label className="form-label">Nom du plat *</label>
              <input className="form-input" placeholder="ex : Couscous Royal"
                value={form.dish_name} onChange={e=>setForm(f=>({...f,dish_name:e.target.value}))}/>
            </div>
            <div className="form-group">
              <label className="form-label">Prix (DH) *</label>
              <input className="form-input" type="number" min="0" step="0.5" placeholder="ex : 25"
                value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))}/>
            </div>
            <div className="form-group">
              <label className="form-label">Date du menu *</label>
              <input className="form-input" type="date"
                value={form.menu_date} onChange={e=>setForm(f=>({...f,menu_date:e.target.value}))}/>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={saving}>
                {saving ? "Ajout…" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}