const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Task1 = mongoose.model('Task',{
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    }
})
module.exports = Task1