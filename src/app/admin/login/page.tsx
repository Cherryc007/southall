"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--brand-dark)", padding: 20 }}>
      <div className="card card-pad" style={{ width: "100%", maxWidth: 400, background: "white" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 140, height: 140, background: "white", borderRadius: 20, padding: 12, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
            <img src="/logo.jpeg" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "var(--brand-dark)", letterSpacing: -0.5 }}>Southall Kitchens</h1>
          <p style={{ color: "var(--brand-gold)", fontSize: 15, fontWeight: 700, marginTop: 4 }}>Treat the Buds</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>

          {error && <div style={{ color: "var(--error)", fontSize: 14, background: "var(--error-bg)", padding: 12, borderRadius: "var(--radius-sm)" }}>{error}</div>}

          <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? <span className="spinner spinner-dark" /> : "Secure Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
