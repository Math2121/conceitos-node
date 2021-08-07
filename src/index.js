const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) { next()}

app.post("/users", (request, response) => {
  const { name, username, todos } = request.body;
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos,
  };

  if (newUser.todos.length > 0) {
    response.status(400).json({ message: "A lista deve ser vazia" });
  } else {
    users.push(newUser);
    response.json(users);
  }
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
 const {username} = request.headers;

 const allTodo = users.filter((item) => item.username === username);
 response.json(allTodo[0].todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const  {username}  = request.headers;

  const todoUser = users.filter((item) => item.username === username);

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  todoUser[0].todos.push(newTodo);
  response.json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
