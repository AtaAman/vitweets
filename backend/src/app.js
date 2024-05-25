import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

const corsOptions = {
    origin: 'http://localhost:5173', // Specify the allowed origin
    credentials: true, // Allow credentials if needed
    optionsSuccessStatus: 204 // For legacy browser support
  };
  
app.use(cors(corsOptions));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'

//routes declaration
app.use("/api/v1/users", userRouter)


// http://localhost:8000/api/v1/users/register

export { app }