import mongoose from "mongoose";

const Users=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    otp:{
        type: Number,
        minlength:4,
        maxlength:4,
        default:"",
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    number:{
        type:Number,
        unique: true,
        required:true,
    },
    emailId:{
        type: String,
        unique: true,
        required:true,
    },
    image:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
    },
    totalConversation:[
        {
            conversationId:{
                type : String,
                default:"",
           },
           participants: [{
            type: mongoose.Schema.Types.ObjectId,
          }],
           message:[
            {
                senderMobile:{
                    type:Number,
                },
                receiverMobile:{
                    type:Number,
                },
                content:{
                    type:String,
                    default:'',
                },
                createdAt:{
                    type:Date,
                    default:new Date()
                }
            }
           ]
        }
    ]
},{timestamps:true})


export default mongoose.model("User",Users)