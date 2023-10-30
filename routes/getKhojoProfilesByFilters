const express = require('express');
const router = express.Router();
const KhojoUserProfile = require('../Models/khojoUserProfile');

router.get('/getKhojoProfilesByFilters', async (req, res) => {
    const { district, age, occupation } = req.body;

    try {
        const khojoProfiles = await KhojoUserProfile.find({
            district: district,
            occupation: occupation,
            age: { $gte: age }
        }).populate('template');

        res.json(khojoProfiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
