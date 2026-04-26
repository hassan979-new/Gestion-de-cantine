const db = require('../config/db');
const path = require('path');
const fs   = require('fs');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
 
const toImageUrl = (filename) =>
  filename ? `${BASE_URL}/api/menus/images/${filename}` : null;

exports.getTodayMenus = (req, res) => {
  db.query(
    "SELECT * FROM menus WHERE menu_date = CURDATE() ORDER BY id ASC",
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur serveur." });
      res.json(result.map(m => ({...m, image_url: toImageUrl(m.image)})));
    }
  );
};

exports.getMenusByDate = (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  db.query(
    "SELECT * FROM menus WHERE menu_date = ? ORDER BY id ASC",
    [date],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur serveur." });
      res.json(result.map(m => ({ ...m, image_url: toImageUrl(m.image) })));
    }
  );
};

exports.addMenu = (req, res) => {
  const { dish_name, price, available, menu_date } = req.body;
  const image = req.file ? req.file.filename : null;

  db.query(
    "INSERT INTO menus(dish_name,price,available,menu_date, image) VALUES (?,?,?,?,?)",
    [dish_name.trim(), Number(price), available ?? 1, menu_date, image],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Erreur lors de l'ajout." });
      res.json({ message: "Plat ajouté", id: result.insertId, image_url: toImageUrl(image)});
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
  db.query("SELECT image FROM menus WHERE id = ?", [req.params.id], (err, rows) => {
    if (!err && rows[0]?.image) {
      const filePath = path.join(__dirname, '../uploads', rows[0].image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    db.query("DELETE FROM menus WHERE id = ?", [req.params.id], (err2) => {
      if (err2) return res.status(500).json({ message: "Erreur serveur." });
      res.json({ message: "Supprimé." });
    });
  });
};