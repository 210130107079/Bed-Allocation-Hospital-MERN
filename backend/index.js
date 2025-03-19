import express from 'express';
import mongoose, { mongo } from 'mongoose';
import cors from 'cors';
import { Patient } from './models/Patient.js';
import { Room } from './models/Room.js';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://sohamtarabada2003:soham9898@cluster0.hgodl.mongodb.net/bed_db?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Initialize rooms and beds if they don't exist
async function initializeRoomsAndBeds() {
  const roomCount = await Room.countDocuments();
  
  if (roomCount === 0) {
    const rooms = [
      { roomNumber: 101, totalBeds: 30 },
      { roomNumber: 102, totalBeds: 30 },
      { roomNumber: 103, totalBeds: 30 }
    ];
    
    for (const room of rooms) {
      const newRoom = new Room(room);
      const beds = [];
      
      for (let i = 1; i <= room.totalBeds; i++) {
        beds.push({
          bedNumber: i,
          isOccupied: false
        });
      }
      
      newRoom.beds = beds;
      await newRoom.save();
    }
    
    console.log('Rooms and beds initialized');
  }
}

initializeRoomsAndBeds();

// Get all available beds
app.get('/api/beds/available', async (req, res) => {
  try {
    const rooms = await Room.find();
    const availableBeds = rooms.map(room => {
      return {
        roomNumber: room.roomNumber,
        beds: room.beds.filter(bed => !bed.isOccupied).map(bed => bed.bedNumber)
      };
    });
    
    res.json(availableBeds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Admitted patients
app.get('/api/patients/admitted', async (req, res) => {
  try {
    const patients = await Patient.find({dischargeDate:null})
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get Discharged Patients
app.get('/api/patients/discharged',async(req,res)=>{
  try
  {
    const patients = await Patient.find({ dischargeDate: { $ne:null}})
    res.json(patients)
  }
  catch(error)
  {
    res.status(500).json({ message: error.message });
  }
})

//get all the Patients
app.get('/api/patients/all',async(req,res)=>{
  try
  {
    const patients = await Patient.find()
    res.json(patients)
  }
  catch(error)
  {
    res.status(500).json({ message: error.message });
  }
})

// Admit a patient
app.post('/api/patients', async (req, res) => {
  const { name, age, roomNumber, bedNumber, totalDays } = req.body;
  
  try {
    // Check if the bed is available
    const room = await Room.findOne({ roomNumber });
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const bedIndex = room.beds.findIndex(bed => bed.bedNumber === bedNumber && !bed.isOccupied);
    
    if (bedIndex === -1) {
      return res.status(400).json({ message: 'Bed is not available' });
    }
    
    // Create a new patient
    const patient = new Patient({
      name,
      age,
      roomNumber,
      bedNumber,
      totalDays,
      admissionDate: new Date()
    });
    
    // Mark the bed as occupied
    room.beds[bedIndex].isOccupied = true;
    
    await room.save();
    await patient.save();
    
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Discharge a patient
app.put('/api/patients/:id/discharge', async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    if (patient.dischargeDate) {
      return res.status(400).json({ message: 'Patient already discharged' });
    }
    
    // Update patient discharge date
    patient.dischargeDate = new Date();
    await patient.save();
    
    // Free up the bed
    const room = await Room.findOne({ roomNumber: patient.roomNumber });
    const bedIndex = room.beds.findIndex(bed => bed.bedNumber === patient.bedNumber);
    
    if (bedIndex !== -1) {
      room.beds[bedIndex].isOccupied = false;
      await room.save();
    }
    
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});