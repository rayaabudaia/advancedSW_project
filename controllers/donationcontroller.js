const db = require('../models/index');
const { donations, users, orphanages } = db;


const add_donation = async(req, res) => {
    try {
        const { donor_id, amount, donation_date, donation_type, donation_status, tracking_url, orphanage_id } = req.body;

  
        const donor = await users.findByPk(donor_id);
        const orphanage = await orphanages.findByPk(orphanage_id);

        if (!donor || !orphanage) {
            return res.status(400).json({ message: 'invalid donor or orphanage' });
        }


        const newd = await donations.create({
            donor_id,
            amount,
            donation_date: donation_date || new Date(),
            donation_type,
            donation_status,
            tracking_url,
            orphanage_id
        });

        return res.status(201).json({ message: 'donation added successfully' });
    } catch (error) {
        console.error('faild adding new donation:', error);
        return res.status(500).json({ message: 'faild adding new donation', error });
    }
};


const get_all_donations = async(req, res) => {
    try {
        const alld = await donations.findAll();
        return res.status(200).json(alld);
    } catch (error) {
        console.error('Faild to get all donations', error);
        return res.status(500).json({ message: 'Faild to get all donations', error });
    }
};


const get_donation_by_id = async(req, res) => {
    const { donation_id } = req.params;
    try {
        const donation = await donations.findOne({ where: { donation_id } });
        if (!donation) {
            return res.status(404).json({ message: 'donation not found' });
        }
        return res.status(200).json(donation);
    } catch (error) {
        console.error('Error fetching donation:', error);
        return res.status(500).json({ message: 'Error fetching donation', error });
    }
};

 const update_donation = async(req, res) => {
    const { donation_id } = req.params;
    const { donor_id, amount, donation_date, donation_type, donation_status, tracking_url, orphanage_id } = req.body;

    try {
        const donation = await donations.findOne({ where: { donation_id } });

        if (!donation) {
            return res.status(404).json({ message: 'donation not found' });
        }

        donation.donor_id = donor_id || donation.donor_id;
        donation.amount = amount || donation.amount;
        donation.donation_date = donation_date || donation.donation_date;
        donation.donation_type = donation_type || donation.donation_type;
        donation.donation_status = donation_status || donation.donation_status;
        donation.tracking_url = tracking_url || donation.tracking_url;
        donation.orphanage_id = orphanage_id || donation.orphanage_id;

        await donation.save();

        return res.status(200).json({ message: 'donation updated successfully' });
    } catch (error) {
        console.error('failed updating donation:', error);
        return res.status(500).json({ message: 'failed updating donation', error });
    }
};


const delete_donation = async(req, res) => {
    const { donation_id } = req.params;

    try {
        const donation = await donations.findOne({ where: { donation_id } });
        if (!donation) {
            return res.status(404).json({ message: 'donation not found' });
        }

        await donation.destroy();
        return res.status(200).json({ message: 'donation deleted successfully' });
    } catch (error) {
        console.error('failed deleting donation:', error);
        return res.status(500).json({ message: 'failed deleting donation', error });
    }
};


const get_donations_by_user = async(req, res) => {
    const { user_id } = req.params;

    try {
        const userd = await donations.findAll({ where: { donor_id: user_id } });
        if (userd.length === 0) {
            return res.status(404).json({ message: 'No donations found for this user' });
        }

        return res.status(200).json(userd);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: 'Error fetching donations by user', error });
    }
};


const get_donations_by_orphanage = async(req, res) => {
    const { orphanage_id } = req.params;

    try {
        const orphanaged = await donations.findAll({ where: { orphanage_id } });
        if (orphanaged.length === 0) {
            return res.status(404).json({ message: 'No donations found for this orphanage' });
        }

        return res.status(200).json(orphanaged);
    } catch (error) {
        console.error('Error fetching donations by orphanage:', error);
        return res.status(500).json({ message: 'Error fetching donations by orphanage', error });
    }
};

module.exports = {
    add_donation,
    get_all_donations,
    get_donation_by_id,
    update_donation,
    delete_donation,
    get_donations_by_user,
    get_donations_by_orphanage
};
