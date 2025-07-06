const Couple = require('../models/Couple');

const createCouple = async (req, res) => {
  const { partner1_email, partner2_email } = req.body;

  if (!partner1_email || !partner2_email) {
    return res.status(400).json({ error: 'Les deux emails sont requis' });
  }

  try {
    // Vérifie si un couple avec ces emails existe déjà
    const existing = await Couple.findOne({
      where: {
        partner1_email,
        partner2_email
      }
    });

    if (existing) {
      return res.status(409).json({ error: 'Ce couple existe déjà' });
    }

    const couple = await Couple.create({
      partner1_email,
      partner2_email
    });

    res.status(201).json(couple);
  } catch (error) {
    console.error('Erreur création couple :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { createCouple };
