const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


const db = new sqlite3.Database("./newsletter.db", (err) => {
    if (err) console.error(err.message);
    console.log("Banco conectado.");
});


db.run(`CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL
)`);


app.post("/subscribe", (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "E-mail é obrigatório" });

    db.get("SELECT * FROM subscribers WHERE email = ?", [email], (err, row) => {
        if (row) {
            return res.status(409).json({ message: "E-mail já cadastrado." });
        }

        db.run("INSERT INTO subscribers (email) VALUES (?)", [email], (err) => {
            if (err) return res.status(500).json({ message: "Erro ao cadastrar." });
            return res.status(201).json({ message: "Inscrição realizada com sucesso!" });
        });
    });
});


app.delete("/unsubscribe", (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "E-mail é obrigatório" });

    db.run("DELETE FROM subscribers WHERE email = ?", [email], function (err) {
        if (err) return res.status(500).json({ message: "Erro ao remover." });
        if (this.changes === 0) return res.status(404).json({ message: "E-mail não encontrado." });

        return res.status(200).json({ message: "Descadastrado com sucesso!" });
    });
});


const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
