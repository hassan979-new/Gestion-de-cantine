const db=require('../config/db');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

exports.register = (req, res) => {
    const {name, email, password} = req.body;

    const hashed = bcrypt.hashSync(password, 10);

    db.query(
        "INSERT INTO users(name,email,password) VALUES (?,?,?)",
        [name, email, hashed],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({message: "User created"});
        }
    );
};

exports.login = (req, res) => {
    const {email, password} = req.body;

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email],
        (err, result) => {
            if (result.length === 0) {
                return res.status(404).json({message: "User not found"});
            }

            const user = result[0];

            const isValid = bcrypt.compareSync(password, user.password);
            if (!isValid) {
                return res.status(401).json({message: "Wrong password"});

            }

            const token = jwt.sign(
                {id: user.id, role: user.role},
                process.env.JWT_SECRET,
                {expiresIn: '1d'}
            );

            res.json({token, user});
        }
    );
};