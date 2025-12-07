import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const authRoutes = express.Router();

authRoutes.post('/login', (req,res) => {
    const {username,password} = req.body;
    
    try{
        const getUser = db.prepare(`select * from users where username = ?`);
        const user = getUser.get(username);
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

authRoutes.post('/register', (req,res) => {
    const {username,password} = req.body;
    const encryptPass = bcrypt.hashSync(password,8);
    
    try{
        const insertUser = db.prepare(`insert into users (username,password) values (?,?)`);
        const result = insertUser.run(username,encryptPass);

        const defaultTodo = `Hello :) Add your first TODO`;
        const insertTodo = db.prepare(`insert into todos (user_id,task) values (?,?)`)
        insertTodo.run(result.lastInsertRowid,defaultTodo);

        const token = jwt.sign({id: result.lastInsertRowid},process.env.JWT_TOKEN, {expiresIn: '24h'})

        // console.log(token);
        res.json({token});

    }catch(err){
        console.log(err.message);
        res.sendStatus(503);
    }
})

export default authRoutes;