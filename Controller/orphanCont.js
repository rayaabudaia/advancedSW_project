const Orphan = require("../Model/orphan");
const Orphanage = require("../Model/orphanages");

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


//عرض كل اللايتام بدار ايتام معينة
const getOrphansByOrphanage = async (req, res) => {
  try {
    const { orphanage_id } = req.params;

    if (!orphanage_id || isNaN(orphanage_id)) {
      return res.status(400).json({ message: "Invalid orphanage ID." });
    }

    const orphanage = await Orphanage.findByPk(orphanage_id);
    if (!orphanage) {
      return res.status(404).json({ message: "Orphanage not found." });
    }

    const orphans = await Orphan.findAll({ where: { orphanage_id } });
    if (orphans.length === 0) {
      return res.status(404).json({ message: "No orphans found for this orphanage." });
    }

    return res.status(200).json(orphans);

  } catch (error) {
    console.error("Error fetching orphans:", error);
    return res.status(500).json({
      message: "Failed to get orphans",
      error: error.message
    });
  }
};


module.exports = {
  getAllOrphans,
  getOrphanById,
  getOrphansByOrphanage
};
