const Orphan = require("../Model/orphan");
const Emergency_Campaign = require('../Model/Emergency');
const Orphanges = require("../Model/orphanages");
const nodemailer = require('nodemailer');
const User = require('../Model/user');
const sequelize = require('../config/seq'); 
const SponsorshipRequest = require('../Model/sponsorshipRequest');
const Sponsorship=require('../Model/sponsorship')
const donations = require('../Model/donations')(sequelize);
const PhysicalDonationDetails = require('../Model/physical_donation_details');



const sendEmergencyEmails = async (campaign) => {
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'raya662003@gmail.com',
    pass: 'frlf drsv lvyo zpti'
  }
});

try {
    const donors = await User.findAll({ where: { role: 'donor' } });

    for (const donor of donors) {
      const mailOptions = {
        from: '"HopeConnect Alerts" <' + process.env.EMAIL_USER + '>',
        to: donor.email,
        subject: `🚨 Emergency Campaign: ${campaign.campaign_name}`,
        text: `
Dear ${donor.name || 'Donor'},

A new emergency campaign has been launched on HopeConnect!

🆘 Title: ${campaign.campaign_name}
📄 Description: ${campaign.description}
🎯 Goal: $${campaign.goal_amount}
📅 Ends on: ${new Date(campaign.end_date).toDateString()}

Please consider supporting this urgent cause.

Thank you for being a part of our mission 💙
- HopeConnect Team
        `
      };

      await transporter.sendMail(mailOptions);
    }

    console.log('✅ Emails successfully sent to all donors.');
  } catch (error) {
    console.error('❌ Error sending emails:', error.message);
    throw error;
  }
};

// إضافة يتيم
const createOrphan = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can add orphanes.' });
    }
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
     if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can update orphanes.' });
    }
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
     if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can delete orphanes.' });
    }
    const orphanId = req.params.id;
    await Orphan.destroy({ where: { orphan_id: orphanId } });
    res.status(200).json({ message: "Orphan deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting orphan", error: err.message });
  }
};


// تعديل ملف يتيم فقط (الحالة الصحية، التعليمية، والصورة)
const updateOrphanProfile = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can update orphans profile.' });
    }

    const orphanId = req.params.id;
    const { education_status, health_condition, profile_picture } = req.body;

    const orphan = await Orphan.findByPk(orphanId);
    if (!orphan) {
      return res.status(404).json({ message: "Orphan not found" });
    }

    const [updated] = await Orphan.update(
      { education_status, health_condition, profile_picture },
      { where: { orphan_id: orphanId } }
    );

    if (updated === 0) {
      return res.status(200).json({ message: "No changes made to orphan profile" });
    }

    res.status(200).json({ message: "Orphan profile updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating orphan profile", error: err.message });
  }
};



//اضافة دار ايتام
const add_orphanage = async (req, res) => {

  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can add orphanages.' });
    }
    const {
      name,
      location,
      phone_number,
      email,
      manager_name,
      ads,
      ads_category,
      verification_proof
    } = req.body;

    if (!name || !location || !email) {
      return res.status(400).json({ message: 'Name, location, and email are required.' });
    }

    const newOrphanage = await Orphanges.create({
      name,
      location,
      phone_number,
      email,
      manager_name,
      ads,
      ads_category,
      verification_proof
    });

    return res.status(201).json({
      message: 'Orphanage added successfully.',
      data: newOrphanage
    });

  } catch (error) {
    console.error('Error adding orphanage:', error);
    return res.status(500).json({ message: 'Failed to add orphanage.', error: error.message });
  }
};






const verifyOrphanage = async (req, res) => {
  try {
    const orphanageId = req.params.id;
    const { verification_proof } = req.body;

    // نتاكد  أن المستخدم  أدمن
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can verify orphanages.' });
    }

    const [updated] = await Orphanges.update(
      { verification_proof },
      { where: { orphanage_id: orphanageId } }
    );

    if (updated === 0) {
      return res.status(404).json({ message: 'Orphanage not found or already verified' });
    }

    res.status(200).json({ message: 'Orphanage verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating verification proof', error: error.message });
  }
};



//update with verify token 
 const getAllOrphanages = async (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can view all orphanages.' });
    }

    const orphanages = await Orphanges.findAll();
    res.status(200).json({ message: "All orphanages fetched", data: orphanages });
  } catch (error) {
    res.status(500).json({ message: "Error fetching orphanages", error: error.message });
  }
};




// Create emergency campaign
const create_Campaign = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can view donations by orphanage.' });
    }
    const { campaign_name, description, goal_amount, start_date, end_date, orphanage_id } = req.body;

    const campaign = await Emergency_Campaign.create({
      campaign_name,
      description,
      goal_amount,
      start_date,
      end_date,
      orphanage_id
    });

    await sendEmergencyEmails(campaign);


    res.status(201).json({ message: 'Emergency campaign created', campaign });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create emergency campaign', error: error.message });
  }
};







const addOrphanToOrphanage = async (req, res) => {
  if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can view donations by orphanage.' });
    }
  const orphanId = parseInt(req.params.orphanId);
  const orphanageId = parseInt(req.params.orphanageId);

  if (isNaN(orphanId) || isNaN(orphanageId)) {
    return res.status(400).json({ message: "Invalid IDs" });
  }

  try {
    const [orphanRows] = await sequelize.query(
      'SELECT * FROM orphans WHERE orphan_id = ?',
      { replacements: [orphanId] }
    );

    if (orphanRows.length === 0) {
      return res.status(404).json({ message: 'Orphan not found' });
    }

    const [orphanageRows] = await sequelize.query(
      'SELECT * FROM orphanages WHERE orphanage_id = ?',
      { replacements: [orphanageId] }
    );

    if (orphanageRows.length === 0) {
      return res.status(404).json({ message: 'Orphanage not found' });
    }

    await sequelize.query(
      'UPDATE orphans SET orphanage_id = ? WHERE orphan_id = ?',
      { replacements: [orphanageId, orphanId] }
    );

    res.status(200).json({ message: 'Orphan assigned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error', error: err.message });
  }
};



