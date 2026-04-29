import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const DISH_EMOJIS = ["🍛","🥗","🍲","🥘","🍜","🥙","🫕","🍱","🍝","🥗"];

function ImagePicker({ value, onChange }) {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null);

  const pick = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    onChange(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 140,
        borderRadius: 10,
        border: "2px dashed var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        background: "#f8f9fa",
        overflow: "hidden",
        backgroundImage: preview ? `url(${preview})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      onClick={() => inputRef.current.click()}
    >
      {!preview && (
        <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>📷</div>
          <div style={{ fontSize: 12 }}>Cliquer pour ajouter une photo</div>
          <div style={{ fontSize: 10, marginTop: 2 }}>
            JPG, PNG, WEBP · max 3 Mo
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={pick}
      />
    </div>
  );
};

export default function Menus() {
  const { user } = useAuth();
  const canEdit  = user?.role === "agent" || user?.role === "admin";

  const getLocalDate = () => {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().split("T")[0];
  };

  const [menus,     setMenus]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [toast,     setToast]     = useState(null);
  const [viewDate,  setViewDate]  = useState(getLocalDate());
  const [form,      setForm]      = useState({ dish_name:"", price:"", menu_date: getLocalDate() });
  const [imageFile, setImageFile] = useState(null);

  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const load = (date) => {
    setLoading(true); setError(null);
    API.get(`/menus?date=${date}`)
      .then(res => setMenus(res.data))
      .catch(err => setError(err.response?.data?.message || "Impossible de charger les menus."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(viewDate);
  }, [viewDate]);

  const openModal = () => {
    setForm({ dish_name:"", price:"", menu_date:viewDate });
    setImageFile(null);
    setShowModal(true);
  };

  const handleAdd = async () => {
    if (!form.dish_name.trim() || !form.price || !form.menu_date) {
      showToast("Veuillez remplir tous les champs obligatoires.", "error"); return;
    }
    setSaving(true);
    try {
      const data = new FormData();
      data.append("dish_name", form.dish_name.trim());
      data.append("price", Number(form.price));
      data.append("available", 1);
      data.append("menu_date", form.menu_date);
      if (imageFile) data.append("image", imageFile);

      await API.post("/menus", data, { headers: { "Content-Type": "multipart/form-data" } });
      showToast("Plat ajouté avec succès !");
      setShowModal(false);
      load(viewDate);
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de l'ajout.", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce plat définitivement ?")) return;
    try {
      await API.delete(`/menus/${id}`);
      setMenus(prev => prev.filter(m => m.id !== id));
      showToast("Plat supprimé.");
    } catch (err) { showToast(err.response?.data?.message || "Erreur.", "error"); }
  };

  const handleToggle = async (menu) => {
    const newVal = menu.available ? 0 : 1;
    try {
      await API.put(`/menus/${menu.id}`, { available: newVal });
      setMenus(prev => prev.map(m => m.id === menu.id ? {...m, available:newVal} : m));
    } catch (err) { showToast(err.response?.data?.message || "Erreur.", "error"); }
  };

  const isToday = viewDate === getLocalDate();

  return (
    <div>
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="page-header" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:12}}>
        <div>
          <div className="page-title">Gestion des Menus</div>
          <div className="page-sub">{isToday ? "Menu du jour" : `Menu du ${new Date(viewDate+"T00:00:00").toLocaleDateString("fr-MA",{weekday:"long",day:"numeric",month:"long"})}`}</div>
        </div>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <input type="date" className="form-input" style={{width:170}} value={viewDate}
            onChange={e => setViewDate(e.target.value)} />
          {canEdit && (
            <button className="btn btn-primary" onClick={openModal}>+ Ajouter un plat</button>
          )}
        </div>
      </div>

      {loading && <div className="loading"><div className="spinner"/>Chargement…</div>}
      {!loading && error && (
        <div className="alert error">{error}
          <button className="btn btn-sm btn-outline" style={{marginLeft:10}} onClick={()=>load(viewDate)}>Réessayer</button>
        </div>
      )}

      {!loading && !error && menus.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🍽</div>
          <div className="empty-state-title">Aucun plat pour cette date</div>
          <div className="empty-state-desc">{canEdit ? "Ajoutez des plats pour composer ce menu." : "Le menu n'est pas encore disponible."}</div>
        </div>
      )}

      {!loading && !error && menus.length > 0 && (
        <div className="menus-grid">
          {menus.map((m, i) => (
            <div key={m.id} className="menu-card">
              <div className="menu-card-img">
                {m.image_url
                  ? <img src={m.image_url} alt={m.dish_name}
                      style={{width:"100%",height:"100%",objectFit:"cover"}}
                      onError={e => { e.target.style.display="none"; e.target.nextSibling.style.display="flex"; }}
                    />
                  : null
                }
                <div style={{
                  display: m.image_url ? "none" : "flex",
                  width:"100%", height:"100%",
                  alignItems:"center", justifyContent:"center", fontSize:52
                }}>
                  {DISH_EMOJIS[i % DISH_EMOJIS.length]}
                </div>
              </div>
              <div className="menu-card-body">
                <div className="menu-card-name">{m.dish_name}</div>
                <div className="menu-card-price">Prix : <strong>{m.price} DH</strong></div>
                <div style={{marginBottom:12}}>
                  <span className={`badge ${m.available ? "green" : "red"}`}>
                    {m.available ? "✓ Disponible" : "✕ Indisponible"}
                  </span>
                </div>
                {canEdit && (
                  <div className="menu-card-actions">
                    <button className={`btn btn-sm ${m.available ? "btn-outline" : "btn-primary"}`} onClick={()=>handleToggle(m)}>
                      {m.available ? "Désactiver" : "Activer"}
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(m.id)}>🗑</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999
          }}
        >
          <div className="modal" style={{width:480}}>
            <div className="modal-title">Ajouter un plat au menu</div>

            <div className="form-group">
              <label className="form-label">Photo du plat</label>
              <ImagePicker value={imageFile} onChange={setImageFile} />
            </div>

            <div className="form-group">
              <label className="form-label">Nom du plat *</label>
              <input className="form-input" placeholder="ex : Couscous Royal"
                value={form.dish_name} onChange={e=>setForm(f=>({...f,dish_name:e.target.value}))} autoFocus />
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div className="form-group">
                <label className="form-label">Prix (DH) *</label>
                <input className="form-input" type="number" min="0" step="0.5" placeholder="25"
                  value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Date du menu *</label>
                <input className="form-input" type="date"
                  value={form.menu_date} onChange={e=>setForm(f=>({...f,menu_date:e.target.value}))} />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={saving}>
                {saving ? "Ajout…" : "Ajouter le plat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}