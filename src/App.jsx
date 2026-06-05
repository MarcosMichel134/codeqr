import { useState } from "react";

/* 
   STYLES GLOBAUX
 */
const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #070912;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #e2e8f0;
  overflow-x: hidden;
}

input, select, textarea, button {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: rgba(56,189,248,0.5) !important;
  box-shadow: 0 0 0 3px rgba(56,189,248,0.06) !important;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb {
  background: rgba(56,189,248,0.2);
  border-radius: 4px;
}

input[type=color] {
  -webkit-appearance: none;
  width: 30px; height: 30px;
  border: none; background: none;
  cursor: pointer; padding: 0;
  border-radius: 5px;
}
input[type=color]::-webkit-color-swatch-wrapper { padding: 0; }
input[type=color]::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.fu { animation: fadeUp 0.28s ease both; }
.fi { animation: fadeIn 0.2s ease both; }

.gbg {
  position: fixed; inset: 0;
  background-image:
    linear-gradient(rgba(56,189,248,0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(56,189,248,0.022) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
  z-index: 0;
}

.card-h:hover {
  border-color: rgba(80,180,255,0.3) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.3) !important;
}
`;

/* 
   PALETTE DE COULEURS
 */
const T = {
  bg: "#070912",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(80,180,255,0.12)",
  borderH: "rgba(80,180,255,0.28)",
  pri: "#38bdf8",
  priD: "rgba(56,189,248,0.1)",
  pur: "#a78bfa",
  purD: "rgba(167,139,250,0.1)",
  grn: "#34d399",
  grnD: "rgba(52,211,153,0.1)",
  ora: "#fb923c",
  text: "#e2e8f0",
  muted: "rgba(226,232,240,0.5)",
  dim: "rgba(226,232,240,0.22)",
  err: "#f87171",
};

/* 
   TYPES DE QR CODE
 */
const TYPES = [
  {
    id: "text",
    icon: "",
    label: "Texte Simple",
    desc: "Message ou information courte",
    color: T.pri,
  },
  {
    id: "image",
    icon: "",
    label: "Image",
    desc: "Photo, illustration, visuel",
    color: "#f472b6",
  },
  {
    id: "pdf",
    icon: "",
    label: "PDF",
    desc: "Document, rapport, brochure",
    color: T.ora,
  },
  {
    id: "vcard",
    icon: "",
    label: "Carte Personnelle",
    desc: "Contact vCard, profil pro",
    color: T.pur,
  },
  {
    id: "social",
    icon: "",
    label: "Réseau Social",
    desc: "Instagram, LinkedIn, TikTok…",
    color: "#f43f5e",
  },
  {
    id: "video",
    icon: "",
    label: "Vidéo",
    desc: "YouTube, Vimeo, lien vidéo",
    color: "#ef4444",
  },
  {
    id: "business",
    icon: "",
    label: "Page Entreprise",
    desc: "Vitrine ou landing page pro",
    color: T.grn,
  },
  {
    id: "app",
    icon: "",
    label: "Application",
    desc: "App Store / Play Store",
    color: "#0ea5e9",
  },
  {
    id: "restaurant",
    icon: "",
    label: "Menu Restaurant",
    desc: "Carte ou menu interactif",
    color: "#f59e0b",
  },
];

/* 
   DONNÉES SIMULÉES (scans fictifs)
 */
const COUNTRIES = [
  "France",
  "Sénégal",
  "Canada",
  "Côte d'Ivoire",
  "Belgique",
  "Maroc",
  "Cameroun",
  "USA",
  "Tunisie",
  "Gabon",
];
const CITIES = {
  France: ["Paris", "Lyon", "Marseille", "Bordeaux"],
  Sénégal: ["Dakar", "Thiès", "Saint-Louis", "Ziguinchor"],
  Canada: ["Montréal", "Toronto", "Québec"],
  "Côte d'Ivoire": ["Abidjan", "Bouaké", "Yamoussoukro"],
  Belgique: ["Bruxelles", "Liège", "Gand"],
  Maroc: ["Casablanca", "Rabat", "Marrakech"],
  Cameroun: ["Douala", "Yaoundé"],
  USA: ["New York", "Los Angeles", "Chicago"],
  Tunisie: ["Tunis", "Sfax"],
  Gabon: ["Libreville", "Port-Gentil"],
};

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

const fdt = (d) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
const fhr = (d) =>
  new Date(d).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

const genScans = (n, days = 30) =>
  Array.from({ length: n }, () => {
    const c = COUNTRIES[~~(Math.random() * COUNTRIES.length)];
    const list = CITIES[c] || ["Capitale"];
    const city = list[~~(Math.random() * list.length)];
    const d = new Date();
    d.setDate(d.getDate() - ~~(Math.random() * days));
    d.setHours(~~(Math.random() * 24), ~~(Math.random() * 60));
    return {
      id: uid(),
      date: d.toISOString(),
      country: c,
      city,
      ip: `${~~(Math.random() * 200) + 10}.${~~(Math.random() * 255)}.${~~(Math.random() * 255)}.${~~(Math.random() * 255)}`,
      device: ["Mobile", "Desktop", "Tablette"][~~(Math.random() * 3)],
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

/* 
   CONTENU DU QR (selon type)
 */
const buildContent = (type, cfg = {}) => {
  switch (type) {
    case "text":
      return cfg.text || "Bonjour depuis QR Studio !";
    case "image":
      return cfg.url || "https://example.com/image.jpg";
    case "pdf":
      return cfg.url || "https://example.com/doc.pdf";
    case "video":
      return cfg.url || "https://youtube.com/watch?v=dQw4w9WgXcQ";
    case "social":
      return (
        cfg.profileUrl || `https://instagram.com/${cfg.username || "username"}`
      );
    case "vcard":
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${cfg.firstName || ""} ${cfg.lastName || ""}\nORG:${cfg.company || ""}\nTITLE:${cfg.title || ""}\nTEL:${cfg.phone || ""}\nEMAIL:${cfg.email || ""}\nURL:${cfg.website || ""}\nEND:VCARD`;
    case "business":
      return (
        cfg.website ||
        `https://${(cfg.name || "mon-entreprise").toLowerCase().replace(/\s/g, "-")}.com`
      );
    case "app":
      return (
        cfg.universalLink ||
        cfg.playStore ||
        cfg.appStore ||
        "https://play.google.com"
      );
    case "restaurant":
      return (
        cfg.website ||
        `https://${(cfg.name || "mon-restaurant").toLowerCase().replace(/\s/g, "-")}.com`
      );
    default:
      return "https://qrstudio.app";
  }
};

