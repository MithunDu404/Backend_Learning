import express from 'express'
import db from '../db.js'

const todoRoutes = express.Router();

todoRoutes.get('/', (req,res) => { // req comes from the middleware
    const getTodos = db.prepare(`Select * from todos where user_id = ?`);
    // console.log(req.userId);
    const todos = getTodos.all(req.userId);
    res.json(todos);
})

todoRoutes.post('/', (req,res) => {
    const {task} = req.body;
    const insertTodo = db.prepare(`insert into todos (user_id,task) values (?,?)`);
    const result = insertTodo.run(req.userId,task);

    res.json({id: result.lastInsertRowid,task,completed:0}); 
})

todoRoutes.put('/:id' ,(req,res) => {
    const {completed} = req.body;
    const {id} = req.params;
    
    const findTodo = db.prepare(`select * from todos where id = ? and user_id = ?`);
    const todo = findTodo.get(id,req.userId);
    if(!todo){
        return res.status(404).send({message: "Todo not found!!"});
    }

    const updateTodo = db.prepare(`update todos set completed=? where id = ?`);
    updateTodo.run(completed,id);

    res.json(({message: "Todo Updated"}));
})

todoRoutes.delete('/:id', (req,res) => {
    const {id} = req.params;

    const findTodo = db.prepare(`select * from todos where id = ? and user_id = ?`);
    const todo = findTodo.get(id,req.userId);
    if(!todo){
        return res.status(404).send({message: "Todo not found!!"});
    }

    const deleteTodo = db.prepare(`delete from todos where id = ? and user_id = ?`);
    deleteTodo.run(id,req.userId);

    res.json("Todo Deleted");
})

export default todoRoutes;