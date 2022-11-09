import asyncHandler from 'express-async-handler'
import Shopper from '../models/shopperModel.js'



const registerShopper = asyncHandler(async (rdr, amount ) => {
  const shopperExists = await Shopper.findOne({ rdr })

  if (shopperExists) {
    return "Shopper exists already"
  }

  const shopper = await Shopper.create({
    rdr: rdr,
    transactionsTotal: amount,
    numberOfPurchases:1
  })

  if (shopper) {
    return {
      _id: shopper._id,
      rdr: shopper.rdr,
      transactionsTotal: shopper.amount,
      numberOfPurchases: shopper.numberOfPurchases
    }
  } else {
    return'Invalid user data and user not created'
  }
})



const updateShopper = asyncHandler(async (rdr, amount) => {
  const shopper = await Shopper.findOne({ rdr })
  if(!shopper){
    registerShopper(rdr, amount)
  }
  if (shopper) {
    shopper.transactionsTotal = shopper.transactionsTotal + amount
    shopper.numberOfPurchases = shopper.numberOfPurchases + 1

    const updatedShopper = await shopper.save()

    return {
      _id: updatedShopper._id,
      name: updatedShopper.name,
      rdr: updatedShopper.rdr,
      transactionsTotal: updatedShopper.amount,
      numberOfPurchases: updatedShopper.numberOfPurchases
    }
  } else {
    return 'Shopper not found'
  }
})



const getShopperProfile = asyncHandler(async (rdr) => {
  const shopper = await Shopper.findOne({ rdr })
  if (shopper) {
    console.log( {
      _id: shopper._id,
      rdr: shopper.rdr,
      transactionsTotal: shopper.amount,
      numberOfPurchases: shopper.numberOfPurchases
    })
  } else {
    return 'Shopper not found'
  }
})



const getShoppers = asyncHandler(async () => {
  const shoppers = await Shopper.find({})
  return shoppers 
})



const deleteShopper = asyncHandler(async (rdr) => {
  const shopper = await Shopper.findOne({ rdr })
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