/* Génération URL QR via api.qrserver.com (gratuite, pas de clé API) */
const qrUrl = (content, fmt = {}) => {
  const { fg = "000000", bg = "ffffff", size = 220 } = fmt;
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}&color=${fg.replace("#", "")}&bgcolor=${bg.replace("#", "")}&ecc=M&margin=1`;
};

/* 
   COMPOSANTS UI RÉUTILISABLES
 */
const Lbl = ({ c }) => (
  <div
    style={{
      fontSize: "0.6rem",
      color: T.muted,
      marginBottom: "0.32rem",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      fontFamily:
        "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
    }}
  >
    {c}
  </div>
);

const Inp = ({ label, area, ...p }) => (
  <div style={{ marginBottom: "0.9rem" }}>
    {label && <Lbl c={label} />}
    {area ? (
      <textarea
        {...p}
        style={{
          width: "100%",
          background: "rgba(0,0,0,0.32)",
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          color: T.text,
          fontSize: "0.83rem",
          padding: "0.65rem 0.85rem",
          resize: "vertical",
          minHeight: 76,
          lineHeight: 1.5,
          ...(p.style || {}),
        }}
      />
    ) : (
      <input
        {...p}
        style={{
          width: "100%",
          background: "rgba(0,0,0,0.32)",
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          color: T.text,
          fontSize: "0.83rem",
          padding: "0.65rem 0.85rem",
          ...(p.style || {}),
        }}
      />
    )}
  </div>
);

const Sel = ({ label, opts, ...p }) => (
  <div style={{ marginBottom: "0.9rem" }}>
    {label && <Lbl c={label} />}
    <div style={{ position: "relative" }}>
      <select
        {...p}
        style={{
          width: "100%",
          background: "rgba(0,0,0,0.32)",
          border: `1px solid ${T.border}`,
          borderRadius: 8,
          color: T.text,
          fontSize: "0.83rem",
          padding: "0.65rem 1.8rem 0.65rem 0.85rem",
          appearance: "none",
          cursor: "pointer",
        }}
      >
        {opts.map((o) => (
          <option key={o.v ?? o} value={o.v ?? o}>
            {o.l ?? o}
          </option>
        ))}
      </select>
      <span
        style={{
          position: "absolute",
          right: "0.7rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: T.dim,
          pointerEvents: "none",
          fontSize: "0.75rem",
        }}
      ></span>
    </div>
  </div>
);

const VARIANTS = {
  pri: {
    bg: `linear-gradient(135deg,${T.pri},#0284c7)`,
    color: "#020617",
    border: "none",
  },
  out: { bg: "transparent", color: T.pri, border: `1px solid ${T.borderH}` },
  ghost: {
    bg: "rgba(255,255,255,0.04)",
    color: T.muted,
    border: `1px solid ${T.border}`,
  },
  grn: {
    bg: `linear-gradient(135deg,${T.grn},#059669)`,
    color: "#020617",
    border: "none",
  },
  pur: {
    bg: `linear-gradient(135deg,${T.pur},#7c3aed)`,
    color: "#fff",
    border: "none",
  },
  red: {
    bg: "rgba(248,113,113,0.08)",
    color: T.err,
    border: `1px solid rgba(248,113,113,0.28)`,
  },
};

const Btn = ({
  children,
  v = "pri",
  full,
  sm,
  onClick,
  style: s,
  disabled,
}) => {
  const vv = VARIANTS[v] || VARIANTS.pri;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: vv.bg,
        color: vv.color,
        border: vv.border,
        borderRadius: 8,
        padding: sm ? "0.38rem 0.85rem" : "0.72rem 1.4rem",
        fontSize: sm ? "0.74rem" : "0.84rem",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        width: full ? "100%" : "auto",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: "0.32rem",
        justifyContent: "center",
        transition: "opacity .15s, transform .15s",
        ...s,
      }}
    >
      {children}
    </button>
  );
};

const Card = ({ children, style: s, onClick, hover }) => (
  <div
    onClick={onClick}
    className={hover ? "card-h" : ""}
    style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 13,
      padding: "1.4rem",
      transition: "all .2s",
      cursor: onClick ? "pointer" : "default",
      ...s,
    }}
  >
    {children}
  </div>
);

const StatCard = ({ icon, label, value, color = T.pri, sub }) => (
  <Card>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      <div>
        <div
          style={{
            fontSize: "0.62rem",
            color: T.muted,
            letterSpacing: "0.09em",
            marginBottom: "0.35rem",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            color,
            letterSpacing: "-0.03em",
          }}
        >
          {value}
        </div>
        {sub && (
          <div
            style={{ fontSize: "0.66rem", color: T.dim, marginTop: "0.18rem" }}
          >
            {sub}
          </div>
        )}
      </div>
      <div style={{ fontSize: "1.4rem" }}>{icon}</div>
    </div>
  </Card>
);

const Nav = ({ user, go, logout }) => (
  <nav
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      background: "rgba(7,9,18,0.92)",
      borderBottom: `1px solid ${T.border}`,
      backdropFilter: "blur(18px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 1.5rem",
      zIndex: 100,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.45rem",
        cursor: "pointer",
      }}
      onClick={() => go(user ? "dash" : "land")}
    >
      <div
        style={{
          width: 33,
          height: 33,
          background: `linear-gradient(135deg,${T.pri},${T.pur})`,
          borderRadius: 9,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
        }}
      ></div>
      <span
        style={{
          fontWeight: 800,
          color: T.text,
          fontSize: "0.98rem",
          letterSpacing: "-0.02em",
        }}
      >
        QR<span style={{ color: T.pri }}>Studio</span>
      </span>
    </div>
    {user ? (
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        <span style={{ fontSize: "0.78rem", color: T.muted }}>{user.name}</span>
        <Btn v="ghost" sm onClick={logout}>
          Déconnexion
        </Btn>
      </div>
    ) : (
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <Btn v="ghost" sm onClick={() => go("auth")}>
          Connexion
        </Btn>
        <Btn sm onClick={() => go("auth")}>
          S'inscrire
        </Btn>
      </div>
    )}
  </nav>
);

const Wrap = ({ children }) => (
  <div
    className="fu"
    style={{
      minHeight: "100vh",
      paddingTop: 76,
      padding: "76px 1.25rem 3rem",
      maxWidth: 960,
      margin: "0 auto",
    }}
  >
    {children}
  </div>
);

const PgTitle = ({ title, sub, back, onBack }) => (
  <div style={{ marginBottom: "1.75rem" }}>
    {back && (
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: T.muted,
          cursor: "pointer",
          fontSize: "0.78rem",
          marginBottom: "0.65rem",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        ← {back}
      </button>
    )}
    <h1
      style={{
        fontSize: "1.7rem",
        fontWeight: 800,
        color: T.text,
        letterSpacing: "-0.03em",
      }}
    >
      {title}
    </h1>
    {sub && (
      <p style={{ color: T.muted, marginTop: "0.35rem", fontSize: "0.87rem" }}>
        {sub}
      </p>
    )}
  </div>
);

const G2 = ({ children }) => (
  <div
    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 0.9rem" }}
  >
    {children}
  </div>
);

const CP = ({ label, val, onChange }) => (
  <div style={{ marginBottom: "0.9rem" }}>
    <Lbl c={label} />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "rgba(0,0,0,0.32)",
        border: `1px solid ${T.border}`,
        borderRadius: 8,
        padding: "0.42rem 0.75rem",
      }}
    >
      <input type="color" value={val} onChange={onChange} />
      <span
        style={{
          fontSize: "0.74rem",
          color: T.muted,
          fontFamily:
            "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
        }}
      >
        {val}
      </span>
    </div>
  </div>
);

/* 
   PAGE — LANDING
 */
