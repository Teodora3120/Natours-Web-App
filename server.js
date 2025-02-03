// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection established!');
  })
  .catch((err) => {
    console.log(err);
  });
// SERVER
const port = process.env.PORT || 5000;
app.listen(port, process.env.ADDRESS, () => {
  console.log(`Server is listening on port ${port}`);
});
