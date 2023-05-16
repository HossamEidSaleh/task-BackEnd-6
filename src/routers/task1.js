const express =require('express')
const Task1 = require('../models/task1')
const auth = require('../middleware/auth')
const router = express.Router()




router.post('/tasks', auth,async(req , res)=>{
    try{
        const task = new Task1({...req.body , owner:req.user._id})
        await task.save()
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e.message)
    }
})

router.get('/tasks', auth,async(req , res)=>{
    try{
        const tasks = await Task1.find({})
        
        res.status(200).send(tasks)
    }catch(e){
        res.status(00).send(e.message)
    }
})


router.get('/tasks/:id', auth,async(req , res)=>{
    try{
        // const task = await Task1.findById(req.params.id)
        const id = req.params.id
        const task = await Task1.findOne({_id:id , owner: req.user})
        if(!task){
            return res.status(404).send('unable to find task')
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e.message)
    }
})


router.patch('/tasks/:id', auth,async(req , res)=>{
    try{
        const _id = req.params.id
        const task = await Task1.findByIdAndUpdate({_id},req.body,{
            new:true,
            runValidators:true
        })
        if(!task){
            return res.status(404).send('no task')
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e.message)
    }
})


router.delete('/tasks/:id', auth,async(req , res)=>{
    try{
        
        const task = await Task1.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send('no task is found')
        }
        res.status(200).send(task)
    }catch(e){
        res.status(500).send(e.message)
    }
})
module.exports = router