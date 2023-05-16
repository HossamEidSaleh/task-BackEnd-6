const mongoose = require('mongoose')
const validator = require('validator')

const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
        username : {
            type: String ,
            required: true,
            trim: true
        },
        password: {
            type: String ,
            required: true,
            trim: true,
            minlength:8,
            validate(value){
                let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                if(!password.test(value)){
                    throw new Error("password must include uppercase , lowercase , number , speacial charaters")
                }
            }
        },
        email:{
            type: String ,
            required: true,
            trim: true,
            lowercase:true,
            unique:true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error ('Email is invalid')
                }
            }
        },
        age:{
            type:Number,
            default:18,
            validate(value){
                if(value <= 0){
                    throw new Error ('age must be positive num')
                }
            }
        },
        city:{
            type: String 
        },
        tokens : [
            {
                type:String,
                required:true
            }
        ]
    })
    userSchema.pre("save" , async function(){
        const user = this
        // console.log(user)

        if(user.isModified('password')){
        user.password = await bcryptjs.hash(user.password , 8)
        }
       
    })




    ////////////////////

    userSchema.statics.findByCredentials = async (email , password)=>{
        const user = await User.findOne({email:email})

        if(!user){
            throw new Error('unable to login')
        }
        // console.log(user)
        const isMatch = await bcryptjs.compare(password , user.password)

        if(!isMatch){
            throw new Error('unable to login')
        }
        return user
    }


    /////////////////////


    userSchema.methods.generateToken = async function () {
        const user = this
        const token = jwt.sign({_id:user._id.toString()},"hossam111")
        user.tokens = user.tokens.concat(token)
        await user.save()
        return token
    }

    ////////////////////////////
    //privte data 

    userSchema.methods.toJSON = function(){
        const user = this 
        const userObj = user.toObject()

        delete userObj.password
        delete userObj.tokens

        return userObj
    }

    /////////////////////////////////////////////


const User = mongoose.model('User' , userSchema)
module.exports = User ;