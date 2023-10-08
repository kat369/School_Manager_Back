
import express from "express";
import { MongoClient } from "mongodb";
import adminRouter from "./routes/login.js"
import * as dotenv from 'dotenv';
import cors from "cors";
dotenv.config()

const app = express();
app.use(cors())
const PORT =process.env.PORT

   
const client=new MongoClient(process.env.MONGO_URL) 

 await client.connect(); 
 console.log("Mongodb is connected");


 app.use(express.json());

app.get("/", function (request, response) {
  response.send("welcome to Task Management app backend");
});

app.use('/',adminRouter);


app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));


export {client};












