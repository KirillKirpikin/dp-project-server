require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const fileUpload = require('express-fileupload');
const cors = require('cors');
const router = require('./routes/index');
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

const start = async ()=>{
    try {
        await mongoose.connect(process.env.DB_URL)
        .then(()=>console.log('connect to MongoDB')) 
        app.listen(PORT, ()=>console.log(`Server started on port ${PORT}`))       
    } catch (e) {
        console.log(e);        
    }
}

start();



// case 'Від А до Я':
//     project = await ProjectModel.find({ title: { $regex: searchQuery, $options: 'i' } }).sort({ title: 1 });
//     break;
// case 'Від Я до А':
//     project = await ProjectModel.find({ title: { $regex: searchQuery, $options: 'i' } }).sort({ title: -1 });
//     break;
// case 'Більш раніші':
//     project = await ProjectModel.find({ title: { $regex: searchQuery, $options: 'i' } }).sort({ createdAt: -1 });
//     break;
// case 'Більш пізні':
//     project = await ProjectModel.find({ title: { $regex: searchQuery, $options: 'i' } }).sort({ createdAt: 1 });
//     break