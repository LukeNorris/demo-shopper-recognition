import express from 'express'
import asyncHandler from 'express-async-handler'
import Total from '../models/totalModel.js'


const router = express.Router()

const currentTotal = asyncHandler(async () => {
    try {
        //const id = "62977706e0fb3610357d6904"
        //backup db id below
        const id = "63822f6e91b8e5d989fb0250"
        const currentTotal = await Total.findById(id)
        if (currentTotal) {   
            return(currentTotal)
        } else {
            throw new Error('Total not found')
        }
    } catch (err) {
        console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    }
})

const getTotal = asyncHandler(async (req, res) => {
    try {
        const total = await currentTotal()
        res.status(200).json({'Donated amount': total})
    } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.status(err.statusCode).json(err.message);
    }
});


router.get('/', getTotal)

export default router
