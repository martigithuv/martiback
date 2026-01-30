import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Conectamos a la base de datos 'ecommerce'
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(() => console.log("✅ Conectado a MongoDB (ecommerce)"))
  .catch(err => console.error("❌ Error:", err));

const app = express();
app.use(cors());
app.use(express.json());

// Definimos el esquema (qué datos tiene una bota)
const ProductSchema = new mongoose.Schema({
    nom: String,
    preu: Number,
    imatge: String,
    fecha: { type: Date, default: Date.now }
});

// --- EL CAMBIO ESTÁ AQUÍ ---
// El tercer parámetro 'cistella' obliga a Mongoose a crear/usar esa colección exacta
const Cistella = mongoose.model("Cistella", ProductSchema, "cistella");

app.post("/cart", async (req, res) => {
    console.log("Recibido para guardar en la cistella de MongoDB:", req.body);
    try {
        const nuevoProducto = new Cistella(req.body);
        await nuevoProducto.save();
        
        res.status(201).json({ message: "Añadido a la colección cistella" });
    } catch (err) {
        console.error("Error al guardar:", err);
        res.status(500).json({ message: "Error interno" });
    }
});

app.listen(3000, "0.0.0.0", () => {
    console.log("🚀 Servidor corriendo en http://127.0.0.1:3000");
});