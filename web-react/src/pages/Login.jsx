import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [showPwd,  setShowPwd]  = useState(false);

  const submit = async () => {
    if (!email.trim() || !password) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true); setError(null);
    try {
      const user = await login(email.trim(), password);
      navigate(user.role === "etudiant" ? "/" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Identifiants incorrects.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🍽</div>
        <div className="auth-title">Bienvenue</div>
        <div className="auth-sub">Connectez-vous à votre espace Cantine ENS</div>

        {error && <div className="alert error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Adresse Email</label>
          <input className="form-input" type="email" placeholder="votre@email.ma"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()} autoFocus />
        </div>

        <div className="form-group">
          <label className="form-label">Mot de passe</label>
          <div style={{ position: "relative" }}>
            <input className="form-input" type={showPwd ? "text" : "password"}
              placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{ paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text-muted)" }}>
              {showPwd ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        <button className="btn btn-primary" style={{ width:"100%", justifyContent:"center", padding:"12px" }}
          onClick={submit} disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p style={{ textAlign:"center", fontSize:13, color:"var(--text-muted)", marginTop:20 }}>
          Pas encore de compte ?{" "}
          <Link to="/register" style={{ color:"var(--purple)", fontWeight:700 }}>Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}