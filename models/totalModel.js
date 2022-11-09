import mongoose from 'mongoose'


const totalSchema = mongoose.Schema(
  {
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Total = mongoose.model('total', totalSchema)

export default Total