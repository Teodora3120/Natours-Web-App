const app = require(`${__dirname}/app`);

// SERVER
const PORT = 5000;
const address = '127.0.0.1';
app.listen(PORT, address, () => {
  console.log(`Server is listening on port ${PORT}`);
});
