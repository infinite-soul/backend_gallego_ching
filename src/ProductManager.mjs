import fs from 'fs/promises';
import crypto from 'crypto';
class ProductManager {
    constructor() {
        this.products = [];
        this.loadProductsFromFile();
    }

    async loadProductsFromFile() {
        try {
            const fileData = await fs.readFile('products.json', 'utf8');
            this.products = JSON.parse(fileData);
        } catch (error) {
            console.error('Error al cargar los productos desde el archivo:', error);
        }
    }

    async saveProductsToFile() {
        try {
            await fs.writeFile('products.json', JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error('Error al guardar los productos en el archivo:', error);
        }
    }

    generateRandomCode() {
        const codeLength = 10;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        return new Promise((resolve, reject) => {
            crypto.randomBytes(codeLength, (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    let result = '';
                    for (let i = 0; i < codeLength; i++) {
                        result += characters.charAt(buffer[i] % charactersLength);
                    }
                    resolve(result);
                }
            });
        });
    }

    getAllProducts() {
        return this.products;
    }

    getProductById(productId) {
        return this.products.find(p => p.id === productId);
    }

    async createProduct(productData) {
        try {
            const { title, description, price, stock, category, thumbnails = [], status = true } = productData;
            const code = await this.generateRandomCode();

            const newProduct = {
                id: this.products.length + 1,
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails: Array.isArray(thumbnails) ? thumbnails : [thumbnails],
            };

            this.products.push(newProduct);
            await this.saveProductsToFile();

            return { ...newProduct, code };
        } catch (error) {
            console.error(error);
            throw new Error('Error al crear el producto');
        }
    }

    updateProduct(productId, productData) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            for (const key in productData) {
                if (key !== 'id') {
                    product[key] = productData[key];
                }
            }
            this.saveProductsToFile(); // Guardar los cambios en el archivo
            return { ...product, code: product.code };
        } else {
            throw new Error('Producto no encontrado');
        }
    }
    

    deleteProduct(productId) {
        const productIndex = this.products.findIndex(p => p.id === productId);
        if (productIndex !== -1) {
            const deletedProduct = this.products.splice(productIndex, 1)[0];
            return { ...deletedProduct, code: deletedProduct.code };
        } else {
            throw new Error('Producto no encontrado');
        }
    }
}

export default ProductManager;
