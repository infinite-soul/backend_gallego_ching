import express from 'express';
import productRouter from './ProductRouter.mjs'; 
import cartRouter from './CartRouter.mjs';

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});