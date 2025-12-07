import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

const authRoutes = express.Router();

authRoutes.post('/login', async (req,res) => {
    const {username,password} = req.body;
    
    try{

        const user = await prisma.user.findUnique({
            where:{
                username: username
            }
        })
        if(!user){
            return res.status(404).send({message:"User not Found!!"});
        }

        const isValid = bcrypt.compareSync(password,user.password);
        if(!isValid){
            return res.status(401).send({message:"Wrong Password!!"});
        }

        const token = jwt.sign({id: user.id},process.env.JWT_TOKEN,{expiresIn: '24h'});

        res.json({token});

    }catch(err){
        console.log(err.message);
        res.sendStatus(503);
    }
})

authRoutes.post('/register', async (req,res) => {
    const {username,password} = req.body;
    const encryptPass = bcrypt.hashSync(password,8);
    
    try{
        const user = await prisma.user.create({
            data:{
                username: username,
                password: encryptPass
            }
        })

        const insertTodo = await prisma.todo.create({
            data:{
                task: "Hello :) I am your first TODO (Dummy)!",
                userId: user.id
            }
        })

        const token = jwt.sign({id: user.id},process.env.JWT_TOKEN, {expiresIn: '24h'})
        res.json({token});

    }catch(err){
        console.log(err.message);
        res.sendStatus(503);
    }
})

export default authRoutes;