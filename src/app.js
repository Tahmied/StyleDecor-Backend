import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
const app = express()

app.use(cors({origin: 'http://localhost:3000', 
  credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static('public'))

// routes
import adminRoutes from './Routes/admin.routes.js'
import bookingRoutes from './Routes/booking.routes.js'
import userRoutes from './Routes/user.routes.js'

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/booking', bookingRoutes)

export { app }
