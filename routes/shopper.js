import asyncHandler from 'express-async-handler'
import Shopper from '../models/shopperModel.js'



// const registerShopper = asyncHandler(async (shopperReference, amount ) => {
const registerShopper = asyncHandler(async (object) => {
  const { shopperReference, amount } = object

  const shopperExists = await Shopper.findOne({ shopperReference })

  if (shopperExists) {
    return "Shopper exists already"
  }

  const shopper = await Shopper.create({
    shopperReference: shopperReference,
    transactionsTotal: amount,
    numberOfPurchases:1,
  })

  if (shopper) {
    return {
      _id: shopper._id,
      shopperReference: shopper.shopperReference,
      transactionsTotal: shopper.amount,
      numberOfPurchases: shopper.numberOfPurchases,
    }
  } else {
    return'Invalid user data and user not created'
  }
})



//const updateShopper = asyncHandler(async (shopperReference, amount) => {
const updateShopper = asyncHandler(async (object) => {
  const { shopperReference, amount } = object
  const shopper = await Shopper.findOne({ shopperReference })
  if(!shopper){
    registerShopper(object)
  }
  if (shopper) {
    shopper.transactionsTotal = shopper.transactionsTotal + amount
    shopper.numberOfPurchases = shopper.numberOfPurchases + 1


    const updatedShopper = await shopper.save()

    return {
      _id: updatedShopper._id,
      name: updatedShopper.name,
      shopperReference: updatedShopper.shopperReference,
      transactionsTotal: updatedShopper.amount,
      numberOfPurchases: updatedShopper.numberOfPurchases,
    }
  } else {
    return 'Shopper not found'
  }
})



const getShopperProfile = asyncHandler(async (shopperReference) => {
  const shopper = await Shopper.findOne({ shopperReference:shopperReference })
  if (shopper) {
    return shopper
  } else {
    return 'Shopper not found'
  }
})



const getShoppers = asyncHandler(async () => {
  const shoppers = await Shopper.find({})
  return shoppers 
})



const deleteShopper = asyncHandler(async (shopperReference) => {
  const shopper = await Shopper.findOne({ shopperReference })
  if (shopper) {
    await shopper.remove()
    return { message: `user ${shopper.name} has removed from the database` }
  } else {
    return 'Shopper not found'
  }
})




export {
  getShopperProfile,
  registerShopper,
  updateShopper,
  getShoppers,
  deleteShopper,
}