const Landing = ({ go }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "5rem 1.25rem 3rem",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div className="gbg" />
    <div
      style={{
        position: "absolute",
        top: "5%",
        right: "-8%",
        width: 520,
        height: 520,
        background: `radial-gradient(circle,rgba(56,189,248,0.07),transparent 68%)`,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: "5%",
        left: "-8%",
        width: 440,
        height: 440,
        background: `radial-gradient(circle,rgba(167,139,250,0.07),transparent 68%)`,
        pointerEvents: "none",
      }}
    />

    <div
      className="fu"
      style={{
        textAlign: "center",
        maxWidth: 680,
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.45rem",
          background: T.priD,
          border: `1px solid rgba(56,189,248,0.2)`,
          borderRadius: 20,
          padding: "0.28rem 0.85rem",
          marginBottom: "1.4rem",
          fontSize: "0.72rem",
          color: T.pri,
          fontWeight: 600,
          letterSpacing: "0.05em",
        }}
      >
        Plateforme QR Code Professionnelle
      </div>
      <h1
        style={{
          fontSize: "clamp(2.2rem,5vw,3.6rem)",
          fontWeight: 800,
          color: T.text,
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
          marginBottom: "1.15rem",
        }}
      >
        Créez des QR Codes
        <br />
        <span
          style={{
            background: `linear-gradient(130deg,${T.pri} 20%,${T.pur} 80%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Intelligents & Traçables
        </span>
      </h1>
      <p
        style={{
          fontSize: "0.97rem",
          color: T.muted,
          lineHeight: 1.75,
          maxWidth: 500,
          margin: "0 auto 2.25rem",
        }}
      >
        Générez, personnalisez et publiez vos codes QR. Analysez chaque scan :
        lieu, période, appareil — et gardez le contrôle total.
      </p>
      <div
        style={{
          display: "flex",
          gap: "0.85rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Btn
          onClick={() => go("auth")}
          style={{ fontSize: "0.93rem", padding: "0.82rem 1.9rem" }}
        >
          Commencer gratuitement
        </Btn>
        <Btn
          v="out"
          onClick={() => go("auth")}
          style={{ fontSize: "0.93rem", padding: "0.82rem 1.9rem" }}
        >
          Se connecter →
        </Btn>
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(195px,1fr))",
        gap: "0.9rem",
        maxWidth: 780,
        width: "100%",
        marginTop: "3.75rem",
        position: "relative",
        zIndex: 1,
      }}
    >
      {[
        {
          icon: "",
          title: "9 Types de QR",
          desc: "Image, PDF, vCard, réseaux sociaux, restaurant et plus.",
          c: T.pri,
        },
        {
          icon: "",
          title: "Analytics Réel",
          desc: "Pays, ville, IP, appareil et historique complet.",
          c: T.pur,
        },
        {
          icon: "",
          title: "Contrôle Scans",
          desc: "Limite max, mise à jour et expiration automatique.",
          c: T.grn,
        },
        {
          icon: "",
          title: "100% Personnalisé",
          desc: "Couleurs, thèmes, tailles et correction d'erreur.",
          c: T.ora,
        },
      ].map((f, i) => (
        <Card
          key={i}
          style={{
            textAlign: "center",
            padding: "1.65rem 1.15rem",
            borderColor: `${f.c}22`,
          }}
        >
          <div style={{ fontSize: "1.9rem", marginBottom: "0.65rem" }}>
            {f.icon}
          </div>
          <div
            style={{
              fontWeight: 700,
              color: T.text,
              marginBottom: "0.3rem",
              fontSize: "0.88rem",
            }}
          >
            {f.title}
          </div>
          <div style={{ fontSize: "0.74rem", color: T.muted, lineHeight: 1.5 }}>
            {f.desc}
          </div>
        </Card>
      ))}
    </div>
  </div>
);

/* 
   PAGE — AUTH (Connexion / Inscription)
 */
const Auth = ({ go, onLogin }) => {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", pass: "" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = () => {
    if (!f.email || !f.pass) return;
    onLogin({ name: f.name || f.email.split("@")[0], email: f.email });
    go("dash");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5rem 1.25rem 2rem",
        position: "relative",
      }}
    >
      <div className="gbg" />
      <div
        className="fu"
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Card style={{ padding: "2.25rem" }}>
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div
              style={{
                width: 52,
                height: 52,
                background: `linear-gradient(135deg,${T.pri},${T.pur})`,
                borderRadius: 13,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                margin: "0 auto 0.9rem",
              }}
            ></div>
            <h2
              style={{
                fontSize: "1.45rem",
                fontWeight: 800,
                color: T.text,
                letterSpacing: "-0.02em",
              }}
            >
              QRStudio
            </h2>
            <p
              style={{
                color: T.muted,
                fontSize: "0.82rem",
                marginTop: "0.28rem",
              }}
            >
              {mode === "login"
                ? "Bon retour !"
                : "Créez votre compte gratuit."}
            </p>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              background: "rgba(0,0,0,0.28)",
              borderRadius: 8,
              padding: "0.2rem",
              marginBottom: "1.6rem",
            }}
          >
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  border: "none",
                  borderRadius: 6,
                  background: mode === m ? T.priD : "transparent",
                  color: mode === m ? T.pri : T.muted,
                  fontWeight: mode === m ? 600 : 400,
                  cursor: "pointer",
                  fontSize: "0.82rem",
                  transition: "all .2s",
                }}
              >
                {m === "login" ? "Connexion" : "Inscription"}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <Inp
              label="Nom complet"
              placeholder="Jean Dupont"
              value={f.name}
              onChange={set("name")}
            />
          )}
          <Inp
            label="Email"
            type="email"
            placeholder="vous@exemple.com"
            value={f.email}
            onChange={set("email")}
          />
          <Inp
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={f.pass}
            onChange={set("pass")}
          />
          <Btn full onClick={submit} style={{ marginTop: "0.4rem" }}>
            {mode === "login" ? "Se connecter →" : "Créer mon compte →"}
          </Btn>
          <p
            style={{
              textAlign: "center",
              fontSize: "0.7rem",
              color: T.dim,
              marginTop: "1.1rem",
            }}
          >
            En continuant, vous acceptez les conditions d'utilisation.
          </p>
        </Card>
        <p
          style={{
            textAlign: "center",
            marginTop: "0.9rem",
            fontSize: "0.79rem",
            color: T.muted,
          }}
        >
          {mode === "login" ? "Pas encore de compte ?" : "Déjà inscrit ?"}{" "}
          <span
            style={{ color: T.pri, cursor: "pointer", fontWeight: 600 }}
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </span>
        </p>
      </div>
    </div>
  );
};

/* 
   PAGE — DASHBOARD
 */
const Dashboard = ({ user, qrs, go, onSel, onDel }) => {
  const total = qrs.reduce((s, q) => s + (q.scans?.length || 0), 0);
  const today = new Date().toDateString();
  const todayS = qrs.reduce(
    (s, q) =>
      s +
      (q.scans || []).filter((sc) => new Date(sc.date).toDateString() === today)
        .length,
    0,
  );

  return (
    <Wrap>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.9rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 800,
              color: T.text,
              letterSpacing: "-0.03em",
            }}
          >
            Bonjour, <span style={{ color: T.pri }}>{user?.name}</span>
          </h1>
          <p
            style={{
              color: T.muted,
              marginTop: "0.28rem",
              fontSize: "0.86rem",
            }}
          >
            Gérez vos codes QR et analysez leurs performances.
          </p>
        </div>
        <Btn onClick={() => go("type-select")}>+ Créer un QR</Btn>
      </div>

      {/* Statistiques */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(165px,1fr))",
          gap: "0.85rem",
          marginBottom: "2.25rem",
        }}
      >
        <StatCard icon="" label="QR CRÉÉS" value={qrs.length} color={T.pri} />
        <StatCard icon="" label="TOTAL SCANS" value={total} color={T.pur} />
        <StatCard
          icon=""
          label="EN LIGNE"
          value={qrs.filter((q) => q.published).length}
          color={T.grn}
        />
        <StatCard icon="" label="AUJOURD'HUI" value={todayS} color={T.ora} />
      </div>

      {/* Liste QR */}
      {qrs.length === 0 ? (
        <Card
          style={{
            textAlign: "center",
            padding: "3rem",
            borderStyle: "dashed",
            borderColor: T.borderH,
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "0.9rem" }}></div>
          <div
            style={{
              fontWeight: 700,
              color: T.text,
              marginBottom: "0.45rem",
              fontSize: "1.05rem",
            }}
          >
            Aucun QR code encore
          </div>
          <div
            style={{
              color: T.muted,
              fontSize: "0.83rem",
              marginBottom: "1.65rem",
            }}
          >
            Créez votre premier code QR en quelques clics.
          </div>
          <Btn onClick={() => go("type-select")}>Créer mon premier QR →</Btn>
        </Card>
      ) : (
        <>
          <h2
            style={{
              fontWeight: 700,
              color: T.text,
              marginBottom: "0.9rem",
              fontSize: "0.88rem",
              letterSpacing: "0.05em",
            }}
          >
            MES CODES QR
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(268px,1fr))",
              gap: "0.9rem",
            }}
          >
            {qrs.map((qr) => {
              const ti = TYPES.find((t) => t.id === qr.type) || TYPES[0];
              const scns = qr.scans?.length || 0;
              const pct =
                qr.scanLimit > 0
                  ? Math.min(100, Math.round((scns / qr.scanLimit) * 100))
                  : 0;
              return (
                <Card
                  key={qr.id}
                  hover
                  onClick={() => {
                    onSel(qr);
                    go("analytics");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "0.9rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.7rem",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          background: `${ti.color}18`,
                          border: `1px solid ${ti.color}32`,
                          borderRadius: 9,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "1.1rem",
                          flexShrink: 0,
                        }}
                      >
                        {ti.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: T.text,
                            fontSize: "0.87rem",
                            maxWidth: 135,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {qr.name || ti.label}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: T.muted }}>
                          {ti.label}
                        </div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "0.6rem",
                        background: qr.published
                          ? T.grnD
                          : "rgba(255,255,255,0.04)",
                        color: qr.published ? T.grn : T.muted,
                        border: `1px solid ${qr.published ? T.grn + "32" : "rgba(255,255,255,0.07)"}`,
                        borderRadius: 20,
                        padding: "0.15rem 0.55rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {qr.published ? " En ligne" : " Brouillon"}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.6rem",
                    }}
                  >
                    <span style={{ fontSize: "0.73rem", color: T.muted }}>
                      {scns} scans
                    </span>
                    <span style={{ fontSize: "0.73rem", color: T.dim }}>
                      {qr.scanLimit > 0 ? `Max: ${qr.scanLimit}` : "Illimité"}
                    </span>
                  </div>
                  {qr.scanLimit > 0 && (
                    <div
                      style={{
                        height: 3,
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: 2,
                        overflow: "hidden",
                        marginBottom: "0.6rem",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          background:
                            pct > 80
                              ? `linear-gradient(90deg,${T.ora},${T.err})`
                              : `linear-gradient(90deg,${T.pri},${T.pur})`,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.4rem",
                    }}
                  >
                    <span style={{ fontSize: "0.65rem", color: T.dim }}>
                      {fdt(qr.createdAt)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDel(qr.id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: T.dim,
                        cursor: "pointer",
                        fontSize: "0.78rem",
                        padding: "0.15rem 0.35rem",
                        borderRadius: 4,
                      }}
                    ></button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </Wrap>
  );
};

/* 
   PAGE — ANALYTIQUES
 */
const Analytics = ({ qr, go, onUpdateLimit, onRefresh }) => {
  const [period, setPeriod] = useState("30");
  const [tab, setTab] = useState("overview");
  const [editLim, setEditLim] = useState(false);
  const [newLim, setNewLim] = useState(qr?.scanLimit || 100);

  if (!qr) return null;

  const ti = TYPES.find((t) => t.id === qr.type) || TYPES[0];
  const scans = qr.scans || [];
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - parseInt(period));
  const fil = scans.filter((s) => new Date(s.date) >= cutoff);
  const days = Math.min(parseInt(period), 14);

  const trend = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1) + i);
    return {
      date: d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
      scans: fil.filter(
        (s) => new Date(s.date).toDateString() === d.toDateString(),
      ).length,
    };
  });

  const byCo = Object.entries(
    fil.reduce((a, s) => {
      a[s.country] = (a[s.country] || 0) + 1;
      return a;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, count]) => ({ name, count }));
  const byDev = Object.entries(
    fil.reduce((a, s) => {
      a[s.device] = (a[s.device] || 0) + 1;
      return a;
    }, {}),
  ).map(([name, count]) => ({ name, count }));
  const DC = [T.pri, T.pur, T.grn];

  const pct =
    qr.scanLimit > 0
      ? Math.min(100, Math.round((scans.length / qr.scanLimit) * 100))
      : 0;
  const content = buildContent(qr.type, qr.typeConfig);
  const qrImg = qrUrl(content, qr.format);

  const TABS = [
    { id: "overview", l: "Aperçu" },
    { id: "history", l: "Historique" },
    { id: "geo", l: "Géographie" },
  ];

  return (
    <Wrap>
      <PgTitle
        title="Analytiques"
        sub={`QR: ${qr.name || ti.label}`}
        back="Tableau de bord"
        onBack={() => go("dash")}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "255px 1fr",
          gap: "1.15rem",
          alignItems: "start",
        }}
      >
        {/* Colonne gauche — carte QR + limite */}
        <div>
          <Card
            style={{
              textAlign: "center",
              padding: "1.6rem",
              marginBottom: "0.9rem",
              borderColor: `${ti.color}22`,
            }}
          >
            <span
              style={{
                background: `${ti.color}18`,
                color: ti.color,
                border: `1px solid ${ti.color}32`,
                borderRadius: 20,
                padding: "0.18rem 0.65rem",
                fontSize: "0.7rem",
                fontWeight: 600,
              }}
            >
              {ti.icon} {ti.label}
            </span>
            <div
              style={{
                background: qr.format?.bg || "#fff",
                borderRadius: 9,
                padding: "0.9rem",
                display: "inline-block",
                margin: "1rem 0",
                boxShadow: `0 0 28px rgba(56,189,248,0.17)`,
              }}
            >
              <img
                src={qrImg}
                width={150}
                height={150}
                alt="QR"
                style={{ display: "block", borderRadius: 4 }}
              />
            </div>
            <div
              style={{
                fontWeight: 700,
                color: T.text,
                fontSize: "0.88rem",
                marginBottom: "0.22rem",
              }}
            >
              {qr.name || ti.label}
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                color: T.muted,
                marginBottom: "1.1rem",
                wordBreak: "break-all",
                lineHeight: 1.4,
              }}
            >
              {content.slice(0, 55)}
              {content.length > 55 ? "…" : ""}
            </div>
            <a
              href={qrImg}
              download="qrcode.png"
              style={{ textDecoration: "none", display: "block" }}
            >
              <Btn v="out" full sm>
                ↓ Télécharger PNG
              </Btn>
            </a>
          </Card>

          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.7rem",
              }}
            >
              <div
                style={{ fontWeight: 700, color: T.text, fontSize: "0.83rem" }}
              >
                Limite de scans
              </div>
              <span
                onClick={() => setEditLim(!editLim)}
                style={{ color: T.pri, fontSize: "0.73rem", cursor: "pointer" }}
              ></span>
            </div>
            {editLim ? (
              <>
                <Inp
                  label="Nouveau maximum"
                  type="number"
                  min={scans.length}
                  value={newLim}
                  onChange={(e) => setNewLim(+e.target.value)}
                />
                <div style={{ display: "flex", gap: "0.45rem" }}>
                  <Btn
                    v="grn"
                    sm
                    full
                    onClick={() => {
                      onUpdateLimit(qr.id, newLim);
                      setEditLim(false);
                    }}
                  >
                    Appliquer
                  </Btn>
                  <Btn v="ghost" sm onClick={() => setEditLim(false)}></Btn>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    marginBottom: "0.45rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.35rem",
                      fontWeight: 800,
                      color: T.text,
                    }}
                  >
                    {scans.length}
                    <span
                      style={{
                        fontSize: "0.76rem",
                        color: T.muted,
                        fontWeight: 400,
                      }}
                    >
                      /{qr.scanLimit > 0 ? qr.scanLimit : "∞"}
                    </span>
                  </span>
                  {qr.scanLimit > 0 && (
                    <span
                      style={{
                        color: pct > 80 ? T.err : T.pri,
                        fontWeight: 700,
                        fontSize: "0.82rem",
                      }}
                    >
                      {pct}%
                    </span>
                  )}
                </div>
                {qr.scanLimit > 0 && (
                  <div
                    style={{
                      height: 5,
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background:
                          pct > 80
                            ? `linear-gradient(90deg,${T.ora},${T.err})`
                            : `linear-gradient(90deg,${T.pri},${T.pur})`,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                )}
              </>
            )}
            <Btn
              v="ghost"
              sm
              full
              onClick={() => onRefresh(qr.id)}
              style={{ marginTop: "0.85rem" }}
            >
              Simuler nouveaux scans
            </Btn>
          </Card>
        </div>

        {/* Colonne droite — graphiques */}
        <div>
          <div
            style={{
              display: "flex",
              gap: "0.4rem",
              marginBottom: "1.1rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: "0.42rem 0.85rem",
                  borderRadius: 8,
                  border: `1px solid ${tab === t.id ? T.borderH : T.border}`,
                  background: tab === t.id ? T.priD : "transparent",
                  color: tab === t.id ? T.pri : T.muted,
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: tab === t.id ? 600 : 400,
                  transition: "all .15s",
                }}
              >
                {t.l}
              </button>
            ))}
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              style={{
                marginLeft: "auto",
                background: "rgba(0,0,0,0.3)",
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                color: T.muted,
                padding: "0.4rem 0.7rem",
                fontSize: "0.74rem",
                outline: "none",
                cursor: "pointer",
              }}
            >
              <option value="7">7 jours</option>
              <option value="30">30 jours</option>
              <option value="90">3 mois</option>
            </select>
          </div>

          {/* TAB : Aperçu */}
          {tab === "overview" && (
            <div className="fi">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: "0.65rem",
                  marginBottom: "0.9rem",
                }}
              >
                <StatCard
                  icon=""
                  label="SCANS PÉRIODE"
                  value={fil.length}
                  color={T.pri}
                />
                <StatCard
                  icon=""
                  label="MOBILES"
                  value={fil.filter((s) => s.device === "Mobile").length}
                  color={T.pur}
                />
                <StatCard
                  icon=""
                  label="PAYS"
                  value={[...new Set(fil.map((s) => s.country))].length}
                  color={T.grn}
                />
              </div>
              <Card style={{ padding: "1.15rem", marginBottom: "0.9rem" }}>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: T.text,
                    marginBottom: "0.9rem",
                  }}
                >
                  Évolution
                </div>
                <div style={{ display: "grid", gap: "0.45rem" }}>
                  {trend.map((point) => (
                    <div
                      key={point.date}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "0.8rem",
                        padding: "0.7rem",
                        borderRadius: 10,
                        background: "rgba(255,255,255,0.04)",
                      }}
                    >
                      <span style={{ color: T.muted, fontSize: "0.77rem" }}>
                        {point.date}
                      </span>
                      <span style={{ fontWeight: 700, color: T.text }}>
                        {point.scans} scan{point.scans !== 1 ? "s" : ""}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "3fr 2fr",
                  gap: "0.8rem",
                }}
              >
                <Card style={{ padding: "1.15rem" }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: T.text,
                      marginBottom: "0.8rem",
                    }}
                  >
                    Top pays
                  </div>
                  <div style={{ display: "grid", gap: "0.5rem" }}>
                    {byCo.length === 0 ? (
                      <div
                        style={{
                          color: T.muted,
                          fontSize: "0.82rem",
                          padding: "1rem 0",
                        }}
                      >
                        Aucun scan sur cette période.
                      </div>
                    ) : (
                      byCo.map((item) => (
                        <div
                          key={item.name}
                          style={{ display: "grid", gap: "0.3rem" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              fontSize: "0.78rem",
                              color: T.text,
                            }}
                          >
                            <span>{item.name}</span>
                            <span>{item.count}</span>
                          </div>
                          <div
                            style={{
                              height: 8,
                              width: "100%",
                              borderRadius: 999,
                              background: "rgba(255,255,255,0.08)",
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(100, item.count * 10)}%`,
                                height: "100%",
                                borderRadius: 999,
                                background: T.pri,
                              }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
                <Card style={{ padding: "1.15rem" }}>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      color: T.text,
                      marginBottom: "0.8rem",
                    }}
                  >
                    Appareils
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gap: "0.85rem",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {byDev.length === 0 ? (
                      <div
                        style={{
                          color: T.muted,
                          fontSize: "0.82rem",
                          padding: "1rem 0",
                        }}
                      >
                        Aucun scan sur cette période.
                      </div>
                    ) : (
                      byDev.map((d, i) => (
                        <div
                          key={d.name}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "0.7rem",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.55rem",
                            }}
                          >
                            <span
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                background: DC[i % DC.length],
                                display: "inline-block",
                              }}
                            />
                            <span
                              style={{ color: T.text, fontSize: "0.78rem" }}
                            >
                              {d.name}
                            </span>
                          </div>
                          <span style={{ color: T.muted, fontSize: "0.78rem" }}>
                            {d.count}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB : Historique */}
          {tab === "history" && (
            <div className="fi">
              <Card style={{ padding: "1.15rem" }}>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: T.text,
                    marginBottom: "0.9rem",
                  }}
                >
                  Historique ({fil.length} scans)
                </div>
                {fil.length === 0 ? (
                  <div
                    style={{
                      color: T.muted,
                      textAlign: "center",
                      padding: "2rem",
                      fontSize: "0.82rem",
                    }}
                  >
                    Aucun scan sur cette période.
                  </div>
                ) : (
                  <div style={{ maxHeight: 420, overflowY: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${T.border}` }}>
                          {[
                            "Date",
                            "Heure",
                            "Pays",
                            "Ville",
                            "IP",
                            "Appareil",
                          ].map((h) => (
                            <th
                              key={h}
                              style={{
                                textAlign: "left",
                                padding: "0.45rem",
                                fontSize: "0.6rem",
                                color: T.dim,
                                letterSpacing: "0.08em",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {fil.map((s) => (
                          <tr
                            key={s.id}
                            style={{
                              borderBottom: `1px solid rgba(255,255,255,0.025)`,
                            }}
                          >
                            <td
                              style={{
                                padding: "0.42rem 0.45rem",
                                fontSize: "0.71rem",
                                color: T.muted,
                              }}
                            >
                              {fdt(s.date)}
                            </td>
                            <td
                              style={{
                                padding: "0.42rem 0.45rem",
                                fontSize: "0.71rem",
                                color: T.dim,
                              }}
                            >
                              {fhr(s.date)}
                            </td>
                            <td
                              style={{
                                padding: "0.42rem 0.45rem",
                                fontSize: "0.71rem",
                                color: T.text,
                              }}
                            >
                              {s.country}
                            </td>
                            <td
                              style={{
                                padding: "0.42rem 0.45rem",
                                fontSize: "0.71rem",
                                color: T.muted,
                              }}
                            >
                              {s.city}
                            </td>
                            <td
                              style={{
                                padding: "0.42rem 0.45rem",
                                fontSize: "0.65rem",
                                color: T.dim,
                                fontFamily:
                                  "ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace",
                              }}
                            >
                              {s.ip}
                            </td>
                            <td
                              style={{
                                padding: "0.42rem 0.45rem",
                                fontSize: "0.7rem",
                                color: T.pri,
                                fontWeight: 500,
                              }}
                            >
                              {s.device}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB : Géographie */}
          {tab === "geo" && (
            <div className="fi">
              <Card style={{ padding: "1.15rem", marginBottom: "0.9rem" }}>
                <div
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: T.text,
                    marginBottom: "0.9rem",
                  }}
                >
                  Scans par pays
                </div>
                <div style={{ display: "grid", gap: "0.65rem" }}>
                  {byCo.length === 0 ? (
                    <div
                      style={{
                        color: T.muted,
                        fontSize: "0.82rem",
                        padding: "1rem 0",
                      }}
                    >
                      Aucun pays enregistré.
                    </div>
                  ) : (
                    byCo.map((c) => (
                      <div
                        key={c.name}
                        style={{ display: "grid", gap: "0.35rem" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "0.8rem",
                            color: T.text,
                          }}
                        >
                          <span>{c.name}</span>
                          <span>{c.count}</span>
                        </div>
                        <div
                          style={{
                            height: 10,
                            width: "100%",
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.08)",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(100, c.count * 10)}%`,
                              height: "100%",
                              borderRadius: 999,
                              background: T.pur,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(185px,1fr))",
                  gap: "0.7rem",
                }}
              >
                {byCo.map((c) => (
                  <Card key={c.name} style={{ padding: "0.95rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: T.text,
                            fontSize: "0.86rem",
                          }}
                        >
                          {c.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.66rem",
                            color: T.muted,
                            marginTop: "0.18rem",
                            lineHeight: 1.4,
                          }}
                        >
                          {[
                            ...new Set(
                              fil
                                .filter((s) => s.country === c.name)
                                .map((s) => s.city),
                            ),
                          ]
                            .slice(0, 3)
                            .join(", ")}
                        </div>
                      </div>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: "1.25rem",
                          color: T.pri,
                          flexShrink: 0,
                          marginLeft: "0.4rem",
                        }}
                      >
                        {c.count}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrap>
  );
};

