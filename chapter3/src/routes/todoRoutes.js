import express from 'express'
import prisma from '../prismaClient.js';

const todoRoutes = express.Router();

todoRoutes.get('/', async (req,res) => { // req comes from the middleware
    const todos = await prisma.todo.findMany({
        where:{
            userId: req.userId
        }
    })
    res.json(todos);
})

todoRoutes.post('/', async (req,res) => {
    const {task} = req.body;

    const todo = await prisma.todo.create({
        data:{
            task: task,
            userId: req.userId
        }
    })

    res.json(todo); 
})

todoRoutes.put('/:id' ,async (req,res) => {
    const {completed} = req.body;
    const {id} = req.params;
    
    const todo = await prisma.todo.findUnique({
        where:{
            id: parseInt(id),
        }
    })
    if(!todo){
        return res.status(404).send({message: "Todo not found!!"});
    }

    const updateTodo = await prisma.todo.update({
        where:{
            id: parseInt(id),
        },
        data:{
            completed: !!completed
        }
    })

    res.json(({message: "Todo Updated"}));
})

todoRoutes.delete('/:id', async (req,res) => {
    const {id} = req.params;

    const todo = await prisma.todo.findUnique({
        where:{
            id: parseInt(id),
        }
    })
    if(!todo){
        return res.status(404).send({message: "Todo not found!!"});
    }

    const deleteTodo = await prisma.todo.delete({
        where:{
            id: parseInt(id),
        }
    })

    res.json("Todo Deleted");
})

export default todoRoutes;