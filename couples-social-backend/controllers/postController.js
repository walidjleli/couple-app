const Post = require('../models/Post');

const createPost = async (req, res) => {
  const { coupleId, content, createdBy } = req.body;

  if (!coupleId || !content || !createdBy) {
    return res.status(400).json({ error: 'Champs requis manquants.' });
  }

  try {
    const post = await Post.create({ coupleId, content, createdBy });
    res.status(201).json(post);
  } catch (error) {
    console.error('Erreur création post :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

const getPostsByCouple = async (req, res) => {
  const { coupleId } = req.params;

  try {
    const posts = await Post.findAll({
      where: { coupleId },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Erreur récupération posts :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

const updatePost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Contenu requis.' });
  }

  try {
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ error: 'Post introuvable.' });

    post.content = content;
    await post.save();

    res.status(200).json({ message: 'Post mis à jour.', post });
  } catch (error) {
    console.error('Erreur update post :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

const deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ error: 'Post introuvable.' });

    await post.destroy();
    res.status(200).json({ message: 'Post supprimé.' });
  } catch (error) {
    console.error('Erreur suppression post :', error);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};


module.exports = {
  createPost,
  getPostsByCouple,
  updatePost,
  deletePost
};

