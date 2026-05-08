import { useEffect, useState } from "react";

function App() {
  const [alumni, setAlumni] = useState([]);

  const [form, setForm] = useState({
    name: "",
    batch: "",
    company: ""
  });

  const apiURL = "http://localhost:5000/api/alumni";

  const fetchAlumni = async () => {
    const res = await fetch(apiURL);
    const data = await res.json();
    setAlumni(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchAlumni();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.batch || !form.company) {
      alert("Fill all fields");
      return;
    }

    await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    setForm({ name: "", batch: "", company: "" });
    fetchAlumni();
  };

  const deleteAlumni = async (id) => {
    try {
      await fetch(`${apiURL}/${id}`, {
        method: "DELETE"
      });
      fetchAlumni();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Alumni Directory</h1>

      <form onSubmit={handleSubmit}>
        <input
          id="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          id="batch"
          type="number"
          placeholder="Batch"
          value={form.batch}
          onChange={(e) => setForm({ ...form, batch: e.target.value })}
        />
        <input
          id="company"
          type="text"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <button type="submit">Add Alumni</button>
      </form>

      <ul>
        {alumni.map((a) => (
          <li key={a._id} style={{ marginTop: "10px" }}>
            {a.name} ({a.batch}) - {a.company}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => deleteAlumni(a._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;