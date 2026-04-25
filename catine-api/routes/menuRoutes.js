const router = require('express').Router();
const menu = require('../controllers/menuController');

router.get('/today', menu.getTodayMenus);
router.get('/', menu.getMenusByDate);
router.post('/', menu.addMenu);
router.put('/:id', menu.updateMenu);
router.delete('/:id', menu.deleteMenu);

module.exports = router;