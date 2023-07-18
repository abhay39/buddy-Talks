import express from 'express';
import dotenv from 'dotenv';
import User from './models/users.js'
import mongoose from 'mongoose';
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'

dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'gmail',
    auth: {
        user: 'abhayguptaak39@gmail.com',
        pass: 'cnxnswlxhsgpsdtb'
    },
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
});

const app = express();
app.use(express.json())
const PORT=process.env.PORT || 8000;
const MONGO_URI=process.env.MONGO_URI;

app.get("/",(req,res)=>{
    res.send("Hello World");
})

const connect=async()=>{
    try{
        await mongoose.connect(MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log("Connected to Mongo DB");
    }catch(err){
        console.log(err.message);
    }
}

app.post("/create",async(req,res)=>{
    const {name,number,emailId}=req.body; 
    try{
        const findUser=await User.findOne({number:number,emailId:emailId});
        if(findUser){
            res.status(422).json({'message':"Number already exists"})
        }else{
            
            const otp=String(Math.floor(Math.random() * 9999) + 1);

            let user=new User ({
                name : name,
                number : Number(number),
                emailId : emailId,
                otp:otp
            })
            
            const mailOptions=({
                from: "abhayguptaak39@gmail.com",
                to: `${emailId}`,
                subject: 'Buddy Talks Account Verification - OTP Required',
                html: `
                
                <br/>Thank you for registering an account with Instant Pay, the leading payment website for secure and convenient financial transactions. To ensure the safety and protection of your account, we kindly request you to verify your identity by completing the OTP (One-Time Password) verification process.
                <b>The OTP is ${otp}</b>
                
                <br/>As a valued user, your security is of utmost importance to us. The OTP verification process helps us confirm that you are the legitimate owner of the registered email address and phone number. This additional layer of security ensures that only you have access to your Instant Pay account, preventing unauthorized access and potential fraud.
                
                <br/>To proceed with the OTP verification, please follow these steps:
                
                <br/>1. Log in to your Instant Pay account using your registered email address and password.
                <br/>2. Navigate to the "Account Settings" or "Security Settings" section, where you will find the "OTP Verification" option.
                <br/>3. Select the option to request an OTP.
                
                <br/>Once you've requested the OTP, you will receive a unique numerical code via SMS or email (depending on your preference) to the contact information associated with your account. Please enter this OTP within the designated field on the Instant Pay platform to complete the verification process.
                
                <br/>We highly recommend completing this verification promptly to enjoy the full range of services and benefits available on Instant Pay. In case you face any difficulties or have any questions, our support team is ready to assist you. Simply reach out to our customer service representatives via or visit our Help Center at Instant pay help center.
                
                <br/>Your trust and satisfaction are essential to us, and we want to ensure your experience with Instant Pay is smooth and secure. Thank you for choosing Instant Pay as your preferred payment platform.
                
                <br/><b>Best regards,
                
                <br/>Abhay Kumar Gupta
                <br/>Customer Support Representative
                <br/>Buddy Talks</b>`,
            })
        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                console.error('Error sending email:', error);
                } else {
                console.log('Email sent:', info.response);
                }
            });

            user.save().then((data)=>{
                res.status(201).json({
                "message":`OTP has been sent to your ${data.emailId}. Kindly verify it to get started`
            });
            })
        }
    }catch(err){
        res.status(500).json({"message": err.message })
    }
})

app.post("/login",async(req,res)=>{
    const {number}=req.body; 
    try{
        const findUser=await User.findOne({number:number});
        if(!findUser){
            res.status(422).json({'message':"No Number is registered."})
        }else{ 
            const otp=String(Math.floor(Math.random() * 9999) + 1);
            
            const mailOptions=({
                from: "abhayguptaak39@gmail.com",
                to: `${findUser.emailId}`,
                subject: 'Buddy Talks Account Verification - OTP Required',
                html: `
                
                <br/>Thank you for registering an account with Instant Pay, the leading payment website for secure and convenient financial transactions. To ensure the safety and protection of your account, we kindly request you to verify your identity by completing the OTP (One-Time Password) verification process.
                <b>The OTP is ${otp}</b>
                
                <br/>As a valued user, your security is of utmost importance to us. The OTP verification process helps us confirm that you are the legitimate owner of the registered email address and phone number. This additional layer of security ensures that only you have access to your Instant Pay account, preventing unauthorized access and potential fraud.
                
                <br/>To proceed with the OTP verification, please follow these steps:
                
                <br/>1. Log in to your Instant Pay account using your registered email address and password.
                <br/>2. Navigate to the "Account Settings" or "Security Settings" section, where you will find the "OTP Verification" option.
                <br/>3. Select the option to request an OTP.
                
                <br/>Once you've requested the OTP, you will receive a unique numerical code via SMS or email (depending on your preference) to the contact information associated with your account. Please enter this OTP within the designated field on the Instant Pay platform to complete the verification process.
                
                <br/>We highly recommend completing this verification promptly to enjoy the full range of services and benefits available on Instant Pay. In case you face any difficulties or have any questions, our support team is ready to assist you. Simply reach out to our customer service representatives via or visit our Help Center at Instant pay help center.
                
                <br/>Your trust and satisfaction are essential to us, and we want to ensure your experience with Instant Pay is smooth and secure. Thank you for choosing Instant Pay as your preferred payment platform.
                
                <br/><b>Best regards,
                
                <br/>Abhay Kumar Gupta
                <br/>Customer Support Representative
                <br/>Buddy Talks</b>`,
            })
        
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                console.error('Error sending email:', error);
                } else {
                console.log('Email sent:', info.response);
                }
            });


            const addingOTP=await User.findByIdAndUpdate({
                _id:findUser._id,
            },{
                $set:{
                    otp:otp
                }
            })
            console.log(addingOTP)
            {addingOTP?(res.status(201).json({
                "message":`OTP has been sent to your ${addingOTP.emailId}. Kindly verify it to get login`
            })):(res.status(422).json({
                "message":`Not Done`
            }))}
        }
    }catch(err){
        res.status(500).json({"message": err.message })
    }
})