const deleteOrphanFromOrphanage = async (req, res) => {
  try {
        if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can view donations by orphanage.' });
    }
    const { orphanage_id, orphan_id } = req.params;

    const orphan = await Orphan.findOne({ where: { orphan_id, orphanage_id } });

    if (!orphan) {
      return res.status(404).json({ message: "Orphan not found in this orphanage" });
    }

    await orphan.destroy();
    res.status(200).json({ message: "Orphan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete orphan", error: error.message });
  }
};


const get_all_donations = async (req, res) => {
  try {
   
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can view all donations.' });
    }

    const all = await donations.findAll();
    return res.status(200).json(all);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to get all donations', error: error.message });
  }
};



const get_donation_by_id = async (req, res) => {
  try {
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can access this donation.' });
    }

    const { donation_id } = req.params;
    const donation = await donations.findByPk(donation_id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    return res.status(200).json(donation);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching donation', error: error.message });
  }
};


const get_donations_by_user = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You can only view your own donations.' });
    }

    const records = await donations.findAll({ where: { donor_id: user_id } });
    if (!records.length) {
      return res.status(404).json({ message: 'No donations found for this user' });
    }

    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching donations by user', error: error.message });
  }
};

//قبول طلب سبونسر
const reviewRequest = async (req, res) => {
  try {
     if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Admins only" });
    }
    const { request_id } = req.params;
    const { status, sponsorship_type, amount } = req.body;

    const request = await SponsorshipRequest.findByPk(request_id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.request_status = status;
    await request.save();

    if (status === "Approved") {
      await Sponsorship.create({
        sponsor_id: request.sponsor_id,
        orphan_id: request.orphan_id,
        sponsorship_type,
        amount,
      });
    }

    res.status(200).json({ message: `Request ${status.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ message: "Error reviewing request", error: err.message });
  }
};

// update with token 
const get_donations_by_orphanage = async (req, res) => {
  try {
  
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can view donations by orphanage.' });
    }

    const { orphanage_id } = req.params;
    const records = await donations.findAll({ where: { orphanage_id } });
    if (!records.length) {
      return res.status(404).json({ message: 'No donations found for this orphanage' });
    }

    return res.status(200).json(records);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching donations by orphanage', error: error.message });
  }
};




// new for point 6 
const get_unassigned_physical_donations = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can view unassigned physical donations.' });
    }

    const unassigned = await PhysicalDonationDetails.findAll({
      where: {
        driver_id: null
      }
    });

    if (unassigned.length === 0) {
      return res.status(404).json({ message: 'No unassigned physical donation details found' });
    }

    return res.status(200).json(unassigned);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving physical donation details', error: error.message });
  }
};







// استرجاع كل السائقين // new

const get_all_drivers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can view drivers.' });
    }

    const drivers = await User.findAll({
      where: { role: 'driver' }
  
    });

    if (drivers.length === 0) {
      return res.status(404).json({ message: 'No drivers found' });
    }

    return res.status(200).json(drivers);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving drivers', error: error.message });
  }
};



  // تعيين سائق معين لطلب مش محدد اله رقم سائق لاستلامه من المتبرع  // new 
const assignDriver = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Only admin can assign drivers.' });
    }

    const physicalDonationId = req.params.id;

    const { driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: 'driverId is required.' });
    }

    const donationDetail = await PhysicalDonationDetails.findByPk(physicalDonationId);
    if (!donationDetail) {
      return res.status(404).json({ message: 'Physical donation detail not found.' });
    }

    const driverExists = await User.findByPk(driverId);
    if (!driverExists) {
      return res.status(404).json({ message: 'Driver not found.' });
    }

    donationDetail.driver_id = driverId;
    await donationDetail.save();

    return res.status(200).json({ message: 'Driver assigned successfully.', updatedDonation: donationDetail });
  } catch (error) {
    return res.status(500).json({ message: 'Error assigning driver.', error: error.message });
  }
};



// update with token 

//const updateDonationStatus = async (req, res) => {
 // try {
    // تحقق من أن المستخدم أدمن
    //if (req.user.role !== 'admin') {
     // return res.status(403).json({ message: 'Access denied. Only admin can update donation status.' });
   //}

    //const { donation_id, status } = req.body; // 

 //   if (status !== 'Completed' && status !== 'Cancelled') {
  //    return res.status(400).json({ message: 'Invalid status' });
    //}

    // ا
    //const donation = await donations.findOne({ where: { donation_id } });

    //if (!donation) {
     // return res.status(404).json({ message: 'Donation not found' });
   // }

    // تغيير حالة التبرع
   // donation.donation_status = status;
   // await donation.save();

  //  return res.status(200).json({ message: 'Donation status updated successfully', donation });
  //} catch (error) {
   // console.error("Error in updateDonationStatus:", error);
    //return res.status(500).json({ message: 'Error updating donation status', error: error.message });
  //}
//};


module.exports = {
  createOrphan,
  updateOrphan,
  deleteOrphan,
  updateOrphanProfile, 
  add_orphanage,
  create_Campaign,
  addOrphanToOrphanage,
  deleteOrphanFromOrphanage,
  verifyOrphanage,
  getAllOrphanages,
  get_all_donations,   
  get_donation_by_id, 
  get_donations_by_user,  
  get_donations_by_orphanage,
  sendEmergencyEmails,
  reviewRequest,
get_unassigned_physical_donations,  // new 
get_all_drivers ,// new
 assignDriver// new 
};


