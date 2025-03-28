import express from 'express'
import { addNewDoctor, getAllDoctor } from '../controller/docController.js'

const router = express.Router()

router.get('/get-doctors',getAllDoctor)
router.post('/add',addNewDoctor)

export default router