import userModel from "../model/user.js"
import Randomstring from "randomstring"
import task from "../model/taks.js"
import { jwtsign } from "../helper.js"
import { io } from "../server.js";
import bcrypt from "bcrypt"

// In this api i am registering the user and creating the taks as well  we can make different collection also and pass the userId in that task collection and add the task details in that collection and CURD will perform using their userId
const addUser = async (req, res) => {

    try {
        const { email, password, name, phone, type, officeName, mahareraNo, locations, agreeToPolicy } = req.body;

        if (!email || !password || !name || !phone) {
            return res.status(400).json({ message: "Some fields are empty" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const add = new userModel({
            userId: Randomstring.generate(8),
            email,
            password : hashedPassword,
            name,
            phone,
            type,
            officeName,
            mahareraNo,
            locations,
            profilePicture: '', // Provide a value for profilePicture
            agreeToPolicy,
        });

        console.log(add);
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
    }else{
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect password" })
        }else{
            const encryptedCode = await jwtsign(authTokenPayload);
            return res.status(200).json({data : {user:user.name, email : user.email, authcode : encryptedCode}, message: `user ${user.name} login successfully !!` });
        }
    }
}



export { addUser, login }
