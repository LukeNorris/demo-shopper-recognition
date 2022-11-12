import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import morgan from 'morgan'
import cors from 'cors'
import connectDB from './config/db.js'
import colors from 'colors'
import { notFound, errorHandler } from './middleware/middleware.js'
import webhook from './routes/webhook.js'
import getTotal from './routes/getTotal.js'
import shopperInfo from './routes/shopperInfo.js'


dotenv.config()
connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use(cors());
app.use(express.json())

app.use('/api/new-purchase', webhook)
app.use('/api/current-total', getTotal)
app.use('/api/shopper-info', shopperInfo)

app.use(express.static('public'));

const __dirname = path.resolve()

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});
app.get('/shopperinfo-terminal2', function(req, res) {
  res.sendFile(path.join(__dirname, '/shopperinfo-terminal2.html'));
});
app.get('/shopperinfo-terminal1', function(req, res) {
  res.sendFile(path.join(__dirname, '/shopperinfo-terminal1.html'));
});


app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8080

app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)