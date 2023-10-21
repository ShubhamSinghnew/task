import * as dotenv from 'dotenv';
dotenv.config();
import { connect } from "mongoose";
connect(process.env.mongourl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => console.log(`Connection Succesful`))
    .catch(err => console.log(`Error in DB connection`));