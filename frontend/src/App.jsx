import { useEffect, useState } from "react";

const COLORS = {
  indigo: "#4F46E5",
  indigoLight: "#EEF2FF",
  indigoDark: "#3730A3",
  surface: "#FAFAFA",
  border: "#E5E7EB",
  text: "#111827",
  muted: "#6B7280",
  danger: "#EF4444",
  white: "#FFFFFF",
  linkedin: "#0A66C2",
};

const avatarColors = [
  { bg: "#EEF2FF", text: "#3730A3" },
  { bg: "#F0FDF4", text: "#166534" },
  { bg: "#FFF7ED", text: "#9A3412" },
  { bg: "#FDF4FF", text: "#6B21A8" },
  { bg: "#F0F9FF", text: "#075985" },
  { bg: "#FFF1F2", text: "#9F1239" },
];

function getAvatarColor(name) {
  const i = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[i];
}

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function Avatar({ name, size = 44 }) {
  const { bg, text } = getAvatarColor(name || "?");
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 600,
        fontSize: size * 0.33,
        flexShrink: 0,
        fontFamily: "'Outfit', sans-serif",
        letterSpacing: "0.02em",
      }}
    >
      {getInitials(name || "?")}
    </div>
  );
}

function AlumniCard({ alumni, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(alumni._id);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: COLORS.white,
        border: `1px solid ${hovered ? "#C7D2FE" : COLORS.border}`,
        borderRadius: 16,
        padding: "20px",
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
        boxShadow: hovered
          ? "0 4px 20px rgba(79,70,229,0.10)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      <Avatar name={alumni.name} size={48} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: COLORS.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {alumni.name}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: COLORS.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {alumni.company}
        </p>
        {alumni.linkedin && (
          <a
            href={alumni.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginTop: 6,
              fontSize: 12,
              color: COLORS.linkedin,
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            🔗 LinkedIn
          </a>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
        <span
          style={{
            background: COLORS.indigoLight,
            color: COLORS.indigoDark,
            fontSize: 12,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 99,
          }}
        >
          Batch {alumni.batch}
        </span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            background: "none",
            border: "none",
            cursor: deleting ? "not-allowed" : "pointer",
            color: "#D1D5DB",
            fontSize: 18,
            padding: "2px 4px",
            borderRadius: 6,
            lineHeight: 1,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => { if (!deleting) e.currentTarget.style.color = COLORS.danger; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#D1D5DB"; }}
          title="Remove alumni"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function InputField({ id, type = "text", placeholder, value, onChange, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 160 }}>
      {icon && (
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: focused ? COLORS.indigo : COLORS.muted,
            fontSize: 16,
            pointerEvents: "none",
            transition: "color 0.2s",
          }}
        >
          {icon}
        </span>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: icon ? "10px 12px 10px 36px" : "10px 14px",
          border: `1.5px solid ${focused ? COLORS.indigo : COLORS.border}`,
          borderRadius: 10,
          fontSize: 14,
          outline: "none",
          background: focused ? "#FAFBFF" : COLORS.white,
          color: COLORS.text,
          transition: "border-color 0.2s, background 0.2s",
          fontFamily: "'Outfit', sans-serif",
        }}
      />
    </div>
  );
}

export default function App() {
  const [alumni, setAlumni] = useState([]);
  const [form, setForm] = useState({ name: "", batch: "", company: "", linkedin: "" });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const apiURL = "http://localhost:5000/api/alumni";

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiURL);
      const data = await res.json();
      setAlumni(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.batch || !form.company) return;
    setSubmitting(true);
    try {
      await fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ name: "", batch: "", company: "", linkedin: "" });
      fetchAlumni();
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAlumni = async (id) => {
    try {
      await fetch(`${apiURL}/${id}`, { method: "DELETE" });
      fetchAlumni();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = alumni.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.company?.toLowerCase().includes(search.toLowerCase()) ||
      String(a.batch).includes(search)
  );

  const canSubmit = form.name && form.batch && form.company && !submitting;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #F5F6FA; font-family: 'Outfit', sans-serif; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-enter { animation: fadeUp 0.3s ease both; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 28px; height: 28px; border: 3px solid #E5E7EB;
          border-top-color: #4F46E5; border-radius: 50%;
          animation: spin 0.7s linear infinite; margin: 40px auto;
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #EEF2FF 0%, #F5F6FA 60%)", padding: "40px 16px 60px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: COLORS.white,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 99,
                padding: "6px 18px 6px 10px",
                marginBottom: 20,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}
            >
              <span style={{ fontSize: 22 }}>🎓</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.indigo, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Alumni Network
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 700, color: COLORS.text, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
              Alumni Directory
            </h1>
            <p style={{ margin: "10px 0 0", color: COLORS.muted, fontSize: 15 }}>
              {alumni.length} member{alumni.length !== 1 ? "s" : ""} and growing
            </p>
          </div>

          {/* Add Form Card */}
          <div
            style={{
              background: COLORS.white,
              borderRadius: 20,
              border: `1px solid ${COLORS.border}`,
              padding: "24px",
              marginBottom: 24,
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <p style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Add New Alumni
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <InputField
                id="name"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                icon="👤"
              />
              <InputField
                id="batch"
                type="number"
                placeholder="Batch year"
                value={form.batch}
                onChange={(e) => setForm({ ...form, batch: e.target.value })}
                icon="📅"
              />
              <InputField
                id="company"
                placeholder="Company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                icon="🏢"
              />
              <InputField
                id="linkedin"
                placeholder="LinkedIn URL (optional)"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                icon="🔗"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                marginTop: 12,
                background: canSubmit ? COLORS.indigo : "#C7D2FE",
                color: COLORS.white,
                border: "none",
                borderRadius: 10,
                padding: "10px 22px",
                fontSize: 14,
                fontWeight: 600,
                cursor: canSubmit ? "pointer" : "not-allowed",
                transition: "background 0.2s, transform 0.1s",
                fontFamily: "'Outfit', sans-serif",
              }}
              onMouseDown={(e) => { if (canSubmit) e.currentTarget.style.transform = "scale(0.97)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {submitting ? "Adding…" : "+ Add Alumni"}
            </button>
          </div>

          {/* Search */}
          {alumni.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <InputField
                id="search"
                placeholder="Search by name, company, or batch…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon="🔍"
              />
            </div>
          )}

          {/* Cards */}
          {loading ? (
            <div className="spinner" />
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.muted }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
              <p style={{ margin: 0, fontSize: 15 }}>
                {search ? "No results found." : "No alumni yet. Add the first one!"}
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
              {filtered.map((a, i) => (
                <div key={a._id} className="card-enter" style={{ animationDelay: `${i * 40}ms` }}>
                  <AlumniCard alumni={a} onDelete={deleteAlumni} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}