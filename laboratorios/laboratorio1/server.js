const express = require("express");
const app = express();
const port = 3000;

// renderizar el html
app.set("view engine", "ejs");

// Middleware para procesar datos de formularios
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("calculator");
});

app.post("/calculate", (req, res) => {
    const { num1, num2, operation } = req.body;
    let result;

    const a = parseFloat(num1);
    const b = parseFloat(num2);

    switch (operation) {
        case "sum":
            result = a + b;
            break;
        case "sub":
            result = a - b;
            break;
        case "mul":
            result = a * b;
            break;
        case "div":
            result = b !== 0 ? a / b : "Error (División por 0)";
            break;
        default:
            result = "Operación no válida";
    }

    res.render("calculator", { result });
});

// TABLAS MATEMATICAS
app.get("/tables", (req, res) => {
    res.render("tables", { tableData: null });
});

// GENERAR OPERACIONES
app.post("/generate-table", (req, res) => {
    const { operation, number, start, end } = req.body;
    const num = parseInt(number);
    const startNum = parseInt(start);
    const endNum = parseInt(end);
    let tableData = [];

    for (let i = startNum; i <= endNum; i++) {
        let result;
        switch (operation) {
            case "sum":
                result = num + i;
                break;
            case "sub":
                result = num - i;
                break;
            case "mul":
                result = num * i;
                break;
            case "div":
                result = i !== 0 ? num / i : "Error";
                break;
            default:
                result = "Inválido";
        }
        tableData.push({ num, op: operation, i, result });
    }

    res.render("tables", { tableData });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

const mysql = require("mysql2");

// Conexión MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",  
    password: "",  
    database: "bd_agenda"
});

db.connect((err) => {
    if (err) {
        console.error("Error conectando a MySQL:", err);
        return;
    }
    console.log("Conectado a MySQL");
});


app.get("/agenda", (req, res) => {
    db.query("SELECT * FROM agenda", (err, results) => {
        if (err) throw err;
        res.render("agenda", { contacts: results });
    });
});

app.post("/add", (req, res) => {
    const { nombres, apellidos, direccion, telefono } = req.body;
    const sql = "INSERT INTO agenda (nombres, apellidos, direccion, telefono) VALUES (?, ?, ?, ?)";
    db.query(sql, [nombres, apellidos, direccion, telefono], (err) => {
        if (err) throw err;
        res.redirect("/agenda");
    });
});

app.get("/delete/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM agenda WHERE id = ?", [id], (err) => {
        if (err) throw err;
        res.redirect("/agenda");
    });
});
 //EDITAR
 app.get("/edit/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM agenda WHERE id = ?", [id], (err, result) => {
        if (err) throw err;
        res.render("edit", { contact: result[0] });
    });
});

// ACTUALIZAR
app.post("/update/:id", (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, direccion, telefono } = req.body;
    const sql = "UPDATE agenda SET nombres = ?, apellidos = ?, direccion = ?, telefono = ? WHERE id = ?";
    db.query(sql, [nombres, apellidos, direccion, telefono, id], (err) => {
        if (err) throw err;
        res.redirect("/agenda");
    });
});
