const fs = require('fs').promises;

const productsFilePath = './products.json';

class ProductManager {
    constructor() {
        this.products = [];
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(productsFilePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (err) {
            throw new Error('Error loading products: ' + err.message);
        }
    }

    async addProduct(title, description, price, thumbnail) {
        const newProduct = {
            title,
            description,
            price,
            thumbnail
        };

        try {
            await this.loadProducts();
            newProduct.id = this.products.length + 1;
            this.products.push(newProduct);
            await fs.writeFile(productsFilePath, JSON.stringify(this.products));
            console.log('Product added!');
        } catch (err) {
            throw new Error('Error adding product: ' + err.message);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            await this.loadProducts();
            const index = this.products.findIndex(p => p.id === id);
            if (index >= 0) {
                this.products[index] = { ...this.products[index], ...updatedFields };
                await fs.writeFile(productsFilePath, JSON.stringify(this.products));
                console.log('Product updated!');
            } else {
                throw new Error('Product not found');
            }
        } catch (err) {
            throw new Error('Error updating product: ' + err.message);
        }
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }
}

// Uso:

async function main() {
    const manager = new ProductManager();
    try {
        await manager.loadProducts();
        await manager.addProduct('Product 1', 'Description 1', 100, 'url1');
        await manager.addProduct('Product 2', 'Description 2', 200, 'url2');
        const products = manager.getProducts();
        const product1 = manager.getProductById(1);
        const product2 = manager.getProductById(2);
        await manager.updateProduct(1, {
            price: 150
        });
    } catch (err) {
        console.error(err.message);
    }
}

main();
