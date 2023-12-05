import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "../index.js";
import mongodb from "mongodb";

router.post("/login", async function (req, res) {
  try {
    let user = await client
      .db("school-m-tool")
      .collection("employees")
      .findOne({ email: req.body.email });
    if (user) {
      let compare = await bcrypt.compare(req.body.password, user.password);
      if (compare) {
        let token = await jwt.sign({ _id: user._id }, "qwertyuip", {
          expiresIn: "1h",
        });
        user.token = token;
        res.json(user);
      } else {
        res.status(401).json({ message: "login failed" });
      }
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "try again later" });
  }
});

router.post("/createteacher", async function (req, res) {
  console.log(req.body);
  try {
    const user = await client
      .db("school-m-tool")
      .collection("teacher")
      .findOne({ email: req.body.email });

    if (user) {
      res.json("User Already Exists");
    } else {
      let salt = await bcrypt.genSalt(10);
      let Hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = Hash;
      const newUser = await client
        .db("school-m-tool")
        .collection("teacher")
        .insertOne(req.body);
      res.json("User Created Sucessfully");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "try again later" });
  }
});

router.post("/createstudent", async function (req, res) {
  console.log(req.body);
  try {
    const user = await client
      .db("school-m-tool")
      .collection("students")
      .insertOne(req.body);

    res.json("User Created Sucessfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "try again later" });
  }
});

router.get("/allstudents", async function (req, res) {
  console.log(req.body);
  try {
    const users = await client
      .db("school-m-tool")
      .collection("students")
      .find({ isAdmin: false })
      .toArray();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "try again later" });
  }
});
router.post("/updatestudent/:id", async function (req, res) {
  console.log(req.body);
  try {
    const project = await client
      .db("school-m-tool")
      .collection("students")
      .updateOne(
        { _id: new mongodb.ObjectId(req.params.id) },
        { $set: req.body }
      );

    res.json(project.insertedId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "try again later" });
  }
});

router.post("/deletestudent/:id", async function (req, res) {
  console.log(req.body);
  try {
    const project = await client
      .db("school-m-tool")
      .collection("students")
      .deleteOne({ _id: new mongodb.ObjectId(req.params.id) });

    res.json(project.insertedId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "try again later" });
  }
});

router.get("/getstudent/:id", async function (req, res) {
  console.log(req.params.id);
  try {
    const project = await client
      .db("school-m-tool")
      .collection("students")
      .find({ _id: new mongodb.ObjectId(req.params.id) })
      .toArray();

    res.json(project[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "try again later" });
  }
});

export default router;
