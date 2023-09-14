import express from 'express';
import ProductManager from './ProductManager.mjs';

const app = express();
const productManager = new ProductManager();

app.use(express.json());

// Obtener todos los productos
app.get('/products', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = productManager.getProducts();

        if (limit) {
            res.json(products.slice(0, parseInt(limit)));
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: 'Error técnico' });
    }
});

// Obtener un producto por ID
app.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const productId = parseInt(pid);
        const product = productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'El producto no existe' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error técnico' });
    }
});

const port = 8080;
app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});