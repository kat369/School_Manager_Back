const express=require('express')
const router=express.Router();
const { validate, User} = require("../models/register");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));

    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = await new User({
      ...req.body,
      password: hashPassword,
    }).save();
    res.status(201).send({ message: "user created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/alladmin", async (req, res) => {
  try {
    User.find().then((data) => {
      res.status(200).send(data);
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/:ID", (req, res) => {
  try {
    User.findOne({ email: req.params.ID }).then((err, data) => {
      if (err) {
        return res
          .status(400)
          .send({
            message:
              "Error while retrieving an employee. Please check the data",
          });
      }

      res.status(200).send(data);
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.get("/up/:pID", (req, res) => {
  try {
    User.findOne({ _id: req.params.pID }).then((err, data) => {
      if (err) {
        return res
          .status(400)
          .send({
            message:
              "Error while retrieving an employee. Please check the data",
          });
      }

      res.status(200).send(data);
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

module.exports=router;