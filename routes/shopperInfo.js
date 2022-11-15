import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'
import { queryStringToJSON }  from '../utils/queryStringParse.js' 
import { getShopperProfile } from './shopper.js'

dotenv.config()


const router = express.Router()

const postData = (total = 1, serviceId, terminalSerial)=> {
    return {
      "SaleToPOIRequest":{
          "MessageHeader":{
              "ProtocolVersion":"3.0",
              "MessageClass":"Service",
              "MessageCategory":"Payment",
              "MessageType":"Request",
              "SaleID":"POSSystemID12345",
              "ServiceID": serviceId,
              //"POIID":"S1F2-000158204502794"
              //"POIID":"S1F2-000158215130669"
              //"POIID":"V400cPlus-402023788"
              //"POIID":"V400m-346510917"
              "POIID":terminalSerial           
          },
          "PaymentRequest":{
              "SaleData":{
                  "SaleTransactionID":{
                      "TransactionID":Math.floor(Math.random() * Math.floor(10000000)).toString(),
                      "TimeStamp":new Date().toISOString()
                  },
                  "saleToAcquirerData": "tenderOption=ReceiptHandler&tenderOption=AskGratuity",
                  "saleReferenceID": "saleReferenceID",
              },
              "PaymentTransaction":{
                  "AmountsReq":{
                      "Currency":"EUR",
                      "RequestedAmount":total
                  }
              },
              "PaymentData": {
                  "paymentType": "Normal"
              }          
          }
      }
  }
}

const cloudNetworkHeaders = {
    headers: {
      "x-API-Key": process.env.API_KEY,
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    }
  }

const makePaymentCloud = async (terminalSerial) => {
    let serviceId = Math.floor(Math.random() * Math.floor(10000000)).toString()
	const response = await axios.post(
        "https://terminal-api-test.adyen.com/sync", 
        postData(1, serviceId, terminalSerial), 
        cloudNetworkHeaders
    )
  return response.data
}


  
// const shopperInfo = asyncHandler(async (req, res) => {
//     const { terminalSerial } = req.body
//     console.log(terminalSerial)
//     try {
//         const terminalResponse = await makePaymentCloud(terminalSerial)
//         const string = terminalResponse?.SaleToPOIResponse?.PaymentResponse?.Response?.AdditionalResponse?.toString()
//         console.log(terminalResponse.SaleToPOIResponse.PaymentResponse.Response.AdditionalResponse.toString())
//         const newString = queryStringToJSON(string)
//         const shopperReference = newString['recurring.shopperReference']
//         console.log(shopperReference)

//         const profile = await getShopperProfile(shopperReference)
//         console.log('profile go', profile)
//         res.status(200).json(profile)
//     } catch (err) {
//       console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
//       res.status(err.statusCode).json(err.message);
//     }
//   });

const shopperInfo = asyncHandler(async (req, res) => {
    const { terminalSerial } = req.body
    console.log(terminalSerial)
    try {
        const terminalResponse = await makePaymentCloud(terminalSerial)
        const string = terminalResponse?.SaleToPOIResponse?.PaymentResponse?.Response?.AdditionalResponse?.toString()
        console.log(terminalResponse.SaleToPOIResponse.PaymentResponse.Response.AdditionalResponse.toString())
        const newString = queryStringToJSON(string)
        const shopperReference = newString['recurring.shopperReference']
        console.log(shopperReference)
        if(!shopperReference){
            res.status(200).json({"profile":"not found"})
        }
        const profile = await getShopperProfile(shopperReference)
        console.log('profile go', profile)
        res.status(200).json(profile)

    } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.status(err.statusCode).json(err.message);
    }
  });


router.post('/', shopperInfo)

export default router
