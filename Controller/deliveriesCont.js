
const deliveries  = require("../Model/deliveries");



exports.update_Location = async (req, res) => {
  try {
    const { id, latitude, longitude } = req.body;

    if (!id || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing location data' });
    }

    // التحقق من وجود التوصيل
    const delivery = await deliveries.findByPk(id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    // تحديث الموقع
    delivery.Latitude = latitude;
    delivery.Longitude = longitude;
    await delivery.save();

    // إرسال الموقع الجديد عبر Socket.io
    const io = req.app.get('io');
    io.emit('locationUpdate', { id, latitude, longitude });

    return res.status(200).json({ message: 'Location updated successfully', delivery });
  } catch (err) {
    console.error('Error updating location:', err);
    return res.status(500).json({ error: err.message });
  }
};
