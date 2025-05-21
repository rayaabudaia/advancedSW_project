
const Orphan = require("../Model/orphan");
const orphanUpdate=require("../Model/orphanUpdate");

const createUpdate = async (req, res) => {
  const { id } = req.params; // orphan_id
  const { type, description, image_url } = req.body;
  const io = req.app.get('io');

  try {
    const orphan = await Orphan.findByPk(id);
    if (!orphan) return res.status(404).json({ message: "Orphan not found" });

    const update = await orphanUpdate.create({
      orphan_id: id,
      type,
      description,
      image_url
    });

    // Notify all clients
    io.emit('newUpdate', update);

    res.status(201).json({ message: "Update added successfully", update });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { createUpdate };
