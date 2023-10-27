const express = require('express');
const router = express.Router();
const db = require("../db");
const KhojoProfiles = require('../Models/khojoUserProfile');

router.get('getKhojoProfileByID/:id', async (req, res) => {
    try {
        const khojoProfile = await KhojoProfiles.findById(req.params.id);
        if (!khojoProfile) {
            return res.status(404).json({ message: 'KhojoProfile not found' });
        }
        res.json(khojoProfile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
