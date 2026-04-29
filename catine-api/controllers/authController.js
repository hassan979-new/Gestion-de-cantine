const db=require('../config/db');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

exports.register = (req, res) => {
    const {name, email, password, role} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message: "Nom, email et mot de passe sont requis."});

    }

    if (password.length < 6) {
        return res.status(400).json({message: "Le mot de passe doit contenir au moins 6 caractères."});
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
        return res.status(400).json({ message: "Adresse email invalide." });

    const allowedRoles = ['agent'];
    const userRole = allowedRoles.includes(role) ? role : 'student';

    db.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
        (err, rows)=>{
            if(err) return res.status(500).json({message: "Erreur serveur."});
            if(rows.length > 0)
                return res.status(409).json({message: "Un compte avec cet email existe déjà." });
            
            const hashed = bcrypt.hashSync(password, 10);

            db.query(
                "INSERT INTO users(name,email,password, role) VALUES (?,?,?,?)",
                [name.trim(), email.trim(), hashed, userRole],
                (err2, result) => {
                    if (err2) return res.status(500).json({message: "Erreur lors de la création du compte." });
                    
                    const token = jwt.sign(
                        {id: result.insertId, role: userRole},
                        process.env.JWT_SECRET,
                        {expiresIn: "7d"}
                    );

                    res.status(201).json({message: "Compte créé avec succès.",token,
                        user: { id: result.insertId, name: name.trim(), email: email.trim().toLowerCase(), role: userRole }
                    });
                }
            );
        }
    )
    
    
};

exports.login = (req, res) => {
    const {email, password} = req.body;

    if (!email || !password)
        return res.status(400).json({ message: "Email et mot de passe requis." });

    db.query(
        "SELECT * FROM users WHERE email=?",
        [email.trim()],
        (err, result) => {
            if(err) return res.status(500).json({message: "Erreur serveur"});
            if (result.length === 0) {
                return res.status(404).json({message: "Aucun compte trouvé avec cet email."});
            }

            const user = result[0];

            const isValid = bcrypt.compareSync(password, user.password);
            if (!isValid) {
                return res.status(401).json({message: "Mot de passe incorrect."});

            }

            const token = jwt.sign(
                {id: user.id, role: user.role},
                process.env.JWT_SECRET,
                {expiresIn: '7d'}
            );

            const {password: _, ...safeUser}=user;

            res.json({token, user: safeUser});
        }
    );  
};

exports.me = (req, res) => {
        db.query(
            "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
            [req.user.id],
            (err, rows) =>{
                if(err) return res.status(500).json({ message: "Erreur serveur." });
                if(!rows.length) return res.status(404).json({message: "Utilisateur introuvable."});
                res.json(rows[0]);
            }
        );
};