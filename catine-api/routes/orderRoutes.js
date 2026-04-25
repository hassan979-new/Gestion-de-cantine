const router = require('express').Router();
const order = require('../controllers/orderController');

router.post('/', order.createOrder);
router.get('/', order.getOrders);
router.get("/stats", order.getStats);
router.put('/:id', order.updateStatus);

module.exports = router;