const User = require('./User');
const Couple = require('./Couple');
const Post = require('./Post');

// Relations
User.belongsTo(Couple, { foreignKey: 'couple_id' });
Couple.hasMany(User, { foreignKey: 'couple_id' });

module.exports = {
  User,
  Couple,
  Post
};
