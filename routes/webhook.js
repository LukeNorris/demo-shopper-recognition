import express from 'express'
import asyncHandler from 'express-async-handler'
import Total from '../models/totalModel.js'
import hmacValidator from '../hmacValidator.js'
import { updateShopper } from './shopper.js'


const router = express.Router()

const updateTotal = asyncHandler(async (amount) => {
  try {
      const id = "62977706e0fb3610357d6904"
      let currentTotal = await Total.findById(id)
      let newTotal = currentTotal.total + amount
      if (newTotal > 10000 ) {
          newTotal = 10000
      } 
      currentTotal.total = newTotal
      const updatedTotal = await currentTotal.save()
      return(updatedTotal.total)
  } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
  }
})



const addtotal = asyncHandler(async (req, res) => {    
    try {
      let response = hmacValidator(req)
      //let response = true
      if(response){
        const eventType = req.body?.notificationItems[0]?.NotificationRequestItem?.eventCode
        const success = req.body?.notificationItems[0]?.NotificationRequestItem?.success
        const shopperReference = req.body?.notificationItems[0]?.NotificationRequestItem?.additionalData ? req.body?.notificationItems[0]?.NotificationRequestItem?.additionalData["recurring.shopperReference"] : null
        const recurringDetailReference = req.body?.notificationItems[0]?.NotificationRequestItem?.additionalData ? req.body?.notificationItems[0]?.NotificationRequestItem?.additionalData["recurring.recurringDetailReference"] : null

        const amount = req.body?.notificationItems[0]?.NotificationRequestItem?.amount?.value / 100 
        if(eventType == "AUTHORISATION" && success == "true" && amount < 21 && amount > 0 && !recurringDetailReference){
          updateTotal(amount)
          if(shopperReference){
            console.log(shopperReference)
            updateShopper(shopperReference, amount)
          }
        }
      }
        
      res.status(200).json(response? "[accepted]" : "Invalid hmac")
    } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.status(err.statusCode).json(err.message);
    }
});


// const addtotal = asyncHandler(async (req, res) => {   
//   try {
//     let response = hmacValidator(req)
//     if(response){
//       const eventType = req.body?.notificationItems[0]?.NotificationRequestItem?.eventCode
//       const success = req.body?.notificationItems[0]?.NotificationRequestItem?.success
//       const amount = req.body?.notificationItems[0]?.NotificationRequestItem?.amount?.value / 100 
//       if(eventType == "AUTHORISATION" && success == "true" && amount < 21 && amount > 0){
//         updateTotal(amount)
//       }
//     } 
//     res.status(200).json(response? "[accepted]" : "Invalid hmac") 
//   } catch (err) {
//     console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
//     res.status(err.statusCode).json(err.message);
//   }
// });




router.post('/webhook', addtotal)

export default router
