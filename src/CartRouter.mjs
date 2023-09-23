import express from 'express';
import CartManager from './CartManager.mjs';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.send({ status: 'success', payload: carts });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).send({ status: 'success', payload: newCart });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.id);
        if (cart) {
            res.send({ status: 'success', payload: cart });
        } else {
            res.status(404).send({ status: 'error', error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.put('/:id/product/:productId', async (req, res) => {
    try {
        const updatedCart = await cartManager.updateCart(parseInt(req.params.id), parseInt(req.params.productId));
        if (updatedCart) {
            res.send({ status: 'success', payload: updatedCart });
        } else {
            res.status(404).send({ status: 'error', error: 'Carrito no encontrado o producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.delete('/:id/product/:productId', async (req, res) => {
    try {
        const updatedCart = await cartManager.deleteCart(parseInt(req.params.id), parseInt(req.params.productId));
        if (updatedCart) {
            res.send({ status: 'success', payload: updatedCart });
        } else {
            res.status(404).send({ status: 'error', error: 'Carrito no encontrado o producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: 'error', error: 'Error interno del servidor' });
    }
});

export default router;
