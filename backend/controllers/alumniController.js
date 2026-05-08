let alumni = [];
let nextId = 1;

const getAlumni = (req, res) => {
  res.json(alumni);
};

const addAlumni = (req, res) => {
  const { name, batch, batch_year, company, linkedin_url } = req.body;
  const newAlumni = {
    _id: nextId++,
    name,
    batch: batch || batch_year,
    company,
    linkedin_url
  };
  alumni.push(newAlumni);
  res.json({ success: true, alumni });
};

const deleteAlumni = (req, res) => {
  const id = parseInt(req.params.id);
  console.log("Delete requested for id:", id);
  console.log("Current alumni:", alumni);
  alumni = alumni.filter((a) => a._id !== id);
  console.log("After delete:", alumni);
  res.json(alumni);
};

module.exports = {
  getAlumni,
  addAlumni,
  deleteAlumni
}; 
