import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bed, Users } from 'lucide-react';

interface RoomBeds {
  roomNumber: number;
  beds: number[];
}

const Dashboard = () => {
  const [availableBeds, setAvailableBeds] = useState<RoomBeds[]>([]);
  const [patientCount, setPatientCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bedsResponse, patientsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/beds/available'),
          axios.get('http://localhost:5000/api/patients')
        ]);
        
        setAvailableBeds(bedsResponse.data);
        setPatientCount(patientsResponse.data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalAvailableBeds = availableBeds.reduce((total, room) => total + room.beds.length, 0);
  const totalBeds = 3 * 30; // 3 rooms with 30 beds each

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Bed Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Bed size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 uppercase">Available Beds</p>
              <p className="text-2xl font-semibold text-gray-700">{totalAvailableBeds} / {totalBeds}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(totalAvailableBeds / totalBeds) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 uppercase">Current Patients</p>
              <p className="text-2xl font-semibold text-gray-700">{patientCount}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${(patientCount / totalBeds) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Available Beds by Room</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableBeds.map((room) => (
            <div key={room.roomNumber} className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Room {room.roomNumber}</h3>
              <p className="text-gray-600 mb-2">Available: {room.beds.length} / 30</p>
              <div className="flex flex-wrap gap-2">
                {room.beds.map((bedNumber) => (
                  <span 
                    key={bedNumber} 
                    className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
                  >
                    Bed {bedNumber}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;