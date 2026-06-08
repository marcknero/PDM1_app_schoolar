const express = require('express');
const authRoutes = require('./authRoutes');
const academicRoutes = require('./academicRoutes');
const integrationRoutes = require('./integrationRoutes');

const router = express.Router();

router.use('/api', authRoutes);
router.use('/api', academicRoutes);
router.use('/api', integrationRoutes);

module.exports = router;