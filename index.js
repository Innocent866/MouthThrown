require('dotenv/config')
const express = require('express');
const app = express();
const port = process.env.PORT || 5750;
const connect = require('./DB/connectDB');
const morgan = require('morgan');
const cors = require('cors')
const fileUpload = require('express-fileupload'); 
const cloudinary = require('cloudinary').v2;
const userRouter = require('./router/userRouter');
const itemRouter = require('./router/itemRouter');
const orderRouter = require('./router/orderRouter');
const SubscriptionRouter = require('./router/SubscriptionRouter')
const path = require('path');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  });
 
// custom middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(cors())
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'tmp')
  })
);

// Api's
app.use('/api/user',userRouter);
app.use('/api/item', itemRouter);
app.use('/api/order', orderRouter);
app.use('/api/subscribe', SubscriptionRouter);

// server and DB
connect()
.then(()=>{
    try {
        app.listen(port,(req,res)=>{
            console.log(`server is connected to http://localhost:${port}`);
        }) 
    } catch (error) {
        console.log('can not connect to the server ', error);
        
    }
})
.catch((error)=>{
    console.log("invalid database connection...!" , error);
})

// routes
app.get('/',(req,res)=>{
    res.status(200).json({message:'app is running'})
})

app.use((req,res)=>{
    res.status(404).json({message:'that route doesnt exist'})
})

