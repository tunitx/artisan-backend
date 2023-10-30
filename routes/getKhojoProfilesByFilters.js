const express = require('express');
const router = express.Router();
const KhojoUserProfile = require('../Models/khojoUserProfile');

router.get('/getKhojoProfilesByFilters', async (req, res) => {
    const { district, age, occupation } = req.body;
    const [minAge, maxAge] = age;

    try {
        const khojoProfiles = await KhojoUserProfile.find({
            district: district,
            occupation: occupation,
            age: { $gte: minAge, $lte: maxAge }
        }).populate('template');

        res.json(khojoProfiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
