import mongoose from 'mongoose'

const shopperSchema = mongoose.Schema(
  {
    shopperReference: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    transactionsTotal:{
        type: Number,
        required: true,
    },
    numberOfPurchases:{
        type: Number,
        required: true,
    },
    store: {
      type: String,
      required: false,
    },

  },
  {
    timestamps: true,
  }, 
  { 
    strict: false 
  }
)

const Shopper = mongoose.model('Shopper', shopperSchema)

export default Shopper