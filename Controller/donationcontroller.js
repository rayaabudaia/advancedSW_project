const sequelize = require('../config/seq'); 
const { Op } = require('sequelize'); 

const donations = require('../Model/donations')(sequelize);
const users = require('../Model/user');
const orphanages = require('../Model/orphanages');
const feedback = require('../Model/feedback');
const physical_donation_details  =  require('../Model/physical_donation_details');
const deliveries = require("../Model/deliveries");
const jwt = require('jsonwebtoken');

const paypal = require('@paypal/checkout-server-sdk'); // new (for paypal payment)


const get_verified_orphanages_for_donations = async (req, res) => {
    try {
      const verifiedOrphanages = await orphanages.findAll({
        where: {
          verification_proof: 'verified' 
        },
        attributes: ['name', 'orphanage_id','verification_proof'] 
      });
  
      if (!verifiedOrphanages.length) {
        return res.status(404).json({ message: 'No verified orphanages found for donations' });
      }
  
      return res.status(200).json({
        message: 'Verified orphanages fetched successfully',
        data: verifiedOrphanages
      });
    } catch (error) {
      return res.status(500).json({
        message: 'Error fetching verified orphanages for donations',
        error: error.message
      });
    }
  };
  


//updated for point 6 // معدلة 


// Add Donation
// نسبة رسوم الخدمة (مثلا 3%)
const SERVICE_FEE_PERCENTAGE = 0.03;


