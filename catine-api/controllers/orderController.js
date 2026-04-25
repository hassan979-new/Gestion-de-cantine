const db = require('../config/db');

exports.createOrder = (req, res) => {
  const { user_id, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Empty order" });
  }

  db.query(
    "INSERT INTO orders(user_id,status) VALUES (?, 'en attente')",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const orderId = result.insertId;

      items.forEach(item => {
        db.query(
          "INSERT INTO order_items(order_id,menu_id,quantity,subtotal) VALUES (?,?,?,?)",
          [orderId, item.menu_id, item.quantity, item.subtotal]
        );
      });

      res.json({ message: "Order created" });
    }
  );
};

exports.getOrders = (req, res) => {
  db.query("SELECT * FROM orders", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.updateStatus = (req, res) => {
  db.query(
    "UPDATE orders SET status=? WHERE id=?",
    [req.body.status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Status updated" });
    }
  );
};

exports.getStats = (req, res) => {
  db.query (
    "SELECT COUNT(*) as totalOrders From orders",
    (err, ordersResult) => {
      if(err) return res.status(500).json(err);
      db.query(
        `SELECT menus.dish_name, COUNT(*) as total
        FROM order_items
        JOIN menus ON order_items.menu_id=menus.id
        GROUP BY menus.id
        ORDER BY total DESC
        LIMIT 1`,
        (err2, dishResult)=>{
          if(err2) return res.status(500).json(err2);

          db.query(
            `SELECT DATE(created_at) as day, COUNT(*) as count
             FROM orders
             GROUP BY DATE(created_at)
             ORDER BY day DESC
             LIMIT 7`,
             (err3, dailyResult) => {
              if(err3) return res.status(500).json(err3);

              res.json({
                totalOrders: ordersResult[0].totalOrders,
                mostOrderedDish: dishResult[0]?.dish_name || "N/A",
                dailyOrders: dailyResult,
              });
             }
          );
        }
      );
    }
  );
}