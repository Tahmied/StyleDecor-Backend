import dotenv from 'dotenv';
import { connectDb } from './Utils/ConnectDb.js';
import { app } from './app.js';

dotenv.config({
    path:'./.env'
})

connectDb()
.then(()=>{
    app.listen(process.env.PORT || 2000, ()=> {
        console.log(`server is running on http://localhost:${process.env.port||2000}`);
    })
})
.catch((err)=>{
    console.log(`db connection failed due to ${err}`);
})