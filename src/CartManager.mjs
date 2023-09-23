import fs from 'fs/promises';
class CartManager {
    constructor() {
        this.path = 'carts.json';
        this.carts = null;
        this.initialize();
    }

    async initialize() {
        const fileExists = await this.checkFileExists();
        if (fileExists) {
            await this.loadCarts();
        } else {
            await this.createEmptyFile();
        }
    }

    async checkFileExists() {
        try {
            await fs.access(this.path);
            return true;
        } catch (error) {
            return false;
        }
    }

    async createEmptyFile() {
        try {
            await fs.writeFile(this.path, '[]', 'utf-8');
            this.carts = [];
        } catch (error) {
            console.log('Error al crear el archivo de carritos:', error.message);
        }
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.carts = JSON.parse(data);
        } catch (error) {
            console.log('Error al cargar los carritos:', error.message);
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf-8');
        } catch (error) {
            console.log('Error al guardar los carritos:', error.message);
        }
    }

    async createCart() {
        const newCart = {
            id: this.carts.length + 1,
            products: []
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(cartId) {
        const cart = this.carts.find(c => c.id === parseInt(cartId));
        return cart ? cart : null;
    }
    
      
async updateCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    if (cart) {
        const existingProduct = cart.products.find(p => p.id === productId);
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            const newProduct = {
                id: productId,
                quantity: 1
            };
            cart.products.push(newProduct);
        }
        await this.saveCarts();
        return cart;
    }
    return null;
}

async deleteCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    if (cart) {
        const productIndex = cart.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            const product = cart.products[productIndex];
            if (product.quantity > 1) {
                product.quantity--;
            } else {
                cart.products.splice(productIndex, 1);
            }
            await this.saveCarts();
            return cart;
        }
    }
    return null;
}

    async getAllCarts() {
        return this.carts;
    }
}

export default CartManager;
