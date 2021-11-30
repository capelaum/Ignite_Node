const express = require('express');
const { randomUUID } = require('crypto');

const app = express();
app.use(express.json());

const customers = [];

/**
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */
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



app.listen(3333);
