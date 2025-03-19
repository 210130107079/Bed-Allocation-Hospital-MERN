import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface RoomBeds {
  roomNumber: number;
  beds: number[];
}

const AdmitPatient = () => {

  const navigate = useNavigate();
  const [availableRooms, setAvailableRooms] = useState<RoomBeds[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    roomNumber: '',
    bedNumber: '',
    totalDays: '',
    doctorName:'',
  });
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [doctors,setDoctors] = useState([])

  useEffect(()=>{
    const fetchDoctors = async () => {
      try
      {
        const response = await axios.get('http://localhost:5000/api/doctor/get-doctors')
        setDoctors(response.data)
      }
      catch(error)
      {
        console.log('Error Fetching Doctors',error);
      }
    }
    fetchDoctors()
  },[])

  useEffect(() => {
    const fetchAvailableBeds = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/beds/available');
        setAvailableRooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching available beds:', error);
        setLoading(false);
      }
    };

    fetchAvailableBeds();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'roomNumber' && value) {
      setSelectedRoom(parseInt(value));
      setFormData({
        ...formData,
        roomNumber: value,
        bedNumber: '' // Reset bed number when room changes
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!formData.name || !formData.age || !formData.roomNumber || !formData.bedNumber || !formData.totalDays || !formData.doctorName) {
      setError('All fields are required');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/patients', {
        name: formData.name,
        age: parseInt(formData.age),
        roomNumber: parseInt(formData.roomNumber),
        bedNumber: parseInt(formData.bedNumber),
        totalDays: parseInt(formData.totalDays),
        doctorName:formData.doctorName
      });
      
      setSuccess('Patient admitted successfully!');
      setFormData({
        name: '',
        age: '',
        roomNumber: '',
        bedNumber: '',
        totalDays: '',
        doctorName:'',
      });
      setSelectedRoom(null);
      
      // Refresh available beds
      const bedsResponse = await axios.get('http://localhost:5000/api/beds/available');
      setAvailableRooms(bedsResponse.data);
      
      // Redirect to patient list after 2 seconds
      setTimeout(() => {
        navigate('/admitted-patients');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error admitting patient');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admit New Patient</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter patient name"
              />
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="0"
                max="150"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter patient age"
              />
            </div>
            
            <div>
              <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Room Number
              </label>
              <select
                id="roomNumber"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Room</option>
                {availableRooms.map((room) => (
                  <option key={room.roomNumber} value={room.roomNumber}>
                    Room {room.roomNumber} ({room.beds.length} beds available)
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="bedNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Bed Number
              </label>
              <select
                id="bedNumber"
                name="bedNumber"
                value={formData.bedNumber}
                onChange={handleChange}
                disabled={!selectedRoom}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Bed</option>
                {selectedRoom && 
                  availableRooms
                    .find(room => room.roomNumber === selectedRoom)?.beds
                    .map((bedNumber) => (
                      <option key={bedNumber} value={bedNumber}>
                        Bed {bedNumber}
                      </option>
                    ))
                }
              </select>
            </div>
            
            <div>
              <label htmlFor="totalDays" className="block text-sm font-medium text-gray-700 mb-1">
                Total Days of Admission
              </label>
              <input
                type="number"
                id="totalDays"
                name="totalDays"
                value={formData.totalDays}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter total days"
              />
            </div>

            <div>
              <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-1">
                Doctor Name
              </label>
              <select
                id="doctorName"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Doctor</option>
                {
                  doctors.map((doctor)=>(
                    <option key={doctor._id} value={doctor.name}>{doctor.name}</option>
                  ))
                }
              </select>
            </div>

          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Admit Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdmitPatient;