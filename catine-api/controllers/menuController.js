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

exports.getMenusByDate = (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  db.query(
    "SELECT * FROM menus WHERE menu_date = ? ORDER BY id ASC",
    [date],
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
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Plat ajouté", id: result.insertId });
    }
  );
};


exports.updateMenu = (req, res) => {
  const { dish_name, price, available } = req.body;
  // build dynamic SET clause
  const fields = [];
  const values = [];
  if (dish_name !== undefined) { fields.push('dish_name = ?'); values.push(dish_name); }
  if (price !== undefined)     { fields.push('price = ?');     values.push(price); }
  if (available !== undefined) { fields.push('available = ?'); values.push(available); }
  if (!fields.length) return res.status(400).json({ message: "Aucun champ à mettre à jour." });
  values.push(req.params.id);
 
  db.query(
    `UPDATE menus SET ${fields.join(', ')} WHERE id = ?`,
    values,
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Mis à jour" });
    }
  );
};

exports.deleteMenu = (req, res) => {
  db.query(
    "DELETE FROM menus WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Supprimé" });
    }
  );
};