const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Couple = require('../models/Couple');
const nodemailer = require('nodemailer');

const SECRET_KEY = process.env.SECRET_KEY || 'monSecretUltraSecure';

// ✅ 1. Enregistrement du premier partenaire
const registerUser = async (req, res) => {
  const { email, password, partner_email } = req.body;

  if (!email || !password || !partner_email) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Utilisateur déjà inscrit.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userA = await User.create({
      email,
      password: hashedPassword,
      isConfirmed: true
    });

    const couple = await Couple.create({
      user1_id: userA.id,
      isValidated: false
    });

    // ✅ Met à jour le userA avec le couple_id
    await userA.update({ couple_id: couple.id });

    // ✅ Envoi email à partner
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'walid.jellali.66@gmail.com',
        pass: '**********'
      }
    });

    const mailOptions = {
      from: '"Couples Social App" <walid.jellali.66@gmail.com>',
      to: partner_email,
      subject: 'Invitation à rejoindre votre couple ❤️',
      text: `Bonjour 👋,\n\n${email} vous a invité à rejoindre votre couple sur Couples App !\n\nCode à utiliser : ${couple.id}\n\nOuvrez l’application et utilisez ce code pour valider votre couple.`
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('✅ Email envoyé à', partner_email);
    } catch (err) {
      console.error('❌ Erreur envoi email :', err);
    }

    res.status(201).json({
      message: 'Utilisateur créé avec succès.',
      coupleId: couple.id,
      partner_email
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ✅ 2. Confirmation du partenaire
const confirmPartner = async (req, res) => {
  const { email, password, coupleId } = req.body;

  if (!email || !password || !coupleId) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Utilisateur déjà inscrit.' });

    const couple = await Couple.findByPk(coupleId.trim());
    if (!couple || couple.user2_id) {
      return res.status(404).json({ error: 'Couple invalide ou déjà validé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userB = await User.create({
      email,
      password: hashedPassword,
      isConfirmed: true
    });

    // ✅ Associe le couple au userB
    await userB.update({ couple_id: couple.id });

    // ✅ Mets à jour le couple
    couple.user2_id = userB.id;
    couple.isValidated = true;
    await couple.save();

    res.status(200).json({ message: 'Partenaire confirmé 🎉' });
  } catch (error) {
    console.error('❌ Erreur confirm:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

// ✅ 3. Connexion
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email et mot de passe requis.' });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect.' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user.id,
        email: user.email,
        coupleId: user.couple_id
      }
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

module.exports = {
  registerUser,
  confirmPartner,
  loginUser
};
