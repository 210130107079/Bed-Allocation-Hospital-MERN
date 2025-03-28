import { Doctor } from '../models/Doctor.js';

//Add New Doctor
export const addNewDoctor = async (req,res) => {
    const {name,age,degree} = req.body
    
      try
      {
        const doctor = await Doctor.findOne({name})
        if(doctor){
          return res.status(404).json({ message: 'Doctor Already Exist !' });
        }
    
        const newDoctor = new Doctor({name,age,degree})
        await newDoctor.save()
        res.status(200).json({message:"Doctor Added Successfully !"})
      }
      catch(error)
      {
        res.status(400).json({ message: error.message });
      }
}

//Get All Doctor
export const getAllDoctor = async (req,res) => {
    try
      {
        const doctors = await Doctor.find()
        res.json(doctors)
      }
      catch(error)
      {
        res.status(500).json({ message: error.message });
      }
} 