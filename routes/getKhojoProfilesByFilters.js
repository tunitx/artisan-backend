const express = require('express');
const router = express.Router();
const KhojoUserProfile = require('../Models/khojoUserProfile');

router.get('/getKhojoProfilesByFilters', async (req, res) => {
    const { district, age, occupation } = req.body;
    let minAge, maxAge;
if (Array.isArray(age)) {
  [minAge, maxAge] = age;
}
    // const [minAge, maxAge] = age;

    try {
        let khojoProfiles;
        if (district === "ALL" && occupation === "ALL") {
            khojoProfiles = await KhojoUserProfile.find({
                age: { $gte: minAge, $lte: maxAge }
            }).populate('template');
        } else if (district === "ALL") {
            khojoProfiles = await KhojoUserProfile.find({
                occupation: occupation,
                age: { $gte: minAge, $lte: maxAge }
            }).populate('template');
        } else if (occupation === "ALL") {
            khojoProfiles = await KhojoUserProfile.find({
                district: district,
                age: { $gte: minAge, $lte: maxAge }
            }).populate('template');
        } else {
            khojoProfiles = await KhojoUserProfile.find({
                district: district,
                occupation: occupation,
                age: { $gte: minAge, $lte: maxAge }
            }).populate('template');
        }

        res.json(khojoProfiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
