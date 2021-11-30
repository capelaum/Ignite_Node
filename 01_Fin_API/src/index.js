const express = require('express');
const { randomUUID } = require('crypto');

const app = express();
app.use(express.json());

const customers = [];

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + operation.amount;
    }

    return acc - operation.amount;
  }, 0)

  return balance;
}

// Middleware
function verifyIfAccountExists(req, res, next) {
  const { cpf } = req.headers;
  const customer = customers.find(c => c.cpf === cpf);

  if (!customer) {
    return res.status(404).json({ error: 'Account not found' });
  }

  req.customer = customer;

  return next();
}

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;
  const customerAlreadyExists = customers.some(customer => customer.cpf === cpf);

  if (customerAlreadyExists) {
    return res.status(400).json({ error: "Customer already exists" });
  }

  customers.push({
    cpf,
    name,
    uid: randomUUID(),
    statement: []
  });

  return res.status(201).send();
})

// app.use(verifyIfAccountExists)

app.get("/statement", verifyIfAccountExists, (req, res) => {
  const { customer } = req;

  return res.json(customer.statement);
})

app.post("/deposit", verifyIfAccountExists, (req, res) => {
  const { description, amount } = req.body;
  const { customer } = req;

  customer.statement.push({
    description,
    amount,
    type: "credit",
    created_at: new Date()
  });

  return res.status(201).send();
})

app.post("/withdraw", verifyIfAccountExists, (req, res) => {
  const { amount } = req.body;
  const { customer } = req;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return res.status(400).json({ error: "Insufficient funds" });
  }

  customer.statement.push({
    amount,
    type: "debit",
    created_at: new Date()
  });

  return res.status(201).send();
})

app.listen(3333);