/* 
   PAGE — SÉLECTION DU TYPE
 */
const TypeSelect = ({ go, onType }) => (
  <Wrap>
    <PgTitle
      title="Quel type de QR ?"
      sub="Choisissez où votre code QR dirigera l'utilisateur."
      back="Tableau de bord"
      onBack={() => go("dash")}
    />
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill,minmax(188px,1fr))",
        gap: "0.9rem",
      }}
    >
      {TYPES.map((t) => (
        <Card
          key={t.id}
          hover
          onClick={() => {
            onType(t.id);
            go("config");
          }}
          style={{
            textAlign: "center",
            padding: "1.85rem 1.1rem",
            cursor: "pointer",
            borderColor: `${t.color}18`,
          }}
        >
          <div style={{ fontSize: "2.3rem", marginBottom: "0.7rem" }}>
            {t.icon}
          </div>
          <div
            style={{
              fontWeight: 700,
              color: T.text,
              marginBottom: "0.3rem",
              fontSize: "0.9rem",
            }}
          >
            {t.label}
          </div>
          <div
            style={{ fontSize: "0.73rem", color: T.muted, lineHeight: 1.45 }}
          >
            {t.desc}
          </div>
        </Card>
      ))}
    </div>
  </Wrap>
);

/* 
   FORMULAIRES PAR TYPE
 */
