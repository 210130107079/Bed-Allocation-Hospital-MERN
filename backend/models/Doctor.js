import mongoose from 'mongoose'

const docSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    degree:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Doctor = new mongoose.model('Doctor',docSchema)