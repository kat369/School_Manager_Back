const express=require('express')
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const {User} = require("../models/register");


router.post("/api/login", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();
    res.status(200).send({data:token, message: "logged in successfully" });
   
    // console.log(token);
  } catch (error) {
    res.status(500).send({ message: "internal server" });
    console.log(error);
  }
});
 
const validate = (User) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("email"),
    password: passwordComplexity().required().label("password"),
  });
  return schema.validate(User);
};
module.exports=router;