const FORMS = {
  text: ({ v, s }) => (
    <Inp
      label="Texte"
      area
      placeholder="Entrez votre texte ici…"
      value={v.text || ""}
      onChange={(e) => s("text", e.target.value)}
      style={{ minHeight: 110 }}
    />
  ),
  image: ({ v, s }) => (
    <>
      <Inp
        label="URL de l'image *"
        type="url"
        placeholder="https://exemple.com/photo.jpg"
        value={v.url || ""}
        onChange={(e) => s("url", e.target.value)}
      />
      <Inp
        label="Titre"
        placeholder="Titre de l'image"
        value={v.title || ""}
        onChange={(e) => s("title", e.target.value)}
      />
      <Inp
        label="Description"
        area
        value={v.desc || ""}
        onChange={(e) => s("desc", e.target.value)}
      />
    </>
  ),
  pdf: ({ v, s }) => (
    <>
      <Inp
        label="URL du PDF *"
        type="url"
        placeholder="https://exemple.com/doc.pdf"
        value={v.url || ""}
        onChange={(e) => s("url", e.target.value)}
      />
      <Inp
        label="Titre"
        placeholder="Mon Document"
        value={v.title || ""}
        onChange={(e) => s("title", e.target.value)}
      />
      <Inp
        label="Description"
        area
        value={v.desc || ""}
        onChange={(e) => s("desc", e.target.value)}
      />
    </>
  ),
  vcard: ({ v, s }) => (
    <>
      <G2>
        <Inp
          label="Prénom"
          placeholder="Jean"
          value={v.firstName || ""}
          onChange={(e) => s("firstName", e.target.value)}
        />
        <Inp
          label="Nom"
          placeholder="Dupont"
          value={v.lastName || ""}
          onChange={(e) => s("lastName", e.target.value)}
        />
      </G2>
      <Inp
        label="Poste / Titre"
        placeholder="Développeuse Web"
        value={v.title || ""}
        onChange={(e) => s("title", e.target.value)}
      />
      <Inp
        label="Entreprise"
        placeholder="Ma Société"
        value={v.company || ""}
        onChange={(e) => s("company", e.target.value)}
      />
      <G2>
        <Inp
          label="Téléphone"
          type="tel"
          placeholder="+221 77 000 00 00"
          value={v.phone || ""}
          onChange={(e) => s("phone", e.target.value)}
        />
        <Inp
          label="Email"
          type="email"
          placeholder="jean@exemple.com"
          value={v.email || ""}
          onChange={(e) => s("email", e.target.value)}
        />
      </G2>
      <Inp
        label="Site web"
        type="url"
        value={v.website || ""}
        onChange={(e) => s("website", e.target.value)}
      />
      <Inp
        label="Adresse"
        placeholder="12 Rue Dakar"
        value={v.address || ""}
        onChange={(e) => s("address", e.target.value)}
      />
    </>
  ),
  social: ({ v, s }) => (
    <>
      <Sel
        label="Plateforme"
        value={v.platform || "instagram"}
        onChange={(e) => s("platform", e.target.value)}
        opts={[
          { v: "instagram", l: "Instagram" },
          { v: "tiktok", l: "TikTok" },
          { v: "linkedin", l: "LinkedIn" },
          { v: "twitter", l: "Twitter/X" },
          { v: "youtube", l: "YouTube" },
          { v: "facebook", l: "Facebook" },
        ]}
      />
      <Inp
        label="Nom d'utilisateur (@)"
        placeholder="mon_username"
        value={v.username || ""}
        onChange={(e) => s("username", e.target.value)}
      />
      <Inp
        label="URL du profil"
        type="url"
        value={v.profileUrl || ""}
        onChange={(e) => s("profileUrl", e.target.value)}
      />
    </>
  ),
  video: ({ v, s }) => (
    <>
      <Inp
        label="URL de la vidéo *"
        type="url"
        placeholder="https://youtube.com/watch?v=…"
        value={v.url || ""}
        onChange={(e) => s("url", e.target.value)}
      />
      <Inp
        label="Titre"
        value={v.title || ""}
        onChange={(e) => s("title", e.target.value)}
      />
      <Inp
        label="Description"
        area
        value={v.desc || ""}
        onChange={(e) => s("desc", e.target.value)}
      />
    </>
  ),
  business: ({ v, s }) => (
    <>
      <Inp
        label="Nom de l'entreprise *"
        placeholder="Ma Société SARL"
        value={v.name || ""}
        onChange={(e) => s("name", e.target.value)}
      />
      <Inp
        label="Secteur d'activité"
        placeholder="Technologie, Commerce…"
        value={v.sector || ""}
        onChange={(e) => s("sector", e.target.value)}
      />
      <Inp
        label="Description"
        area
        value={v.desc || ""}
        onChange={(e) => s("desc", e.target.value)}
      />
      <G2>
        <Inp
          label="Téléphone"
          type="tel"
          value={v.phone || ""}
          onChange={(e) => s("phone", e.target.value)}
        />
        <Inp
          label="Email"
          type="email"
          value={v.email || ""}
          onChange={(e) => s("email", e.target.value)}
        />
      </G2>
      <Inp
        label="Site web"
        type="url"
        value={v.website || ""}
        onChange={(e) => s("website", e.target.value)}
      />
      <Inp
        label="Horaires"
        placeholder="Lun–Ven 9h–18h"
        value={v.hours || ""}
        onChange={(e) => s("hours", e.target.value)}
      />
    </>
  ),
  app: ({ v, s }) => (
    <>
      <Inp
        label="Nom de l'application *"
        placeholder="Mon Super App"
        value={v.name || ""}
        onChange={(e) => s("name", e.target.value)}
      />
      <Inp
        label="Description"
        area
        value={v.desc || ""}
        onChange={(e) => s("desc", e.target.value)}
      />
      <Inp
        label="App Store (iOS)"
        type="url"
        placeholder="https://apps.apple.com/…"
        value={v.appStore || ""}
        onChange={(e) => s("appStore", e.target.value)}
      />
      <Inp
        label="Play Store (Android)"
        type="url"
        placeholder="https://play.google.com/…"
        value={v.playStore || ""}
        onChange={(e) => s("playStore", e.target.value)}
      />
      <Inp
        label="Lien universel (fallback)"
        type="url"
        value={v.universalLink || ""}
        onChange={(e) => s("universalLink", e.target.value)}
      />
    </>
  ),
  restaurant: ({ v, s }) => (
    <>
      <Inp
        label="Nom du restaurant *"
        placeholder="Le Petit Bistro"
        value={v.name || ""}
        onChange={(e) => s("name", e.target.value)}
      />
      <Inp
        label="Type de cuisine"
        placeholder="Sénégalaise, Française, Italienne…"
        value={v.cuisine || ""}
        onChange={(e) => s("cuisine", e.target.value)}
      />
      <Inp
        label="Description & Ambiance"
        area
        value={v.desc || ""}
        onChange={(e) => s("desc", e.target.value)}
      />
      <Inp
        label="Adresse"
        value={v.address || ""}
        onChange={(e) => s("address", e.target.value)}
      />
      <G2>
        <Inp
          label="Téléphone"
          type="tel"
          value={v.phone || ""}
          onChange={(e) => s("phone", e.target.value)}
        />
        <Inp
          label="Site / Réservation"
          type="url"
          value={v.website || ""}
          onChange={(e) => s("website", e.target.value)}
        />
      </G2>
      <Inp
        label="Horaires"
        placeholder="12h–14h & 19h–22h"
        value={v.hours || ""}
        onChange={(e) => s("hours", e.target.value)}
      />
      <Inp
        label="URL photo du restaurant"
        type="url"
        value={v.imageUrl || ""}
        onChange={(e) => s("imageUrl", e.target.value)}
      />
      <G2>
        <CP
          label="Couleur principale"
          val={v.primaryColor || "#e63946"}
          onChange={(e) => s("primaryColor", e.target.value)}
        />
        <CP
          label="Couleur secondaire"
          val={v.secondaryColor || "#f4a261"}
          onChange={(e) => s("secondaryColor", e.target.value)}
        />
      </G2>
    </>
  ),
};

