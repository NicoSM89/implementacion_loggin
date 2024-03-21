const express = require('express');
const app = express();
const port = 8080;

// Mock data para productos
const mockProducts = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    price: Math.floor(Math.random() * 100) + 1, // Random price between 1 and 100
}));

// Custom error 
const errorDictionary = {
    'product_not_found': 'El producto no se encontró.',
    'invalid_request': 'La solicitud es inválida.',
    'cart_full': 'El carrito está lleno.',
};

// Middleware
app.use((err, req, res, next) => {
    if (errorDictionary[err]) {
        res.status(400).json({ error: errorDictionary[err] });
    } else {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

// Endpoint mocking
app.get('/mockingproducts', (req, res) => {
    res.json(mockProducts);
});

// Endpoint para agregar un producto al carrito
let cart = []; 

app.post('/add-to-cart/:productId', (req, res, next) => {
    const productId = parseInt(req.params.productId);

    // Buscar el producto en la lista de productos disponibles
    const product = mockProducts.find(product => product.id === productId);

    if (!product) {
        //producto no se encuentra, error de "product_not_found"
        next('product_not_found');
        return;
    }

    if (cart.length >= 10) {
        // Si el carrito está lleno (capacidad máxima de 10 productos), lanzar un error de "cart_full"
        next('cart_full');
        return;
    }

    // Agregar el producto al carrito
    cart.push(product);

    // Responder con el producto agregado al carrito
    res.json({ message: 'Producto agregado al carrito.', product });
});


// Inicializar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
