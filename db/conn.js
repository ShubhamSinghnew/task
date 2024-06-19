import * as dotenv from 'dotenv';
dotenv.config();
import mongoose, { connect } from "mongoose";
mongoose.connect(process.env.mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connection Successful');
  })
  .catch((err) => {
    console.error('Error in DB connection:', err.message); // Log the specific error message
    console.error(err); // Log the full error object for detailed information
  });