/* 
   PAGE — CONFIGURATION
 */
const ConfigPage = ({ type, cfg, setCfg, go }) => {
  const ti = TYPES.find((t) => t.id === type) || TYPES[0];
  const F = FORMS[type];
  const set = (k, v) => setCfg((c) => ({ ...c, [k]: v }));

  return (
    <Wrap>
      <PgTitle
        title={`${ti.icon} ${ti.label}`}
        sub="Renseignez les informations de votre QR code."
        back="Type de QR"
        onBack={() => go("type-select")}
      />
      <div style={{ maxWidth: 590 }}>
        <Card style={{ padding: "1.65rem", marginBottom: "1.1rem" }}>
          <div
            style={{
              paddingBottom: "1.1rem",
              marginBottom: "1.1rem",
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <Inp
              label="Nom du QR (pour votre tableau de bord)"
              placeholder={`Mon QR ${ti.label}`}
              value={cfg.qrName || ""}
              onChange={(e) => set("qrName", e.target.value)}
              style={{ marginBottom: 0 }}
            />
          </div>
          {F && <F v={cfg} s={set} />}
        </Card>
        <Btn full onClick={() => go("format")} style={{ padding: "0.88rem" }}>
          Suivant : Format du QR →
        </Btn>
      </div>
    </Wrap>
  );
};

/* 
   PAGE — FORMAT & STYLE
 */
const THEMES = [
  { name: "Classique", fg: "#000000", bg: "#ffffff" },
  { name: "Nuit", fg: "#e2e8f0", bg: "#0f172a" },
  { name: "Cyber", fg: "#00d4ff", bg: "#07080f" },
  { name: "Nature", fg: "#14532d", bg: "#f0fdf4" },
  { name: "Soleil", fg: "#7c2d12", bg: "#fef3c7" },
  { name: "Violet", fg: "#581c87", bg: "#faf5ff" },
];

const FormatPage = ({ draft, setFmt, go }) => {
  const [f, setF] = useState({
    fg: "#000000",
    bg: "#ffffff",
    size: "220",
    ecc: "M",
    ...(draft.format || {}),
  });
  const sf = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const content = buildContent(draft.type, draft.typeConfig);
  const prev = qrUrl(content, f);

  return (
    <Wrap>
      <PgTitle
        title="Format & Style"
        sub="Personnalisez l'apparence de votre code QR."
        back="Configuration"
        onBack={() => go("config")}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "1.25rem",
          alignItems: "start",
          maxWidth: 830,
        }}
      >
        <div>
          <Card style={{ padding: "1.65rem", marginBottom: "1.1rem" }}>
            <div
              style={{
                fontWeight: 700,
                color: T.text,
                marginBottom: "1.1rem",
                fontSize: "0.86rem",
              }}
            >
              Thèmes prédéfinis
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.55rem",
                flexWrap: "wrap",
                marginBottom: "1.6rem",
              }}
            >
              {THEMES.map((th) => (
                <div
                  key={th.name}
                  onClick={() => setF((p) => ({ ...p, fg: th.fg, bg: th.bg }))}
                  style={{
                    cursor: "pointer",
                    border: `2px solid ${f.fg === th.fg && f.bg === th.bg ? T.pri : "transparent"}`,
                    borderRadius: 9,
                    padding: 3,
                    transition: "all .2s",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: th.bg,
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        background: th.fg,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: "0.6rem",
                      color: T.muted,
                      textAlign: "center",
                      marginTop: "0.25rem",
                    }}
                  >
                    {th.name}
                  </div>
                </div>
              ))}
            </div>
            <G2>
              <CP
                label="Couleur du QR"
                val={f.fg}
                onChange={(e) => sf("fg")(e.target.value)}
              />
              <CP
                label="Couleur du fond"
                val={f.bg}
                onChange={(e) => sf("bg")(e.target.value)}
              />
            </G2>
            <G2>
              <Sel
                label="Taille (px)"
                value={f.size}
                onChange={(e) => sf("size")(e.target.value)}
                opts={["150", "200", "220", "260", "300", "350", "400"].map(
                  (v) => ({ v, l: `${v} × ${v} px` }),
                )}
              />
              <Sel
                label="Correction d'erreur"
                value={f.ecc}
                onChange={(e) => sf("ecc")(e.target.value)}
                opts={[
                  { v: "L", l: "L — 7% (léger)" },
                  { v: "M", l: "M — 15% (standard)" },
                  { v: "Q", l: "Q — 25% (bon)" },
                  { v: "H", l: "H — 30% (max)" },
                ]}
              />
            </G2>
          </Card>
          <Btn
            full
            onClick={() => {
              setFmt(f);
              go("preview");
            }}
            style={{ padding: "0.88rem" }}
          >
            Suivant : Aperçu final →
          </Btn>
        </div>
        <div style={{ position: "sticky", top: 76 }}>
          <Card style={{ padding: "1.4rem", textAlign: "center" }}>
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 700,
                color: T.text,
                marginBottom: "0.9rem",
              }}
            >
              Aperçu en direct
            </div>
            <div
              style={{
                background: f.bg,
                borderRadius: 9,
                padding: "0.9rem",
                display: "inline-block",
                boxShadow: `0 0 28px rgba(56,189,248,0.14)`,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <img
                src={prev}
                width={170}
                height={170}
                alt="Preview"
                style={{ display: "block", borderRadius: 4 }}
              />
            </div>
            <div
              style={{
                fontSize: "0.68rem",
                color: T.dim,
                marginTop: "0.65rem",
              }}
            >
              {f.size}×{f.size}px · ECC {f.ecc}
            </div>
          </Card>
        </div>
      </div>
    </Wrap>
  );
};

