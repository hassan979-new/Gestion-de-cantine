const db = require('../config/db');

exports.getTodayMenus = (req, res) => {
  db.query(
    "SELECT * FROM menus WHERE menu_date = CURDATE()",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
};

exports.addMenu = (req, res) => {
  const { dish_name, price, available, menu_date } = req.body;

  db.query(
    "INSERT INTO menus(dish_name,price,available,menu_date) VALUES (?,?,?,?)",
    [dish_name, price, available, menu_date],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Menu added" });
    }
  );
};


exports.updateMenu = (req, res) => {
  db.query(
    "UPDATE menus SET available=? WHERE id=?",
    [req.body.available, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated" });
    }
  );
};

exports.deleteMenu = (req, res) => {
  db.query(
    "DELETE FROM menus WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
};