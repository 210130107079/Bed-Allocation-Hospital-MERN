import React, { useEffect, useState } from 'react'
import DocRaw from '../DocRaw.png'
import axios from 'axios';

const AddNewDoc = () => {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const [name , setName] = useState('')
    const [age , setAge] = useState('')

    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/doctor/get-doctors');
        setDoctors(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching discharged patients:', error);
        setError('Failed to load doctors');
        setLoading(false);
      }
    };

    const handleAddNewDoc = async (e) => {
      e.preventDefault()
      try
      {
        if(!name || !age){
          console.log("Please Provide All the Information !");
        }

        const response = await axios.post('http://localhost:5000/api/doctor/add',{name,age})
        setSuccess("Doctor Added Successfully !")
        setName('')
        setAge('')
        window.location.reload()
      }
      catch(error)
      {
        setError(error.response?.data?.message || 'Error adding Doctor !');
      }
    }
  
    useEffect(() => {
      fetchDoctors();
    }, []);

    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

  return (
    <div className="flex">
      {/* FORM COMPONENT */}
      <div className="w-1/2 flex-col h-screen justify-center pt-28 mr-2">
        <div className="items-center mb-10 -mt-10">
          <img
            src={DocRaw}
            className="w-[150px] h-[170px] items-center justify-center ml-72"
          />
        </div>
        <form onSubmit={handleAddNewDoc}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Doctor Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter doctor name"
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Doctor Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={age}
                onChange={(e)=>setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter doctor age"
              />
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Add New Doctor
            </button>
          </div>
        </form>
      </div>

      <div className="h-[650px] w-[0.15rem] m-3 rounded-xl bg-black/50"></div>

      {/* LIST OF DOCS */}
      <div className="w-1/2 ml-2 h-screen">
        <div className="mt-2">
          <h1 className="text-3xl items-start font-bold">DOCTOR's LIST</h1>
        </div>
        {/* LIST SECTION */}
        <div>
          {error && (
            <div className="mb-4 p-3 mt-2 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 mt-2 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}
        </div>

        {doctors.length === 0 ? (
          <div>
            <p>Doc Not Found</p>
          </div>
        ) : (
          <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full mt-5 space-x-2 space-y-2 divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='items-center justify-center font-semibold p-2'>Name</th>
                    <th className='items-center justify-center font-semibold p-2'>Age</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {doctors.map((doctor)=>(
                    <tr key={doctor._id}>
                      <td className='px-3 text-center py-2'>
                        <div className='text-sm font-normal text-gray-900'>{doctor.name}</div>
                      </td>
                      <td className='px-3 py-2 text-center'>
                        <div className='text-sm font-normal text-gray-900'>{doctor.age}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
        }



      </div>
    </div>
  );
}

export default AddNewDoc