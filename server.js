const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const db = new sqlite3.Database("./ctf.db");
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
  db.run("INSERT OR IGNORE INTO users (id, username, password) VALUES (1, 'admin', 'supersecret')");
});

// Home page (login form)
app.get("/", (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login">
      Username: <input name="username"><br><br>
      Password: <input name="password"><br><br>
      <button type="submit">Login</button>
    </form>
  `);
});

// ❌ Vulnerable login (SQLi prone)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  db.get(query, (err, row) => {
    if (err) {
      return res.send("Error: " + err.message);
    }
    if (row) {
      return res.send(`<h2>✅ Welcome! Flag: <b>flag{node_sqli_success}</b></h2>`);
    } else {
      return res.send("<h2>❌ Invalid credentials</h2>");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