const add_donation = async (req, res) => {
  try {
    const donor_id = req.user.user_id;
    const {
      amount,
      donation_date,
      donation_type,
      donation_status,
      tracking_url,
      orphanage_id
    } = req.body;

    // التحقق من دار الأيتام
    const orphanage = await orphanages.findByPk(orphanage_id);
    if (!orphanage || !orphanage.verification_proof) {
      return res.status(400).json({ message: 'The selected orphanage is not verified' });
    }

    if (!orphanage_id || !amount || !donation_type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const donor = await users.findByPk(donor_id);
    if (!donor) {
      return res.status(400).json({ message: 'Invalid donor' });
    }
    // جديد>>>>>>
       // احسب رسوم الخدمة وصافي المبلغ
    const service_fee = amount * SERVICE_FEE_PERCENTAGE;
    const net_amount = amount - service_fee;


    // إنشاء التبرع
    const newDonation = await donations.create({
      donor_id,
      amount,
      service_fee,// جديد>>>>>>
      net_amount,// جديد>>>>>>
      donation_date: donation_date || new Date(),
      donation_type,
      donation_status,
      tracking_url,
      orphanage_id
    });


    // إذا كان التبرع من نوع ملموس: أنشئ سجل توصيل
    if (donation_type === 'Physical') {
      await deliveries.create({
        donation_id: newDonation.donation_id,
        status: "pending"
      });
    }

    return res.status(201).json({
      message: 'Donation added successfully',
      donation_id: newDonation.donation_id,
      ...(donation_type === 'Physical' && {
        note: 'Please complete your physical donation by providing delivery details.'
      })
    });

  } catch (error) {
    console.error('Failed adding new donation:', error);
    return res.status(500).json({ message: 'Failed adding new donation', error: error.message });
  }
};




module.exports = {
  get_verified_orphanages_for_donations,
  add_donation
};





const update_donation = async (req, res) => {
    try {
        const { donation_id } = req.params;
        const donor_id = req.user.user_id; // من التوكن
        const {
            amount,
            donation_date,
            donation_type,
            donation_status,
            tracking_url,
            orphanage_id
        } = req.body;

        const donation = await donations.findByPk(donation_id);
        if (!donation) return res.status(404).json({ message: 'Donation not found' });

        // نتاكد انه المتبرع بعدل التبرع يلي اله فقط
        if (donation.donor_id !== donor_id) {
            return res.status(403).json({ message: 'You can only update your own donations' });
        }

        await donation.update({
            amount: amount || donation.amount,
            donation_date: donation_date || donation.donation_date,
            donation_type: donation_type || donation.donation_type,
            donation_status: donation_status || donation.donation_status,
            tracking_url: tracking_url || donation.tracking_url,
            orphanage_id: orphanage_id || donation.orphanage_id
        });

        return res.status(200).json({ message: 'Donation updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed updating donation', error: error.message });
    }
};


// Delete Donation
const delete_donation = async (req, res) => {
    try {
        const { donation_id } = req.params;
        const donor_id = req.user.user_id; // من التوكن

        const donation = await donations.findByPk(donation_id);
        if (!donation) return res.status(404).json({ message: 'Donation not found' });

        if (donation.donor_id !== donor_id) {
            return res.status(403).json({ message: 'You can only delete your own donations' });
        }

        await donation.destroy();
        return res.status(200).json({ message: 'Donation deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed deleting donation', error: error.message });
    }
};





// add feedbbck about orphange from donor (new) جديدة
const add_feedback = async (req, res) => {
  try {
    const donor_id = req.user.user_id; // من التوكن
    const { orphanage_id, rating, comment } = req.body;

    if (!orphanage_id || rating === undefined) {
      return res.status(400).json({ message: 'orphanage_id and rating are required' });
    }

    const newFeedback = await feedback.create({
      donor_id,
      orphanage_id,
      rating,
      comment
    });

    res.status(201).json({
      message: 'Feedback submitted successfully',
      feedback: newFeedback
    });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// حذف فيدباك delete feedbbck about orphange from donor (new) جديدة
const delete_feedback = async (req, res) => {
  try {
    const donor_id = req.user.user_id; // من التوكن
    const feedback_id = req.params.id;

    const fb = await feedback.findByPk(feedback_id);

    if (!fb) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    if (fb.donor_id !== donor_id) {
      return res.status(403).json({ message: 'You can only delete your own feedback' });
    }

    await fb.destroy();

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



// هاي كمان للمتبرع يعمل استرجاع فقط للتبرع يلي اله عشان يتبع حالته + اذا بده يعمل اله ابديت يعرف الid 
const get_donation_by_id2 = async (req, res) => {
  try {
    const { donation_id } = req.params;
    const donor_id = req.user.user_id; // من التوكن

    const donation = await donations.findByPk(donation_id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    if (donation.donor_id !== donor_id) {
      return res.status(403).json({ message: 'You can only view your own donation' });
    }

    return res.status(200).json(donation);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching donation', error: error.message });
  }
};
 


// new ------------------
const paypalClient = require('../Model/paypal');

const create_paypal_order = async (req, res) => {
  const { amount } = req.body;   // بستخرج الاماونت 
  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  const request = new paypal.orders.OrdersCreateRequest();   // لانشاء عملية دفع جديدة 
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amount.toString()
      }
    }]
  });

  try {
    const order = await paypalClient.execute(request);    // بنرسل الطلب لل paypal عن طريق ال sdk 
    res.status(200).json({ orderID: order.result.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
};


// new for point 6 


const add_physical_donation_details = async (req, res) => {
  try {
    const donor_id = req.user.user_id; // جلب معرف المستخدم من التوكن
    const {
      donation_id,
      pickup_date,
      address,
      description,
      driver_number  
    } = req.body;


    const donation = await donations.findByPk(donation_id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

   
    if (donation.donor_id !== donor_id) {
      return res.status(403).json({ message: 'You can only add details to your own donations' });
    }

   
    if (donation.donation_type !== 'Physical') {
      return res.status(400).json({ message: 'This donation is not physical type' });
    }

   
    const details = await physical_donation_details.create({
      donation_id,
      pickup_date,
      address,
      description,
      driver_id: null 
    });

    return res.status(201).json({ message: 'Physical donation details added successfully', details });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to add physical donation details', error: error.message });
  }
};

//   السائق بسترجع المهمات الخاصة فيه لايصال التبرعات غير المادية // new 
const getDriverTasks = async (req, res) => {
  try {
    const driverId = req.params.driverId;

    if (!driverId) {
      return res.status(400).json({ message: 'Driver ID is required.' });
    }

    const tasks = await physical_donation_details.findAll({
      where: { driver_id: driverId }
    });

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found for this driver.' });
    }

    return res.status(200).json(tasks);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching driver tasks.', error: err.message });
  }
};



// new 
const updateStatusByitDriver = async (req, res) => {
  try {
    if (req.user.role !== 'driver') {
      return res.status(403).json({ message: 'Access denied. Only drivers can update donation status.' });
    }

    const physicalDonationId = req.params.physicalDonationId; 
    const { status } = req.body;

    const detail = await physical_donation_details.findByPk(physicalDonationId);
    if (!detail) {
      return res.status(404).json({ message: 'Physical donation detail not found.' });
    }

    if (detail.driver_id !== req.user.user_id) {  // تأكد من المفتاح الصحيح هنا
      return res.status(403).json({ message: 'You are not assigned to this donation.' });
    }

    const donation = await donations.findByPk(detail.donation_id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found.' });
    }

    donation.donation_status = status;
    await donation.save();

   

    return res.status(200).json({ message: `Donation status updated to '${status}'.` });

  } catch (error) {
    return res.status(500).json({ message: 'Error updating donation status.', error: error.message });
  }
};


// جديد>>>>>>

// Get total service fees between two dates
const get_total_service_fees = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can view service fee stats.' });
    }
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ message: 'start_date and end_date are required' });
    }

    const totalServiceFees = await donations.sum('service_fee', {
      where: {
        donation_date: {
          [Op.between]: [start_date, end_date]
        }
      }
    });

    return res.status(200).json({
      message: 'Total service fees calculated successfully',
      total_service_fees: totalServiceFees || 0
    });
  } catch (error) {
    console.error('Error calculating total service fees:', error);
    return res.status(500).json({ message: 'Failed calculating total service fees', error: error.message });
  }
};
//جديد >>>>>>>>>>>>>>
// Get specific donation details
const get_donation_details = async (req, res) => {
  try {
    const { donation_id } = req.params;
    const donation = await donations.findByPk(donation_id, {
      attributes: ['donation_id', 'donor_id', 'amount', 'service_fee', 'net_amount', 'donation_date']
    });

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    return res.status(200).json({
      message: 'Donation details fetched successfully',
      donation
    });
  } catch (error) {
    console.error('Error fetching donation details:', error);
    return res.status(500).json({ message: 'Failed fetching donation details', error: error.message });
  }
};



module.exports = {
    get_verified_orphanages_for_donations,
    add_donation,
    update_donation,
    delete_donation,
    add_feedback,       
    delete_feedback, 
     create_paypal_order  ,    // new 
     get_donation_by_id2,    // new 
     add_physical_donation_details,
     getDriverTasks,// new
    updateStatusByitDriver, // new 
     get_total_service_fees ,// جديد>>>>>>
     get_donation_details// جديد>>>>>>
     
  };
  