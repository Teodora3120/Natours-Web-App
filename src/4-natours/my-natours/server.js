const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require(`${__dirname}/app`);

// SERVER
const port = process.env.PORT || 5000;
app.listen(port, process.env.ADDRESS, () => {
  console.log(`Server is listening on port ${port}`);
});
