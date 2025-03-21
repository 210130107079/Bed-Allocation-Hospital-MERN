import axios from 'axios';
import React, { useEffect, useState } from 'react'

const DischargedPatients = () => {

    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    const fetchPatient = async () => {
        try
        {
            const response = await axios.get('http://localhost:5000/api/patients/discharged')
            setPatients(response.data)
            setLoading(false)
        }
        catch(error)
        {
            console.error('Error fetching discharged patients:', error);
            setError('Failed to load patients');
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchPatient()
    },[])

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      };

    if (loading) {
        return (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        );
      }
    
      return (
        <div className='select-none'>
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Patient List</h1>
          
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
          
          {patients.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No patients found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bed
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Days
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Doctor
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Admission Date
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Discharged Date
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-center divide-y divide-gray-200">
                    {patients.map((patient) => (
                      <tr key={patient._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{patient.age}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{patient.roomNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{patient.bedNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{patient.totalDays}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{patient.doctorName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(patient.admissionDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(patient.dischargeDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {patient.dischargeDate ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Discharged
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              Admitted
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {!patient.dischargeDate && (
                            <button
                              onClick={() => handleDischarge(patient._id)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Discharge
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
}

export default DischargedPatients