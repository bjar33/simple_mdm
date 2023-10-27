const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(bodyParser.json());
app.use(express.static('public'));

// **New Code: Start Session Management**
app.use(express.session({ secret: 'some-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// **End of New Code**

db.serialize(() => {
    db.run("CREATE TABLE devices (id TEXT PRIMARY KEY, name TEXT, model TEXT)");
    // **New Code: User Model**
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
    // **End of New Code**
});

// **New Code: Passport Strategies and User Routes**
passport.use(new LocalStrategy(
    function(username, password, done) {
        db.get("SELECT * FROM users WHERE username = ?", username, (err, user) => {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false); }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db.get("SELECT * FROM users WHERE id = ?", id, (err, user) => {
        done(err, user);
    });
});

app.post('/register-user', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
    stmt.run(username, hashedPassword, (err) => {
        if (err) return res.status(500).send("There was a problem registering the user.");
        res.status(200).send("User registered successfully!");
    });
});
if (!id || !name || !model) {
    return res.status(400).send('All fields (id, name, model) are required.');
}

app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});
// **End of New Code**

app.get('/', (req, res) => {
    res.send('MDM Server is running');
});

// ... Your other routes ...

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});





