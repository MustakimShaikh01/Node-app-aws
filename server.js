const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const DATA_FILE = 'data.json';

app.use(express.json());

// Helper functions
const readData = () => {
  try {
    const jsonData = fs.readFileSync(DATA_FILE);
    return JSON.parse(jsonData);
  } catch (err) {
    return [];
  }
};

const writeData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Default homepage route
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Welcome to the Node.js CRUD API</h1>
    <p>Use the following endpoints:</p>
    <ul>
      <li><a href="/users">GET /users</a> - List all users</li>
      <li><a href="/users/1">GET /users/:id</a> - Get user by ID</li>
    </ul>
    <p>Use Postman or curl for:</p>
    <ul>
      <li>POST /users - Add user</li>
      <li>PUT /users/:id - Update user</li>
      <li>DELETE /users/:id - Delete user</li>
    </ul>
  `);
});

// GET all users
app.get('/users', (req, res) => {
  const users = readData();
  res.json(users);
});

// GET user by ID
app.get('/users/:id', (req, res) => {
  const users = readData();
  const user = users.find(u => u.id == req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
});

// POST new user
app.post('/users', (req, res) => {
  const users = readData();
  const newUser = {
    id: users.length ? users[users.length - 1].id + 1 : 1,
    ...req.body
  };
  users.push(newUser);
  writeData(users);
  res.status(201).json(newUser);
});

// PUT update user
app.put('/users/:id', (req, res) => {
  const users = readData();
  const index = users.findIndex(u => u.id == req.params.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...req.body };
    writeData(users);
    res.json(users[index]);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const users = readData();
  const filtered = users.filter(u => u.id != req.params.id);
  if (filtered.length !== users.length) {
    writeData(filtered);
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
