module.exports = (req, res) => {
  res.status(404);
  const content = "404 Not Found";
  res.send(content);
};
