import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { client } from "../index.js";
import mongodb from "mongodb";



let authenticate = (req, res, next) => {

    if (req.headers.authorization) {
        let decode = jwt.verify(req.headers.authorization, "qwertyuip")
        if (decode) {
            next()
        } else {
            res.status(401).json({ message: "unauthorized" })
        }

    } else {
        res.status(401).json({ message: "unauthorized" })
    }


};


router.post("/login", async function (req, res) {
    
    try {
        
let user = await client.db("Task-m-tool").collection("employees").findOne({ email: req.body.email })
        if (user) {
            let compare = await bcrypt.compare(req.body.password, user.password)
            if (compare) {
               let token = await jwt.sign({ _id: user._id }, "qwertyuip", { expiresIn: "1h" })
                user.token = token
                res.json(user)
            } else{
                res.status(401).json({ message: "login failed"})
            }
        } else {
            res.status(404).json({ message: "user not found" })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});


router.post("/createuser", async function (req, res) {
    console.log(req.body)
    try {
   const user = await client.db("Task-m-tool").collection("employees").findOne({ email: req.body.email })

        if (user) {
            res.json("User Already Exists")
        } else {
            let salt = await bcrypt.genSalt(10)
            let Hash = await bcrypt.hash(req.body.password, salt)
            req.body.password = Hash
            const newUser = await client.db("Task-m-tool").collection("employees").insertOne(req.body)
            res.json("User Created Sucessfully")
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});


router.post("/createproject", async function (req, res) {
    console.log(req.body)
    try {
    
    const user = await client.db("Task-m-tool").collection("projects").insertOne(req.body);

        res.json("User Created Sucessfully")

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});

router.get("/allusers", async function (req, res) {
    console.log(req.body)
    try {
  
   
     const users = await client.db("Task-m-tool").collection("employees").find({isAdmin:false}).toArray()
       res.json(users)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});
router.post("/setcompleteproject/:id", async function (req, res) {
    console.log(req.body)
    try {
       

        const project = await client.db("Task-m-tool").collection("projects").updateOne({ _id: new mongodb.ObjectId(req.params.id) }, { $set: { status: "completed" } })

        

        res.json(project.insertedId)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});
router.post("/setdeleteproject/:id", async function (req, res) {
    console.log(req.body)
    try {
       

        const project = await client.db("Task-m-tool").collection("projects").updateOne({ _id: new mongodb.ObjectId(req.params.id) }, { $set: { status: "removed" } })

        

        res.json(project.insertedId)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});
router.post("/setdeleteuser/:id", async function (req, res) {
    console.log(req.body)
    try {
       

        const project = await client.db("Task-m-tool").collection("employees").deleteOne({ _id: new mongodb.ObjectId(req.params.id) })

        

        res.json(project.insertedId)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});
router.post("/createtask/:id", async function (req, res) {
    console.log(req.body)
    try {
       

        const user = await client.db("Task-m-tool").collection("projects").updateOne({ _id: new mongodb.ObjectId(req.params.id) }, { $push: { task: req.body } })

        

        res.json("Task Created Sucessfully")

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});


router.post("/updatetask/:id", async function (req, res) {
    console.log(req.body)
    try {
       

        const user = await client.db("Task-m-tool").collection("projects").updateOne({ _id: new mongodb.ObjectId(req.params.id), "task.task_id": req.body.task_id }, { $set: { "task.$": req.body } })

        

        res.json("Task Created Sucessfully")

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});


router.post("/deletetask/:id", async function (req, res) {
    console.log(req.params.id)
    try {
       

        const user = await client.db("Task-m-tool").collection("projects").updateOne({ _id: new mongodb.ObjectId(req.params.id) }, { $pull: { task: { task_id: req.body.task_id } } })

        

        res.json("Task Removed Sucessfully")

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});


router.get("/allusers", async function (req, res) {
    console.log(req.body)
    try {
       

        const users = await client.db("Task-m-tool").collection("employees").find({ status: "live" }).toArray()

        

        res.json(users)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});


router.get("/getproject/:id", async function (req, res) {
    console.log(req.body)
    try {
       

        const project = await client.db("Task-m-tool").collection("projects").find({ _id: new mongodb.ObjectId(req.params.id) }).toArray()

        

        res.json(project[0])

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});

router.get("/liveprojects", async function (req, res) {
    console.log(req.body)
    try {

        const users = await client.db("Task-m-tool").collection("projects").find({status:"live"}).toArray()

        res.json(users)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});

router.get("/completedprojects", async function (req, res) {
    console.log(req.body)
    try {
   
        const users = await client.db("Task-m-tool").collection("projects").find({ status: "completed" }).toArray()

        

        res.json(users)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "try again later" });
    }
});
export default router;