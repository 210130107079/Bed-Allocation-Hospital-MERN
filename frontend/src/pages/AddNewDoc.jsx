import React, { useEffect, useState } from 'react'
import DocRaw from '../DocRaw.png'
import { useDispatch, useSelector } from 'react-redux';
import { addDoctor, clearStatus, fetchDoctor } from '../redux/doctorSlice';

const AddNewDoc = () => {

    const [name , setName] = useState('')
    const [age , setAge] = useState('')
    const [degree , setDegree] = useState('')

    const dispatch = useDispatch()
    const {doctorList:doctors,loading,error,success} = useSelector((state) => state.doctors)


    useEffect(()=>{
      dispatch(fetchDoctor())
    },[success])

    useEffect(()=>{
      if(success || error){
        setTimeout(()=>{
          dispatch(clearStatus())
        },1000)
      }
    },[success,error])

    const handleAddNewDoc = (e) => {
      e.preventDefault();
      if (!name || !age || degree === "Select Degree") {
        console.log("Please provide valid information!");
        return;
      }
      dispatch(addDoctor({ name, age: Number(age), degree }))
      setName('')
      setAge('')
      setDegree('')
    }

    return (
      <div className="flex select-none">
        {/* FORM */}
        <div className="w-1/2 flex-col h-screen justify-center pt-28 mr-2">
          <div className="items-center mb-10 -mt-10">
            <img src={DocRaw} className="w-[150px] h-[170px] ml-72" />
          </div>
          <form onSubmit={handleAddNewDoc}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter doctor name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter doctor age"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Degree</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter doctor degree"
                />
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none">
                Add New Doctor
              </button>
            </div>
          </form>
        </div>
  
        <div className="h-[650px] w-[0.15rem] m-3 rounded-xl bg-black/50"></div>
  
        {/* LIST OF DOCS */}
        <div className="w-1/2 ml-2 h-screen">
          <h1 className="text-3xl font-semibold bg-blue-600 px-3 py-2 hover:scale-110 hover:bg-blue-800 w-fit rounded-lg text-white mb-10">DOCTOR's LIST</h1>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : doctors?.length === 0 ? (
            <p>Doctor Not Found</p>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full mt-5 divide-y divide-gray-200">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="p-2 text-left pl-10">Name</th>
                      <th className="p-2 text-left pl-10">Degree</th>
                      <th className="p-2 text-left pl-10">Age</th>
                      <th className="p-2 text-left pl-10">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {doctors.map(doctor => (
                      <tr key={doctor._id}>
                        <td className="px-3 text-left py-2 pl-10">Dr. {doctor.name}</td>
                        <td className="px-3 text-left py-2 pl-10">{doctor.degree}</td>
                        <td className="px-3 text-left py-2 pl-10">{doctor.age}</td>
                        <td className="px-3 text-left py-2 pl-10">{new Date(doctor.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}

export default AddNewDoc