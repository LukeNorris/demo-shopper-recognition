import express from 'express'
import axios from 'axios'
import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'
import { queryStringToJSON }  from '../utils/queryStringParse.js' 
import { getShopperProfile } from './shopper.js'

dotenv.config()


const router = express.Router()

const postData = (total = 10.95, serviceId, terminalSerial)=> {
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
              "POIID":"V400m-346510917"


              //"POIID":terminalSerial    
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

const makePaymentCloud = async () => {
    let serviceId = Math.floor(Math.random() * Math.floor(10000000)).toString()
	const response = await axios.post(
        "https://terminal-api-test.adyen.com/sync", 
        postData(1, serviceId), 
        cloudNetworkHeaders
    )
  //console.log(response.data.SaleToPOIResponse)
  return response.data
  //return response.data.SaleToPOIResponse.PaymentResponse
}


  
const shopperInfo = asyncHandler(async (req, res) => {
    const { totalPrice, serviceId, terminalSerial } = req.body
    try {
        const terminalResponse = await makePaymentCloud()
        const string = terminalResponse?.SaleToPOIResponse?.PaymentResponse?.Response?.AdditionalResponse?.toString()
        console.log(terminalResponse.SaleToPOIResponse.PaymentResponse.Response.AdditionalResponse.toString())
        const newString = queryStringToJSON(string)
        const rdr = newString['recurring.recurringDetailReference']
        console.log(rdr)
        const profile = await getShopperProfile(rdr)
        console.log('profile go', profile)
        res.status(200).json(profile)
    } catch (err) {
      console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
      res.status(err.statusCode).json(err.message);
    }
  });


router.get('/', shopperInfo)

export default router
