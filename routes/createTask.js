const express=require('express')
const router=express.Router();
const { validate, TASK} = require("../models/createTask");

router.post("/create",async(req,res)=>{

    try {
        const payload = req.body;

        const newTASK = new TASK(payload);
        let userS = await newTASK.save();
        res.status(201).send({ message: "data created successfully" });
     }catch(error){
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
});

router.get("/alltasks",async(req,res)=>{
    try {
        TASK.find().then((data) => {
          res.status(200).send(data);
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error", error });
      }

})
router.put('/update/:taskID', (req, res) => {
    try{
        TASK.findByIdAndUpdate({_id: req.params.taskID}, {$set: req.body}, (err, data) =>{
            if(err){
                return res.status(400).send({message: 'Error while updating an existing TASK. Please check the data'})
            }

            res.status(201).send({TASKid:data._id, message: "TASK details have been updated."})
        })

    }catch(error){
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
});


router.delete("/delete/:taskID",async(req,res)=>{
    try{
TASK.deleteOne({_id:req.params.taskID},(err,data)=>{
    if(err){
        res.status(400).send({message:"error while deleting data"})
    }
    res.status(200).send({message:`deleted id ${req.params.taskID} successfully`})
})
    }
    catch(error){
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });  
    }
})

router.get('/:taskID', (req, res) => {
    try{
        TASK.findOne({_id: req.params.taskID}, (err, data) => {
            if(err){
                return res.status(400).send({message: 'Error while retrieving an TASK. Please check the data'})
            }

            res.status(200).send(data);
        })
    }catch(error){
        res.status(500).send({
            message: 'Internal Server Error'
        })
    }
});


module.exports=router;