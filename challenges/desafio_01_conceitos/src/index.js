const express = require('express');
const cors = require('cors');

const { randomUUID } = require('crypto');
const req = require('express/lib/request');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checkTodoExists(request, response, next) {
  const { id } = request.params;
  const { todos } = request.user;

  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex < 0) {
    return response.status(404).json({ error: 'Todo not found' });
  }

  request.todoIndex = todoIndex;
  return next();
}

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(404).json({ error: 'User not found' });
  }

  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.find((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'username already exists' });
  }

  const newUser = {
    name,
    username,
    todos: [],
    id: randomUUID(),
  }

  users.push(newUser)

  response.status(201).send(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const newTodo = {
    id: randomUUID(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(newTodo)

  return response.status(201).send(newTodo);
});

app.put('/todos/:id', checksExistsUserAccount, checkTodoExists, (request, response) => {
  const { user, todoIndex } = request;
  const { title, deadline } = request.body;

  const todo = user.todos[todoIndex];
  user.todos[todoIndex] = { ...todo, title, deadline: new Date(deadline) };

  return response.json(user.todos[todoIndex]);
});

app.patch('/todos/:id/done', checksExistsUserAccount, checkTodoExists, (request, response) => {
  const { user, todoIndex } = request;

  const todo = user.todos[todoIndex];
  user.todos[todoIndex] = { ...todo, done: !todo.done };

  return response.json(user.todos[todoIndex]);
});

app.delete('/todos/:id', checksExistsUserAccount, checkTodoExists, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  user.todos = user.todos.filter(todo => todo.id !== id);

  return response.status(204).send();
});

module.exports = app;