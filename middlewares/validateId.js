module.exports = (req, res, next) => {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    req.params.id = parsedId;
    next();
  };