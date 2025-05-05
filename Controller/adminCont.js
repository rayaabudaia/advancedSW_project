const Orphan = require("../Model/orphan");

// إضافة يتيم
const createOrphan = async (req, res) => {
  try {
    const { name, age, educationStatus, healthCondition, profilePhoto } = req.body;
    const newOrphan = await Orphan.create({ name, age, educationStatus, healthCondition, profilePhoto });
    res.status(201).json({ message: "Orphan added", data: newOrphan });
  } catch (err) {
    res.status(500).json({ message: "Error creating orphan", error: err.message });
  }
};

// تعديل يتيم
const updateOrphan = async (req, res) => {
  try {
    const orphanId = req.params.id;
    const updated = await Orphan.update(req.body, { where: { orphan_id: orphanId } });
    res.status(200).json({ message: "Orphan updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating orphan", error: err.message });
  }
};

// حذف يتيم
const deleteOrphan = async (req, res) => {
  try {
    const orphanId = req.params.id;
    await Orphan.destroy({ where: { id: orphanId } });
    res.status(200).json({ message: "Orphan deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting orphan", error: err.message });
  }
};


// تعديل ملف يتيم فقط (الحالة الصحية، التعليمية، والصورة)
const updateOrphanProfile = async (req, res) => {
  try {
    const orphanId = req.params.id;
    const { education_status, health_condition, profile_picture } = req.body;

    const [updated] = await Orphan.update(
      { education_status, health_condition, profile_picture },
      { where: { orphan_id: orphanId } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: "Orphan not found or no changes made" });
    }

    res.status(200).json({ message: "Orphan profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating orphan profile", error: err.message });
  }
};

module.exports = {
  createOrphan,
  updateOrphan,
  deleteOrphan,
  updateOrphanProfile, 
};


