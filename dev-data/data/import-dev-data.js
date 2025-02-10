// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: '../../config.env' });

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

const tours = JSON.parse(fs.readFileSync('./tours.json', 'utf-8'));
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data succesfully deleted!');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(0);
  }
};

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data succesfully imported!');
  } catch (err) {
    console.log(err);
  } finally {
    process.exit(0);
  }
};

// importData();
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