/* 
   PAGE — APERÇU & PUBLICATION
 */
const PreviewPage = ({ draft, go, onPublish }) => {
  const [scanLimit, setScanLimit] = useState(100);
  const [unlimited, setUnlimited] = useState(false);
  const [done, setDone] = useState(false);

  const { type, typeConfig = {}, format = {} } = draft;
  const ti = TYPES.find((t) => t.id === type) || TYPES[0];
  const content = buildContent(type, typeConfig);
  const qrImg = qrUrl(content, format);

  const publish = () => {
    onPublish({ scanLimit: unlimited ? 0 : scanLimit });
    setDone(true);
    setTimeout(() => go("dash"), 1600);
  };

  return (
    <Wrap>
      <PgTitle
        title="Aperçu & Publication"
        sub="Vérifiez et publiez votre QR code."
        back="Format"
        onBack={() => go("format")}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "300px 1fr",
          gap: "1.25rem",
          alignItems: "start",
          maxWidth: 820,
        }}
      >
        <Card
          style={{
            padding: "1.85rem",
            textAlign: "center",
            borderColor: `${ti.color}20`,
          }}
        >
          <span
            style={{
              background: `${ti.color}18`,
              color: ti.color,
              border: `1px solid ${ti.color}32`,
              borderRadius: 20,
              padding: "0.18rem 0.65rem",
              fontSize: "0.7rem",
              fontWeight: 600,
            }}
          >
            {ti.icon} {ti.label}
          </span>
          <div
            style={{
              background: format.bg || "#fff",
              borderRadius: 11,
              padding: "1.1rem",
              display: "inline-block",
              margin: "1.1rem 0",
              boxShadow: `0 0 38px rgba(56,189,248,0.2)`,
            }}
          >
            <img
              src={qrImg}
              width={185}
              height={185}
              alt="QR Code"
              style={{ display: "block", borderRadius: 4 }}
            />
          </div>
          <div
            style={{
              fontWeight: 700,
              color: T.text,
              fontSize: "0.92rem",
              marginBottom: "0.22rem",
            }}
          >
            {typeConfig.qrName || typeConfig.name || ti.label}
          </div>
          <div
            style={{
              fontSize: "0.7rem",
              color: T.muted,
              marginBottom: "1.35rem",
              wordBreak: "break-all",
              lineHeight: 1.4,
            }}
          >
            {content.slice(0, 65)}
            {content.length > 65 ? "…" : ""}
          </div>
          <a
            href={qrImg}
            download="qrcode.png"
            style={{ textDecoration: "none", display: "block" }}
          >
            <Btn v="out" full>
              ↓ Télécharger PNG
            </Btn>
          </a>
        </Card>

        <div>
          <Card style={{ padding: "1.65rem", marginBottom: "0.9rem" }}>
            <div
              style={{
                fontWeight: 700,
                color: T.text,
                marginBottom: "0.65rem",
                fontSize: "0.88rem",
              }}
            >
              Limite de scans
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                color: T.muted,
                marginBottom: "1.15rem",
                lineHeight: 1.65,
              }}
            >
              Définissez un nombre maximum de scans. Une fois atteint, votre QR
              sera désactivé. Modifiable à tout moment.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.65rem",
                alignItems: "flex-end",
                marginBottom: "0.65rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <Inp
                  label="Max de scans"
                  type="number"
                  min={1}
                  value={scanLimit}
                  onChange={(e) => setScanLimit(+e.target.value)}
                  style={{ marginBottom: 0 }}
                  disabled={unlimited}
                />
              </div>
              <div style={{ marginBottom: "0.9rem" }}>
                <Btn
                  v={unlimited ? "grn" : "ghost"}
                  sm
                  onClick={() => setUnlimited(!unlimited)}
                >
                  {unlimited ? " Illimité" : "∞ Illimité"}
                </Btn>
              </div>
            </div>
            {unlimited && (
              <div
                style={{
                  fontSize: "0.76rem",
                  color: T.grn,
                  padding: "0.55rem 0.85rem",
                  background: T.grnD,
                  borderRadius: 8,
                  border: `1px solid ${T.grn}28`,
                }}
              >
                Mode illimité activé — votre QR n'expirera jamais.
              </div>
            )}
          </Card>

          <Card style={{ padding: "1.65rem" }}>
            <div
              style={{
                fontWeight: 700,
                color: T.text,
                marginBottom: "0.45rem",
                fontSize: "0.88rem",
              }}
            >
              Mettre en ligne
            </div>
            <p
              style={{
                fontSize: "0.8rem",
                color: T.muted,
                marginBottom: "1.35rem",
                lineHeight: 1.65,
              }}
            >
              Publiez votre code QR et commencez à tracker vos scans en temps
              réel.
            </p>
            {done ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "1.35rem",
                  background: T.grnD,
                  borderRadius: 11,
                  border: `1px solid ${T.grn}32`,
                }}
              >
                <div
                  style={{ fontSize: "2.3rem", marginBottom: "0.4rem" }}
                ></div>
                <div
                  style={{ fontWeight: 700, color: T.grn, fontSize: "0.97rem" }}
                >
                  QR Code publié avec succès !
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: T.muted,
                    marginTop: "0.28rem",
                  }}
                >
                  Redirection vers le tableau de bord…
                </div>
              </div>
            ) : (
              <Btn
                v="grn"
                full
                onClick={publish}
                style={{ padding: "0.92rem", fontSize: "0.88rem" }}
              >
                Publier le QR Code
              </Btn>
            )}
          </Card>
        </div>
      </div>
    </Wrap>
  );
};

