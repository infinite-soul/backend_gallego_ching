//Desafío express
//Luis Alejandro Gallego Ching


import { promises as fs } from 'fs';
import crypto from 'crypto';

class ProductManager {
    constructor() {
        this.path = 'products.json';
        this.products = null;
        this.initialize();
    }
    async initialize() {
        const fileExists = await this.checkFileExists();
        if (fileExists) {
            await this.loadProducts();
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
            this.products = [];
        } catch (error) {
            console.log('Error al crear el archivo de productos:', error.message);
        }
    }
    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            console.log('Error al cargar los productos:', error.message);
        }
    }
    async addProduct(productData) {

        const requiredFields = ['title', 'description', 'price', 'thumbnail'];
        const errors = [];

        requiredFields.forEach(field => {
            if (!productData[field]) {
                errors.push(`No se encontró el campo ${field}`);
            }
        });

        if (errors.length > 0) {
            console.log('Error al agregar el producto:');
            errors.forEach(error => {
                console.log(error);
            });
            return;
        }

        const id = this.getMaxId() + 1;
        const code = await this.generateRandomCode();
        const product = {
            id,
            code,
            stock: 0,
            ...productData
        };

        this.products.push(product);
        await this.saveProducts();
    }

    async saveProducts() {
        try {
            const data = JSON.stringify(this.products);
            await fs.writeFile(this.path, data, 'utf-8');
        } catch (error) {
            console.log('Error al guardar los productos:', error.message);
        }
    }
    getMaxId() {
        let maxId = 0;
        this.products.forEach((product) => {
            if (product.id > maxId) {
                maxId = product.id;
            }
        });
        return maxId;
    }
    generateRandomCode() {
        return new Promise((resolve, reject) => {
            const codeLength = 10;
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;

            crypto.randomBytes(codeLength, (err, buffer) => {
                if (err) {
                    reject(err);
                } else {
                    const result = Array.from(buffer)
                        .map(byte => characters[byte % charactersLength])
                        .join('');
                    resolve(result);
                }
            });
        });
    }

    getProducts() {
        return this.products;
    }
    getProductById(idProduct) {
        const product = this.products.find((product) => product.id === idProduct);
        if (!product) {
            console.log("Producto no encontrado");
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updatedFields
            };
            await this.saveProducts();
        } else {
            console.log("Producto no encontrado");
        }
    }
    async deleteProduct(id) {
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            await this.saveProducts();
        } else {
            console.log("Producto no encontrado");
        }
    }
    async incrementStock(id, amount) {
        const productIndex = this.products.findIndex((product) => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex].stock += amount;
            await this.saveProducts();
        } else {
            console.log("Producto no encontrado");
        }
    }
}



// async function main() {
//     //Pruebas ordenadas y comentadas para probarse unitariamente


//     const productManager = new ProductManager();
//     await productManager.initialize();


    // console.log(productManager.getProducts());


    // await productManager.addProduct({
    //     title: 'Res',
    //     description: '8 slices Beef\n12 florets Broccoli\n1 Packet Potatoes\n1 Packet Carrots\n140g plain flour\n4 Eggs\n200ml milk\ndrizzle (for cooking) sunflower oil',
    //     price: 2000,
    //     thumbnail: 'https://www.themealdb.com/images/media/meals/sypxpx1515365095.jpg',
    //     stock: 5
    // });
    // await productManager.addProduct({
    //     title: 'Cerdo',
    //     description: '1.5 pounds sliced Pork\n1 package thin Rice Vermicelli\n4-6 Egg Rolls\n3 tablespoons minced Challots\n1.5 tablespoons minced garlic Garlic\n¼ cup Sugar\n1 tablespoon Fish Sauce\n½ tablespoon thick Soy sauce\n½ tablespoon Pepper\n3 tablespoons Olive Oil\nSliced Cucumber\nLeaves Mint\nCrushed Peanuts',
    //     price: 1500,
    //     thumbnail: 'https://www.themealdb.com/images/media/meals/qqwypw1504642429.jpg',
    //     stock: 10
    // });
    // await productManager.addProduct({
    //     title: 'Pollo',
    //     description: '1 whole Chicken\n1 chopped Tomato\n2 chopped Onions\n2 chopped Garlic Clove\n1 chopped Red Pepper\n1 chopped Carrots\n1 Lime\n2 tsp Thyme\n1 tsp Allspice\n2 tbs Soy Sauce\n2 tsp Cornstarch\n2 cups Coconut Milk\n1 tbs Vegetable Oil',
    //     price: 1200,
    //     thumbnail: 'https://www.themealdb.com/images/media/meals/ssrrrs1503664277.jpg',
    //     stock: 3
    // });


    // console.log('----------Aquí muestro la lista de todos los productos agregados-----------');
    // console.log(productManager.getProducts());


    // console.log('----------Aquí muestro el producto obtenido según su id, o puede ser No encontrado-----------');
    // console.log(productManager.getProductById(3));


    // await productManager.updateProduct(1, { price: 2000 });
    // console.log('----------Producto actualizado-----------');
    // console.log(productManager.getProductById(1));


    // await productManager.incrementStock(1, 5);
    // console.log('----------Stock incrementado-----------');
    // console.log(productManager.getProductById(1));


    // await productManager.deleteProduct(2);
    // console.log('----------Producto eliminado-----------');
    // console.log(productManager.getProducts());

// }



// main().catch(error => console.error(error));

export default ProductManager;