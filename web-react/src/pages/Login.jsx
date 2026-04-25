import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const navigate = useNavigate();

  const login = async () => {
    if (!email.trim() || !password) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await API.post("/auth/login", { email: email.trim(), password });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🍽</div>
        <div className="login-title">Cantine ENS</div>
        <div className="login-sub">Connectez-vous à votre espace de gestion</div>

        {error && <div className="alert error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Adresse Email</label>
          <input
            className="form-input"
            type="email"
            placeholder="votre@email.ma"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key==="Enter" && login()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Mot de passe</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key==="Enter" && login()}
          />
        </div>

        <button className="btn btn-primary" onClick={login} disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"}
        </button>

        <p style={{textAlign:"center",fontSize:12,color:"var(--text-muted)",marginTop:20}}>
          ENS Marrakech — Département Informatique
        </p>
      </div>
    </div>
  );
}