/* 
   COMPOSANT RACINE — APP
 */
export default function App() {
  const initialState = (() => {
    if (typeof window === "undefined") {
      return { page: "land", user: null, qrs: [] };
    }

    try {
      const saved = localStorage.getItem("qrstudio");
      if (!saved) {
        return { page: "land", user: null, qrs: [] };
      }

      const d = JSON.parse(saved);
      return {
        page: d.user ? "dash" : "land",
        user: d.user ?? null,
        qrs: d.qrs ?? [],
      };
    } catch {
      return { page: "land", user: null, qrs: [] };
    }
  })();

  const [page, setPage] = useState(initialState.page);
  const [user, setUser] = useState(initialState.user);
  const [qrs, setQrs] = useState(initialState.qrs);
  const [selQR, setSelQR] = useState(null);
  const [draft, setDraft] = useState({
    type: null,
    typeConfig: {},
    format: {},
  });

  const save = (u, q) => {
    try {
      localStorage.setItem(
        "qrstudio",
        JSON.stringify({ user: u ?? user, qrs: q ?? qrs }),
      );
    } catch {
      // Ignore write failures (e.g. storage quota, private mode)
    }
  };

  const go = (p) => setPage(p);
  const login = (u) => {
    setUser(u);
    save(u, qrs);
  };
  const logout = () => {
    setUser(null);
    setPage("land");
    localStorage.removeItem("qrstudio");
  };

  const publish = ({ scanLimit }) => {
    const ti = TYPES.find((t) => t.id === draft.type) || TYPES[0];
    const qr = {
      id: uid(),
      name: draft.typeConfig.qrName || draft.typeConfig.name || ti.label,
      type: draft.type,
      typeConfig: draft.typeConfig,
      format: draft.format,
      scanLimit,
      scans: genScans(Math.floor(Math.random() * 14) + 2, 12),
      published: true,
      createdAt: new Date().toISOString(),
    };
    const upd = [qr, ...qrs];
    setQrs(upd);
    save(user, upd);
    setDraft({ type: null, typeConfig: {}, format: {} });
  };

  const updateLimit = (id, lim) => {
    const upd = qrs.map((q) => (q.id === id ? { ...q, scanLimit: lim } : q));
    setQrs(upd);
    if (selQR?.id === id) setSelQR((q) => ({ ...q, scanLimit: lim }));
    save(user, upd);
  };

  const refreshScans = (id) => {
    const upd = qrs.map((q) =>
      q.id === id
        ? {
            ...q,
            scans: [
              ...genScans(Math.floor(Math.random() * 6) + 1, 2),
              ...(q.scans || []),
            ],
          }
        : q,
    );
    setQrs(upd);
    if (selQR?.id === id) setSelQR(upd.find((q) => q.id === id));
    save(user, upd);
  };

  const deleteQR = (id) => {
    const upd = qrs.filter((q) => q.id !== id);
    setQrs(upd);
    save(user, upd);
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: T.bg, minHeight: "100vh" }}>
        <Nav user={user} go={go} logout={logout} />

        {page === "land" && <Landing go={go} />}
        {page === "auth" && <Auth go={go} onLogin={login} />}
        {page === "dash" && (
          <Dashboard
            user={user}
            qrs={qrs}
            go={go}
            onSel={(q) => setSelQR(q)}
            onDel={deleteQR}
          />
        )}
        {page === "analytics" && selQR && (
          <Analytics
            qr={selQR}
            go={go}
            onUpdateLimit={updateLimit}
            onRefresh={refreshScans}
          />
        )}
        {page === "type-select" && (
          <TypeSelect
            go={go}
            onType={(t) => setDraft((d) => ({ ...d, type: t, typeConfig: {} }))}
          />
        )}
        {page === "config" && (
          <ConfigPage
            type={draft.type}
            cfg={draft.typeConfig}
            setCfg={(fn) =>
              setDraft((d) => ({
                ...d,
                typeConfig: typeof fn === "function" ? fn(d.typeConfig) : fn,
              }))
            }
            go={go}
          />
        )}
        {page === "format" && (
          <FormatPage
            draft={draft}
            setFmt={(f) => setDraft((d) => ({ ...d, format: f }))}
            go={go}
          />
        )}
        {page === "preview" && (
          <PreviewPage draft={draft} go={go} onPublish={publish} />
        )}
      </div>
    </>
  );
}
