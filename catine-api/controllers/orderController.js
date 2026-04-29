const db = require('../config/db');

exports.createOrder = (req, res) => {
  const { user_id, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "Une commande doit contenir au moins 1 plat." });
  }

  const menuIds = items.map(i => i.menu_id);

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

      res.json({ message: "Commande créée" });
    }
  );
};

exports.getOrders = (req, res) => {
  db.query("SELECT * FROM orders", (err, orders) => {
    if (err) return res.status(500).json(err);

    let completed = 0;

    orders.forEach((order, index) => {
      db.query(
        `SELECT oi.*, m.dish_name
         FROM order_items oi
         JOIN menus m ON oi.menu_id = m.id
         WHERE oi.order_id = ?`,
        [order.id],
        (err2, items) => {

          orders[index].items = items;

          completed++;

          if (completed === orders.length) {
            res.json(orders);
          }
        }
      );
    });

    if (orders.length === 0) res.json([]);
  });
};

exports.getOrderItems = (req, res) => {
  db.query(
    `SELECT oi.*, m.dish_name, m.price
     FROM order_items oi
     JOIN menus m ON oi.menu_id = m.id
     WHERE oi.order_id = ?`,
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

exports.updateStatus = (req, res) => {
  db.query(
    "UPDATE orders SET status=? WHERE id=?",
    [req.body.status, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Statut mis à jour." });
    }
  );
};

exports.getStats = (req, res) => {
  // total orders today
  db.query(
    "SELECT COUNT(*) AS totalOrders FROM orders WHERE DATE(created_at) = CURDATE()",
    (err, todayRes) => {
      if (err) return res.status(500).json(err);
 
      // orders by status
      db.query(
        "SELECT status, COUNT(*) AS count FROM orders GROUP BY status",
        (err2, statusRes) => {
          if (err2) return res.status(500).json(err2);
 
          // most ordered dish (all time)
          db.query(
            `SELECT m.dish_name, SUM(oi.quantity) AS total
             FROM order_items oi
             JOIN menus m ON oi.menu_id = m.id
             GROUP BY m.id
             ORDER BY total DESC
             LIMIT 1`,
            (err3, dishRes) => {
              if (err3) return res.status(500).json(err3);
 

              db.query(
                `SELECT DATE_FORMAT(created_at, '%d/%m') AS day, COUNT(*) AS count
                 FROM orders
                 WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
                 GROUP BY DATE(created_at)
                 ORDER BY DATE(created_at) ASC`,
                (err4, dailyRes) => {
                  if (err4) return res.status(500).json(err4);
 
                  db.query(
                    `SELECT m.dish_name, SUM(oi.quantity) AS total
                     FROM order_items oi
                     JOIN menus m ON oi.menu_id = m.id
                     GROUP BY m.id
                     ORDER BY total DESC
                     LIMIT 5`,
                    (err5, topDishRes) => {
                      if (err5) return res.status(500).json(err5);
 
                      db.query(
                        `SELECT COALESCE(SUM(oi.subtotal), 0) AS revenue
                         FROM orders o
                         JOIN order_items oi ON o.id = oi.order_id
                         WHERE DATE(o.created_at) = CURDATE()`,
                        (err6, revenueRes) => {
                          if (err6) return res.status(500).json(err6);
 
                          db.query(
                            "SELECT COUNT(*) as pendingOrders FROM orders WHERE status='en attente'",
                            (err7, pendingResult)=>{
                              if(err7) return res.status(500).json({err7});
                              res.json({
                                totalOrdersToday: todayRes[0].totalOrders,
                                pendingOrders: pendingResult[0].pendingOrders,
                                statusBreakdown: statusRes,
                                mostOrderedDish: dishRes[0]?.dish_name || 'N/A',
                                dailyOrders: dailyRes,
                                topDishes: topDishRes,
                                estimatedRevenue: revenueRes[0].revenue,
                              });
                            }
                          )
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
}

  exports.updateStatusAndroid = (req, res) => {

  const { status } = req.body;

  const allowed = ["en_attente", "en_preparation", "prete", "servie", "annulee"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  if (status === "annulee") {
    db.query(
      "UPDATE orders SET status=? WHERE id=? AND status!='servie'",
      [status, req.params.id],
      (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.affectedRows === 0) {
          return res.status(400).json({ message: "Impossible d'annuler" });
        }

        res.json({ message: "Commande annulée" });
      }
    );
  } else {
    db.query(
      "UPDATE orders SET status=? WHERE id=?",
      [status, req.params.id],
      (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Statut mis à jour" });
      }
    );
  }
};