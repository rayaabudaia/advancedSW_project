const express = require("express");
const {
  createOrphan,
  updateOrphan,
  deleteOrphan,
  updateOrphanProfile, 
  add_orphanage,
  create_Campaign,
  addOrphanToOrphanage,
  deleteOrphanFromOrphanage,
  verifyOrphanage,  
  get_all_donations,  
  get_donation_by_id, 
  get_donations_by_user,  
  get_donations_by_orphanage, 
  getAllOrphanages ,
  get_unassigned_physical_donations,
  get_all_drivers,
   assignDriver
} = require("../Controller/adminCont");

const partnership = require('../Controller/partnershipController'); //جدييد >>>>>>>>>>>>>>>>> 
const dashboardController = require('../Controller/dashboardcontroller');  
const router = express.Router();


const verifyToken = require('../Middleware/authMiddle');

router.post("/orphans",verifyToken,createOrphan);
router.put("/orphans/:id",verifyToken,updateOrphan);
router.delete("/orphans/:id",verifyToken,deleteOrphan);

router.put("/orphans/:id/profile", verifyToken,updateOrphanProfile);
router.post("/orphange", verifyToken,add_orphanage);

router.post('/campaigns', verifyToken,create_Campaign);


router.put('/orphanage/:orphanageId/:orphanId',verifyToken, addOrphanToOrphanage);



router.delete('/orphanage/:orphanage_id/:orphan_id',verifyToken,deleteOrphanFromOrphanage);
router.get('/donations/users/:user_id',verifyToken, get_donations_by_user);   
router.get('/donations/orphanages/:orphanage_id',verifyToken,get_donations_by_orphanage);

router.get('/donations/all',verifyToken,get_all_donations);
router.get('/donations/:donation_id',verifyToken,get_donation_by_id);


router.get('/Allorphanages',verifyToken,getAllOrphanages);


router.put("/orphanages/:id/verify",verifyToken , verifyOrphanage); // verify orphange
router.get('/dashboard', verifyToken, dashboardController.get_dashboard_data);   // استرجاع الداش بورد الخاصة بالتبرعات 


router.get('/physical_donations', verifyToken, get_unassigned_physical_donations); // new 
router.get('/drivers', verifyToken, get_all_drivers);  // new 
router.put('/physical_donations/:id', verifyToken, assignDriver);  // new 

//new
//router.put('/donations/:donation_id/complete',  dashboardController.markDonationComplete);

//جديد >>>>>>>>>>>
// admin
router.get('/allpartnership',verifyToken,partnership.getAllRequests);
router.get('/orphanagePartnership/:orphanage_id', verifyToken, partnership.getRequestsForOrphanage);


module.exports = router;
