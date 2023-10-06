const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const Joi = require("joi");
const userSchema=new mongoose.Schema({
    tittle:{
    type:String,
    require:true,
},
description:{
    type:String,
    require:true,
},
deadline:{
    type:String,
    require:true,
},
assigned:{
    type:String,
    require:true,
},
Priority:{
    type:String,
    require:true,
}
})
const validate = (task) => {
	const schema = Joi.object({
		tittle: Joi.string().required().label("tittle"),
        description: Joi.string().required().label("description"),
        deadline: Joi.string().required().label("deadline"),
        assigned: Joi.string().required().label("assigned"),
        Priority: Joi.string().required().label("Priority"),
	
	});
	return schema.validate(task);
};
const TASK=mongoose.model('task',userSchema);

module.exports = {TASK, validate };