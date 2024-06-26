import userModel from "../model/user.js"
import post from "../model/post.js"
import Randomstring from "randomstring"
import { jwtsign } from "../helper.js"
import bcrypt from "bcrypt"
import dotenv from 'dotenv';
dotenv.config();
import nodemailer from "nodemailer"
import { randomBytes } from "crypto";
import reviews from "../model/addreviews.js"
import savepost from "../model/savepost.js"
import Razorpay from 'razorpay';
import axios from "axios"
// In this api i am registering the user and creating the taks as well  we can make different collection also and pass the userId in that task collection and add the task details in that collection and CURD will perform using their userId
const addUser = async (req, res) => {

    try {
        const { email, password, name, phone, type } = req.body;

        const user = await userModel.findOne({ email: email })

        if (user) {
            return res.status(409).json({ message: "user already exist" });
        }

        if (!email || !password || !name || !phone) {
            return res.status(400).json({ message: "Some fields are empty" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const add = new userModel({
            userId: Randomstring.generate(8),
            email,
            password: hashedPassword,
            name,
            phone,
            type
        });

        await add.save();
        return res.status(200).json({ message: "User added successfully" });

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

//login api
const login = async (req, res) => {
    const { email, password } = req.body
    const authTokenPayload = {
        email: email,
        password: password
    };
    const user = await userModel.findOne({ email: email })
    if (!user) {
        return res.status(400).json({ message: "user not found" })
    } else {
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect password" })
        } else {
            const encryptedCode = await jwtsign(authTokenPayload);
            return res.status(200).json({ data: { user: user.name, user_id: user.user_id, email: user.email, authcode: encryptedCode, type: user.type }, message: `user ${user.name} login successfully !!` });
        }
    }
}

const forgetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email })
    function generateRandomNumber(length) {
        const charset = '0123456789';
        let randomNumber = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomNumber += charset[randomIndex];
        }
        return randomNumber;
    }
    const randomString = generateRandomNumber(4);
    if (!user) {
        return res.status(400).json({ message: "user not found" })
    } else {
        await userModel.updateOne(
            { email: email },
            { $set: { otp: randomString } }
        )
    }
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        host: 465,
        auth: {
            user: process.env.email,
            pass: process.env.password
        }
    });

    const mailOptions = {
        from: process.env.email, // Use the actual sender email address
        to: email,
        subject: "This is a test email from Nodemailer.",
        text: `otp : ${randomString}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

const otp_verify = async (req, res) => {
    const { otp } = req.body
    const check_otp = await userModel.findOne({ otp: otp })
    if (check_otp) {
        const update = await userModel.updateOne(
            { email: email },
            { $set: { otp: "" } }
        )

        return res.status(200).json({ message: `otp verify successfully !!` });
    }

}
const restPassword = async (req, res) => {
    const { email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    const update = await userModel.updateOne(
        { email: email },
        { $set: { password: hashedPassword, otp: "" } }
    )

    if (update) {
        return res.status(200).json({ message: `password updated successfully !!` });
    } else {
        return res.status(500).json({ message: `something wrong` });
    }

}

// post 

const post_tution = async (req, res) => {
    const { user_id, post_title, auther, fees, city, state, address, subject, board, gender, phone } = req.body;

    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    try {
        const newPost = new post({ post_id: Randomstring.generate(8), user_id, post_title, auther, post_time: formattedDate, fees, city, state, address, subject, board, gender, phone });
        await newPost.save();

        return res.status(201).json({ message: 'Post created successfully', data: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const add_review = async (req, res) => {

    const { post_id, reviews_array } = req.body

    const post = await reviews.findOne({ post_id: post_id })

    if (post) {
        post.reviews_array.unshift(reviews_array[0])

        const updatedPost = await post.save();
        if (updatedPost) {
            return res.status(201).json({ message: 'review added successfully' });
        } else {
            return res.status(500).json({ message: 'something wrong while adding reviews' });
        }


    } else {
        const create = new reviews({

            reviews_id: Randomstring.generate(10),

            post_id: post_id,

            reviews_array: reviews_array

        })

        const added = await create.save()

        if (added) {
            return res.status(201).json({ message: 'review added successfully', data: added });
        } else {
            return res.status(500).json({ message: 'something wrong while adding reviews' });
        }
    }

}

const get_post = async (req, res) => {
    const { user_id } = req.body
    try {
        const all_posts = await post.find();

        const dataPromises = all_posts.map(async (ele) => {

            const find = await reviews.findOne({ post_id: ele.post_id });

            const save = await savepost.findOne({ user_id: user_id });

            // Check if the current post is saved by the user
            const isSaved = save && save.post_id.some(id => id === ele.post_id);
            if (find) {
                const reviewsWithUserNames = await Promise.all(
                    find.reviews_array.map(async (review) => {
                        const users = await userModel.findOne({ user_id: review.user_id });
                        return {
                            review: review.review,
                            user_id: review.user_id,
                            user_name: users ? users.name : 'Unknown',

                        };
                    })
                );

                const len = reviewsWithUserNames.length;

                return { ...ele._doc, reviews_count: len, reviews: reviewsWithUserNames, issaved: isSaved }; // Use ele._doc to ensure we are spreading the plain object
            } else {
                return { ...ele._doc, reviews_count: 0, reviews: [], issaved: isSaved };
            }
        });

        const data = await Promise.all(dataPromises);


        return res.status(200).json({ message: '', data: data.reverse() });
    } catch (error) {
        return res.status(500).json({ message: 'something went wrong getting posts', error: error.message });
    }
};



const save_post = async (req, res) => {
    const { post_id, user_id } = req.body

    const find = await savepost.findOne({ user_id: user_id })

    if (find) {
        if (find.post_id.length === 0) {
            find.post_id = post_id
        } else {
            post_id.forEach((ele) => {
                if (find.post_id.includes(ele)) {
                    // Remove ele from find.post_id
                    find.post_id = find.post_id.filter(id => id !== ele);
                } else {
                    // Add ele to find.post_id if not already present
                    if (!find.post_id.includes(ele)) {
                        find.post_id.push(ele);
                    }
                }
            });

        }


        const postadded = await find.save()

        if (postadded) {
            return res.status(201).json({ message: 'post saved successfully' });
        } else {
            return res.status(500).json({ message: 'something wrong while saving post' });
        }

    } else {
        const savedata = new savepost({
            user_id: user_id,
            post_id: post_id
        })

        const added = await savedata.save()

        if (added) {
            return res.status(201).json({ message: 'post saved added successfully', data: added });
        } else {
            return res.status(500).json({ message: 'something wrong while saving post' });
        }
    }

}

const check = async (req, res) => {
    const body = req.body;
    const webhookSignature = req.headers['x-razorpay-signature'];
    const io = req.io; // Access the io instance from the request
  
    try {
      console.log("1");
      const isValidSignature = Razorpay.validateWebhookSignature(
        JSON.stringify(body),
        webhookSignature,
        'Shub12345'
      );
  
      console.log("2");
  
      if (isValidSignature) {
        const eventType = body.event;
        console.log("3");
  
        if (eventType === 'payment.captured') {
          const find = await userModel.findOne({ phone: body.payload.payment.entity.contact });
  
          if (find) {
            let plan;
            const amount = body.payload.payment.entity.amount;
  
            if (amount === 200) {
              plan = "A";
            } else if (amount === 400) {
              plan = "B";
            } else if (amount === 600) {
              plan = "C";
            }
  
            const create = new PaymentPlan({
              user_id: find._id, // Assuming user_id is an ObjectId reference to the User model
              id: body.payload.payment.entity.id,
              amount: amount,
              currency: body.payload.payment.entity.currency,
              order_id: body.payload.payment.entity.order_id,
              vpa: body.payload.payment.entity.vpa,
              contact: body.payload.payment.entity.contact,
              plan: plan
            });
  
            await create.save();
          }
  
          console.log("4");
          res.status(200).send('Webhook received successfully');
        } else {
          console.log("5");
          // Handle other events if needed
          res.status(200).send('Webhook received successfully');
        }
  
        // Emit the event using io
        io.emit(eventType);
      } else {
        // Invalid signature
        res.status(400).send('Invalid webhook signature');
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).send('Internal server error');
    }
};

export { addUser, login, forgetPassword, restPassword, post_tution, add_review, get_post, save_post, check }