app.post("/verifyOTP",async(req,res)=>{
    const {number,otp}=req.body; 
    try{
        const findUser=await User.findOne({number:number});
        if(findUser){
            if(findUser.otp==otp){
                //update the status of otp verified in db
                const updateOTP=await User.findByIdAndUpdate({
                    _id:findUser._id,
                },{
                    $set:{
                        isVerified:true
                    }
                })
                const token=await jwt.sign({id:findUser._id},process.env.JWT_SEC,{
                    expiresIn:"720h"
                })
                {updateOTP?(res.status(201).json({
                    "message":"Your account has been verified successfully.",
                    "token":token
                })):( res.status(422).json({"message":"Wrong OTP provided."}))}
            }
        }else{   
            res.status(422).json({"message":"Wrong OTP provided."}) 
        }
    }catch(err){
        res.status(500).json({
            "message":err.message
        })
    }
})

app.post("/verifyOTPToLogin",async(req,res)=>{
    const {number,otp}=req.body; 
    try{
        const findUser=await User.findOne({number:number});
        if(findUser){
            if(findUser.otp==otp){
                //update the status of otp verified in db
               
                const token=await jwt.sign({id:findUser._id},process.env.JWT_SEC,{
                    expiresIn:"720h"
                })
                res.status(201).json({
                    "message":"Your account has been verified successfully.",
                    "token":token
                })
            }else{
                res.status(422).json({"message":"Wrong OTP provided."})
            }
        }else{   
            res.status(422).json({"message":"Wrong OTP provided."}) 
        }
    }catch(err){
        res.status(500).json({
            "message":err.message
        })
    }
})

app.post("/conversation",async(req,res)=>{
    const {senderMobile,receiverMobile,content}=req.body; 
    try{
        const findUser=await User.findOne({number:senderMobile});
        const findUser2=await User.findOne({number:receiverMobile});

        if(findUser && findUser2){
            let convoId;
            if(findUser._id>findUser2._id){
                convoId=findUser2._id+findUser._id;
            }else{
                convoId=findUser._id+findUser2._id;
            }
            const query = { 'totalConversation.conversationId': convoId };
            const prevCon=await User.findOne(query)
            
            const newMessage={
                senderMobile:senderMobile,
                receiverMobile:receiverMobile,
                content:content,
            }

            const allInfo={
                message:[newMessage],
                conversationId:convoId,
                participants:[findUser._id,findUser2._id]
            }
            const updateTheValues=await User.findByIdAndUpdate({
                _id : findUser._id,
            },{
                $push:{
                    totalConversation:allInfo
                }
            })
            const updateTheValues2=await User.findByIdAndUpdate({
                _id : findUser2._id,
            },{
                $push:{
                    totalConversation:allInfo
                }
            })
            {updateTheValues&&updateTheValues2?(res.json("Done")):(res.json("Not Sent"))}
            
        }
    }catch(err){
        res.status(500).json({"error": err.message })
    }
})

app.post("/getDetails",async(req,res)=>{
    const {token}=req.body;
    try{
        const decoded=await jwt.verify(token,process.env.JWT_SEC);
        const user=await User.findById(decoded.id);
        if(user){
            res.status(200).json({
                "message":"Got the data",
                "userData":user
            })
        }else{
            res.status(404).json({"message":"Not a valid token"})
        }
    }catch(err){
        res.status(404).json({"message":"Not a valid token"})
    }
})

app.post("/getPeerConversations",async(req,res)=>{
    const {senderMobile,receiverMobile}=req.body;
    try{
        const findUserMessage=await User.findOne({number:senderMobile});
        const findUserMessage2=await User.findOne({number:receiverMobile});
        
        if(findUserMessage && findUserMessage2){
            let convoId;
            if(findUserMessage._id>findUserMessage2._id){
                convoId=findUserMessage2._id+findUserMessage._id;
            }else{
                convoId=findUserMessage._id+findUserMessage2._id;
            }
            //console.log("convoID:",convoId);
            var convs=[];
            for(let i=0;i<=findUserMessage.totalConversation.length;i++){
                convs.push(findUserMessage.totalConversation[i]);
            }
            let finalMessage=[];
            convs.map((item)=>{
                if(item?.conversationId==convoId){
                    finalMessage.push(item)
                }
            })

            console.log(finalMessage)
            res.json({"message":finalMessage})
            
            
        }else{
           res.sendStatus(401).json({"message":"No Data"})
        }
    }catch(err){
        res.json({"error":err.message})
    }
})


app.listen(PORT,()=>{
    connect();
    console.log(`Server running on port ${PORT}`);
})