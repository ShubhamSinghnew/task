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
import PaymentPlan from "../model/paymentPlan.js"
import { Country } from "../model/city_state_country.js"
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
            user_id: Randomstring.generate(8),
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
    const { email, password } = req.body;
    const authTokenPayload = {
        email: email,
        password: password
    };

    try {
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        const check_plan = await PaymentPlan.findOne({ user_id: user.user_id });

        let planActive = false;

        function getIndianTime() {
            // Create a new Date object for the current date and time
            let now = new Date();

            // Get the time in UTC and add the offset for the Indian Standard Time (IST) zone (5 hours 30 minutes)
            let istOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds
            let istTime = new Date(now.getTime() + istOffset);

            return istTime;
        }

        if (check_plan && check_plan.plan_details.length > 0) {
            const toTime = new Date(check_plan.plan_details[0].to);
            const currentTime = getIndianTime();
            planActive = toTime >= currentTime; // Check if plan is still active
        }


        // if(user.count >= 3){
        //     return req.status(200).json({
        //         data : "",
        //         status : 200,
        //         message : "You riched your free trial limit!"
        //     })
        // }

        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        } else {
            const encryptedCode = await jwtsign(authTokenPayload);
            return res.status(200).json({
                data: {
                    user: user.name,
                    user_id: user.user_id,
                    email: user.email,
                    authcode: encryptedCode,
                    type: user.type,
                    count: user.count
                },
                plan_active: planActive,
                message: `User ${user.name} logged in successfully!`
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


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

const post_tution = async (req, res) => {
    const { post_title, auther, fees, city, state, address, subject, board, gender, phone } = req.body;
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    try {
        const newPost = new post({
            post_id: Randomstring.generate(8),
            post_title: post_title,
            auther, post_time: formattedDate,
            fees: fees,
            city: city,
            state: state,
            address: address,
            subject: subject,
            board: board,
            gender: gender,
            phone: phone
        });
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
    try {

        const isValidSignature = Razorpay.validateWebhookSignature(
            JSON.stringify(body),
            webhookSignature,
            'Shub12345'
        );

        if (isValidSignature) {
            const eventType = body.event;


            if (eventType === 'payment.captured') {

                const find = await userModel.findOne({ phone: body.payload.payment.entity.contact });

                if (find) {
                    const amount = body.payload.payment.entity.amount;

                    let plan;
                    let from;
                    let to;
                    function getIndianTime() {
                        // Create a new Date object for the current date and time
                        let now = new Date();

                        // Get the time in UTC and add the offset for the Indian Standard Time (IST) zone (5 hours 30 minutes)
                        let istOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds
                        let istTime = new Date(now.getTime() + istOffset);

                        return istTime;
                    }

                    function calculateToDate(fromDate, monthsToAdd) {
                        let to = new Date(fromDate);
                        to.setMonth(to.getMonth() + monthsToAdd);
                        return to;
                    }


                    if (amount === 100) {
                        plan = "39RS for 1 Month";
                        from = getIndianTime(); // Set from date to current Indian Standard Time
                        to = calculateToDate(new Date(from), 1); // Set to date to 1 month from from date
                    } else if (amount === 9900) {
                        plan = "99RS for 3 Month";
                        from = getIndianTime(); // Set from date to current Indian Standard Time
                        to = calculateToDate(new Date(from), 3); // Set to date to 3 months from from date
                    } else if (amount === 14900) {
                        plan = "149RS for 6 Month";
                        from = getIndianTime(); // Set from date to current Indian Standard Time
                        to = calculateToDate(new Date(from), 6); // Set to date to 6 months from from date
                    } else if (amount === 24900) {
                        plan = "249RS for 12 Month";
                        from = getIndianTime(); // Set from date to current Indian Standard Time
                        to = calculateToDate(new Date(from), 12); // Set to date to 12 months from from date
                    }


                    const newPlanDetail = {
                        from: from,
                        to: to,
                        plan: plan
                    };


                    const check_plan = await PaymentPlan.findOne({ user_id: find.user_id })

                    if (check_plan.length > 0) {
                        if (check_plan.plan_details.length > 0) {
                            const update_payment = await PaymentPlan.updateOne(
                                {
                                    user_id: find.user_id
                                },
                                {
                                    $push: {
                                        plan_details: {
                                            $each: [newPlanDetail],
                                            $position: 0
                                        }
                                    }
                                }
                            )
                            const update = await userModel.updateOne(
                                { email: find.email },  // Replace with the filter criteria
                                { $set: { count: 0 } }  // Replace with the update operations
                            );
                        }
                    } else {
                        plan_details.push(newPlanDetail);
                        const create = new PaymentPlan({
                            user_id: find.user_id, // Assuming user_id is an ObjectId reference to the User model
                            id: body.payload.payment.entity.id,
                            amount: amount,
                            currency: body.payload.payment.entity.currency,
                            order_id: body.payload.payment.entity.order_id,
                            vpa: body.payload.payment.entity.vpa,
                            contact: body.payload.payment.entity.contact,
                            plan_details: newPlanDetail
                        });

                        await create.save();
                        const update = await userModel.updateOne(
                            { email: find.email },  // Replace with the filter criteria
                            { $set: { count: 0 } }  // Replace with the update operations
                        );

                        await update.save()

                    }
                    if (check_plan && check_plan.plan_details.length > 0) {
                        const toTime = new Date(check_plan.plan_details[0].to);
                        const currentTime = getIndianTime();
                        planActive = toTime >= currentTime; // Check if plan is still active
                        if (planActive) {
                            const update = await userModel.updateOne(
                                { email: find.email },  // Replace with the filter criteria
                                { $set: { count: 0 } }  // Replace with the update operations
                            );
    
                            await update.save()
                        }
                    }

                }

                return res.send(`
                    <html>
                        <body>
                            <p>Payment was successful! You will be redirected shortly...</p>
                            <script>
                                setTimeout(function() {
                                    window.location.href = 'https://hometuitionsadda.com/';
                                }, 5000); // 5 seconds
                            </script>
                        </body>
                    </html>
                `);

                // res.status(200).send('Webhook received successfully');
            } else {
                console.log("5");
                // Handle other events if needed
                res.status(200).send('Webhook received successfully');
            }

            // Emit the event using io
            // io.emit(eventType);
        } else {
            // Invalid signature
            res.status(400).send('Invalid webhook signature');
        }
    } catch (error) {
        console.error("Error processing webhook:", error);
        res.status(500).send('Internal server error');
    }
};

const check_payment = async (req, res) => {

    const { user_id } = req.body;

    const find = await PaymentPlan.findOne({ user_id: user_id })

    if (find) {
        return res.status(200).json({
            status: 200,
            data: find,
        })
    } else {
        return res.send(false)
    }
}

const get_all_post = async (req, res) => {
    const all_posts = await post.find();

    if (all_posts.length > 0) {

        const all_posts_with_reviews = await Promise.all(all_posts.map(async (ele) => {
            const reviews_data = await reviews.findOne({ post_id: ele.post_id });
            let reviewsArray = [];

            if (reviews_data) {
                reviewsArray = await Promise.all(reviews_data.reviews_array.map(async (review) => {
                    const user = await userModel.findOne({ user_id: review.user_id });
                    return {
                        review: review.review,
                        user_id: review.user_id,
                        user_name: user ? user.name : 'Unknown'
                    };
                }));
            }


            return {
                ...ele._doc,
                reviews: reviewsArray
            };
        }));

        return res.status(200).json({
            data: all_posts_with_reviews.reverse()
        })
    } else {
        return res.status(200).json({
            message: "data not found"
        })
    }
}

const add_count = async (req, res) => {
    const { user_id } = req.body

    const user = await userModel.findOne({ user_id: user_id });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }
    // const check_plan = await PaymentPlan.findOne({ user_id: user_id });
    // if (check_plan && check_plan.plan_details.length > 0) {
    //     const toTime = new Date(check_plan.plan_details[0].to);
    //     const currentTime = getIndianTime();
    //     planActive = toTime >= currentTime; // Check if plan is still active
    //     if (planActive) {
    //         const update = await userModel.updateOne(
    //             { email: email },  // Replace with the filter criteria
    //             { $set: { count: 0 } }  // Replace with the update operations
    //         );
    //     }
    // }

    const update = await userModel.updateOne(
        { user_id: user_id },  // Replace with the filter criteria
        { $set: { count: user.count + 1 } }  // Replace with the update operations
    );
    const updatedUser = await userModel.findOne({ user_id: user_id });

    if (update) {
        return res.status(200).json({
            data: updatedUser.count
        })
    }

}

const get_state_city = async (req, res) => {
    try {
        const data = await Country.findOne({ id: 101 });
        if (data) {
            const find_state = data.states;
            const find_cities = data.states.reduce((acc, state) => {
                return acc.concat(state.cities);
            }, []);

            return res.status(200).json({
                data: { state: find_state, city: find_cities }
            });
        } else {
            return res.status(404).json({
                error: 'Country not found'
            });
        }
    } catch (error) {
        console.error('Error fetching state and city data:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
};
export { addUser, login, forgetPassword, restPassword, post_tution, add_review, get_post, save_post, check, check_payment, get_all_post, add_count, get_state_city }
