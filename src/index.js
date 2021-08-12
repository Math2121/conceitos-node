const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const IfUserExists = users.find((user) => user.username === username);

  if (!IfUserExists) {
    response.status(404).json({ message: "User not found!" });
  }
  request.user = IfUserExists;
  next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;
  const IfUserExists = users.find((user) => user.username === username);

  if (IfUserExists) {
    response.status(400).json({ error: "User not found!" });
  }
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };
  users.push(newUser);
  response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const allTodo = users.filter((item) => item.username === username);
  response.json(allTodo[0].todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const { username } = request.headers;

  const todoUser = users.filter((item) => item.username === username);

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  todoUser[0].todos.push(newTodo);
  response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;
  const { user } = request;
  const todo = user.todos.find((item) => item.id === id);
  if (!todo) {
    return response.status(404).json({ error: "Todo not found" });
  }
  todo.title = title;
  todo.deadline = new Date(deadline);
  response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;
  const todoDone = user.todos.find((item) => item.id === id);
  if (!todoDone) {
    return response.status(404).json({ error: "Todo not found" });
  }
  todoDone.done = true;
  return response.json( todoDone );
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { user } = request;
  const todoDone = user.todos.find((item) => item.id === id);
  const number = user.todos.indexOf(todoDone);
  if (number === -1) {
    return response.status(404).json({ error: "Todo not found" });
  }
  user.todos.splice(number, 1);
  return response.status(204).send();
});

module.exports = app;
