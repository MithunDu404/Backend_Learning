const express = require('express');
const app = express();
const PORT = 8383;

let data = ["mithun"];

// Middleware
app.use(express.json());

// Endpoints
app.get('/',(req,res) => { 
    console.log('Hello Bro this is a get Request!!',req.method);
    res.send(`
        <body style="background-color:pink;color:red">
            <h1> Data : </h1>
            <p> ${JSON.stringify(data)} </p>
        </body>
        `);
})

app.get('/api/data',(req,res) => {
    console.log("This is a api endpoint 1!");
    res.send(data);
})

app.post('/api/data',(req,res) => {
    const newData = req.body;
    console.log(`The recieved data : `,newData);
    data.push(newData.name);
    console.log(`The data Array : `,data);
    res.sendStatus(201);
})

app.delete('/api/data',(req,res) => {
    const curr = data.at(-1);
    data.pop();
    console.log("Deleted the last data : ", curr);
    res.sendStatus(203)
})

app.get('/home',(req,res) => {   // Website endpoint
    res.send("<h1> It's the home page </h1>");
})

app.listen(PORT,() => {
    console.log(`server listening at port : ${PORT}`)
})