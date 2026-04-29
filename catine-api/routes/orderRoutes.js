const router = require('express').Router();
const order = require('../controllers/orderController');

router.post('/', order.createOrder);
router.get('/', order.getOrders);
router.get("/stats", order.getStats);
router.get('/:id/items', order.getOrderItems);
router.put('/:id', order.updateStatus);
router.put('/:id/status', order.updateStatusAndroid);

module.exports = router;