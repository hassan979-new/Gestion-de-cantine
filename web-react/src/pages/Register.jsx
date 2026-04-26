import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form,    setForm]    = useState({ name:"", email:"", password:"", confirm:"", role:"etudiant" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [showPwd, setShowPwd] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (!form.name.trim())   return "Le nom est requis.";
    if (!form.email.trim())  return "L'email est requis.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Email invalide.";
    if (form.password.length < 6) return "Le mot de passe doit contenir au moins 6 caractères.";
    if (form.password !== form.confirm) return "Les mots de passe ne correspondent pas.";
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true); setError(null);
    try {
      await register(form.name.trim(), form.email.trim(), form.password, form.role);
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.message || "Erreur lors de la création du compte.");
    } finally { setLoading(false); }
  };

  const strength = () => {
    const p = form.password;
    if (!p) return { label:"", color:"transparent", width:0 };
    if (p.length < 6) return { label:"Faible", color:"#ef4444", width:30 };
    if (p.length < 10 || !/[0-9]/.test(p)) return { label:"Moyen", color:"#f59e0b", width:60 };
    return { label:"Fort", color:"#10b981", width:100 };
  };
  const s = strength();

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        <div className="auth-logo">🍽</div>
        <div className="auth-title">Créer un compte</div>
        <div className="auth-sub">Rejoignez la Cantine ENS Marrakech</div>

        {error && <div className="alert error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Nom complet *</label>
          <input className="form-input" placeholder="Prénom Nom" value={form.name} onChange={set("name")} autoFocus />
        </div>

        <div className="form-group">
          <label className="form-label">Adresse Email *</label>
          <input className="form-input" type="email" placeholder="votre@email.ma" value={form.email} onChange={set("email")} />
        </div>

        <div className="form-group">
          <label className="form-label">Type de compte</label>
          <select className="form-select" value={form.role} onChange={set("role")}>
            <option value="agent">Agent Cantine</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Mot de passe *</label>
          <div style={{ position:"relative" }}>
            <input className="form-input" type={showPwd ? "text" : "password"}
              placeholder="Min. 6 caractères" value={form.password} onChange={set("password")}
              style={{ paddingRight:44 }} />
            <button type="button" onClick={() => setShowPwd(v=>!v)}
              style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text-muted)" }}>
              {showPwd ? "🙈" : "👁"}
            </button>
          </div>
          {form.password && (
            <div style={{ marginTop:6 }}>
              <div style={{ height:4, borderRadius:4, background:"#e9ecef", overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${s.width}%`, background:s.color, transition:"width .3s,background .3s" }}/>
              </div>
              <div style={{ fontSize:11, color:s.color, marginTop:3, fontWeight:600 }}>{s.label}</div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Confirmer le mot de passe *</label>
          <input className="form-input" type={showPwd ? "text" : "password"}
            placeholder="Répétez le mot de passe" value={form.confirm} onChange={set("confirm")}
            onKeyDown={e => e.key === "Enter" && submit()} />
          {form.confirm && form.password !== form.confirm && (
            <div style={{ fontSize:11, color:"#ef4444", marginTop:4 }}>Les mots de passe ne correspondent pas.</div>
          )}
          {form.confirm && form.password === form.confirm && form.confirm.length > 0 && (
            <div style={{ fontSize:11, color:"#10b981", marginTop:4 }}>✓ Les mots de passe correspondent.</div>
          )}
        </div>

        <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:"12px" }}
          onClick={submit} disabled={loading}>
          {loading ? "Création…" : "Créer mon compte"}
        </button>

        <p style={{ textAlign:"center", fontSize:13, color:"var(--text-muted)", marginTop:20 }}>
          Déjà un compte ?{" "}
          <Link to="/login" style={{ color:"var(--purple)", fontWeight:700 }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}