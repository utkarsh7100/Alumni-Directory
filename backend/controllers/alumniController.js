let alumni = [];
let nextId = 1;

const getAlumni = (req, res) => {
  res.json(alumni);
};

const addAlumni = (req, res) => {
  const { name, batch, company, linkedin } = req.body;
  const newAlumni = {
    _id: nextId++,
    name,
    batch,
    company,
    linkedin: linkedin || "",
  };
  alumni.push(newAlumni);
  res.json({ success: true, alumni });
};

const deleteAlumni = (req, res) => {
  const id = parseInt(req.params.id);
  alumni = alumni.filter((a) => a._id !== id);
  res.json(alumni);
};

module.exports = {
  getAlumni,
  addAlumni,
  deleteAlumni,
};