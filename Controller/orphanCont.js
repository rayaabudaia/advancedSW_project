const Orphan = require("../Model/orphan");

// عرض كل الأيتام
const getAllOrphans = async (req, res) => {
  try {
    const orphans = await Orphan.findAll();
    res.status(200).json(orphans);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orphans" });
  }
};

// عرض يتيم واحد
const getOrphanById = async (req, res) => {
  try {
    const orphan = await Orphan.findByPk(req.params.id);
    if (!orphan) {
      return res.status(404).json({ message: "Orphan not found" });
    }
    res.status(200).json(orphan);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orphan" });
  }
};

module.exports = {
  getAllOrphans,
  getOrphanById,
};
