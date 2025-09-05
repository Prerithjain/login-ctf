<?php
// --- SQLite DB setup (creates db file if not exists) ---
$dbFile = __DIR__ . "/ctf.db";
$initDb = !file_exists($dbFile);
$db = new SQLite3($dbFile);

if ($initDb) {
    $db->exec("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
    $db->exec("INSERT INTO users (username, password) VALUES ('admin', 'supersecret')");
}

// --- Handle login form ---
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $user = $_POST['username'];
    $pass = $_POST['password'];

    // ❌ VULNERABLE: SQL Injection point
    $sql = "SELECT * FROM users WHERE username='$user' AND password='$pass'";
    $result = $db->query($sql);

    if ($result && $result->fetchArray()) {
        echo "<h3>✅ Welcome! Here’s your flag: <b>flag{login_bypass_solved}</b></h3>";
    } else {
        echo "<h3>❌ Invalid credentials!</h3>";
    }
}
?>

<h2>Login</h2>
<form method="POST">
  Username: <input name="username"><br><br>
  Password: <input name="password"><br><br>
  <button type="submit">Login</button>
</form>
