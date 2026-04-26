const router      = require('express').Router();
const menu        = require('../controllers/menuController');
const protect     = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const upload      = require('../middleware/upload');

// pour android public
router.get('/today',  menu.getTodayMenus);
router.get('/',       menu.getMenusByDate);

// pour acces admin ou agent
router.post('/',      protect, requireRole('agent','admin'), upload.single('image'), menu.addMenu);
router.put('/:id',    protect, requireRole('agent','admin'), menu.updateMenu);
router.delete('/:id', protect, requireRole('agent','admin'), menu.deleteMenu);

// import image
const path    = require('path');
const express = require('express');
router.use('/images', express.static(path.join(__dirname, '../uploads')));

module.exports = router;