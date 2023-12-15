const express = require('express')
const db = require("better-sqlite3")("database.db", { verbose: console.log })
const session = require('express-session')
const bcrypt = require('bcrypt')

const app = express()

const isAdmin = false

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: "keep it secret",
    resave: false,
    saveUninitialized: false
}))

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html")
})

app.get("/createUser", (req, res) => {
    res.sendFile(__dirname + "/public/createUser.html")
})

app.post("/login", (req, res) => {
    const selectStmt = db.prepare("SELECT * FROM users WHERE username = ?")
    const user = selectStmt.get(req.body.username)
    if (user && bcrypt.compareSync(req.body.password, user.password_hash)) {
        req.session.user = user
        req.session.logedIn = true
        res.redirect("/")
    } else {
        res.send("Wrong username or password")
    }
})

app.post("/createUser", (req, res) => {
    const countStmt = db.prepare("SELECT COUNT(*) AS count FROM users")
    const result = countStmt.get()
    const userCount = result.count
    const insertStmt = db.prepare("INSERT INTO users (first_name, last_name, email, phone, username, password_hash, role, company_id, platoon_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    const hash = bcrypt.hashSync(req.body.password, 10)
    if (userCount === 0) { // First user created becomes admin
        insertStmt.run(req.body.first_name, req.body.last_name, req.body.email, req.body.phone, req.body.username, hash, "Admin", req.body.company, req.body.platoon)
    } else { // All other users become members
        insertStmt.run(req.body.first_name, req.body.last_name, req.body.email, req.body.phone, req.body.username, hash, "Medlem", req.body.company, req.body.platoon)
    }
    res.redirect("/login")
})

app.use((req, res, next) => { // Middleware to check if user is logged in
    if (req.session.logedIn === true) {
        console.log("user logged in")
        next()
    } else {
        res.redirect("/login")
    }
})

app.get("/", (req, res) => {
    if (req.session.user.role === "Admin") {
        const isAdmin = true    
        res.sendFile(__dirname + "/public/admin.html")
    } else if (req.session.user.role === "Leder") {
        res.sendFile(__dirname + "/public/leder.html")
    } else {
        res.sendFile(__dirname + "/public/medlem.html")
    }
})

app.get("/admin", (req, res) => {
    if (isAdmin === true) {
        res.sendFile(__dirname + "/public/admin.html")
    } else {
        res.redirect("/")
    }
})

app.get("/users", (req, res) => {
    const selectStmt = db.prepare("SELECT * FROM users INNER JOIN platoons ON users.platoon_id = platoons.platoons_id INNER JOIN companies ON users.company_id = companies.companies_id");
    const users = selectStmt.all();
    res.json(users);
});

app.post("/updateUser", (req, res) => {
    if (req.body.password === "") {
        const updateStmt = db.prepare("UPDATE users SET role = ?, first_name = ?, last_name = ?, phone = ?, email = ?, username = ?, platoon_id = ?, company_id = ? WHERE username = ?")
        updateStmt.run(req.body.role, req.body.first_name, req.body.last_name, req.body.phone, req.body.email, req.body.new_username, req.body.platoon, req.body.company, req.body.username)
        console.log("role, first_name, last_name, phone, email, username, platoon_id, and company_id updated")
        res.redirect("/admin")
    } else {
        const updateStmt = db.prepare("UPDATE users SET role = ?, first_name = ?, last_name = ?, phone = ?, email = ?, password_hash = ?, username = ?, platoon_id = ?, company_id = ? WHERE username = ?")
        const hash = bcrypt.hashSync(req.body.password, 10)
        updateStmt.run(req.body.role, req.body.first_name, req.body.last_name, req.body.phone, req.body.email, hash, req.body.new_username, req.body.platoon, req.body.company, req.body.username)
        console.log("password, role, first_name, last_name, phone, email, username, platoon_id, and company_id updated")
        res.redirect("/admin")
    }
});

app.delete("/deleteUser/:id", (req, res) => {
    let id = req.params.id
    const deleteStmt = db.prepare("DELETE FROM users WHERE id = ?")
    deleteStmt.run(id)
    res.send("FANTASTISK")
})

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/")
        }
    })
})




app.listen(3000, () => {
    console.log('Server started at port http://localhost:3000')
})