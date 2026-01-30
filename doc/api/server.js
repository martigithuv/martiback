import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Conectar a MongoDB
mongoose.connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB conectado"))
  .catch(err => console.error(err));

const app = express();
app.use(cors());
app.use(express.json()); // Para leer JSON del body

// Modelo de Producto
const ProductSchema = new mongoose.Schema({
    nom: String,
    preu: Number,
    imatge: String
});
const Product = mongoose.model("Product", ProductSchema);

// Ruta POST para añadir producto al carrito
app.post("/cart", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ message: "Producto añadido correctamente" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al añadir el producto" });
    }
});

// Ruta GET opcional para ver todos los productos en la cistella
app.get("/cart", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

app.listen(3000, () => {
    console.log("Servidor backend corriendo en http://localhost:3000");
});
