const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const users = [];

app.use(express.json());

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", async (req, res) => {
  try {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.name === req.body.name);
  if (user == null) {
    return res.status(400).send("Non trouvé");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      return res.send("success");
    } else res.send("not allowed");
  } catch {
    res.status(500).send();
  }
});

app.listen(3000);
