import {createAsyncThunk,createSlice} from '@reduxjs/toolkit'
import axios from 'axios' 

export const fetchDoctor = createAsyncThunk('/doctor/fetch',async () => {
        try
        {
            const response = await axios.get('http://localhost:5000/api/doctor/get-doctors')
            return response.data
        }
        catch(error)
        {
            console.log(error.response?.data?.message);
            console.log("Error Fetching Doctors !");
        }
    }
)

export const addDoctor = createAsyncThunk('/doctor/add',async ({name,age,degree}) => {
    try
    {
        await axios.post('http://localhost:5000/api/doctor/add',{name,age,degree},{headers:{'Content-Type' : 'application/json'}})
        console.log('Doctor Added Successfully');
        return 'Doctor Added Successfully!';
    }
    catch(error)
    {
        console.log(error);
        console.log("Error Adding a New Doctor !");
    }
})

const doctorSlice = createSlice({
    name:'doctors',
    initialState:{
        doctorList:[],
        loading:false,
        error:null,
        success:null
    },
    reducers:{
        clearStatus:(state) => {
            state.error='';
            state.success='';
        }
    },

    extraReducers:(builder) => {
        builder
            .addCase(fetchDoctor.pending , (state) => {
                state.loading = true
                state.error = ''
            })
            .addCase(fetchDoctor.fulfilled , (state,action) => {
                state.loading = false;
                state.doctorList = action.payload
            })
            .addCase(fetchDoctor.rejected , (state,action) => {
                state.error = action.payload
                state.loading = false
            })
            .addCase(addDoctor.pending , (state) => {  
                state.loading = true
                state.error = ''   
            })
            .addCase(addDoctor.fulfilled , (state,action) => {
                state.loading = false
                state.success = action.payload
            })
            .addCase(addDoctor.rejected , (state,action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const {clearStatus} = doctorSlice.actions
export default doctorSlice.reducer