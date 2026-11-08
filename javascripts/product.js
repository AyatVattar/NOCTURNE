// ================================
// PRODUCT ELEMENTS
// ================================

const productImage = document.querySelector('.product-image');
const productTitle = document.querySelector('.product-title');
const productPrice = document.querySelector('.product-price');
const productDescription = document.querySelector('.product-description');

const addToCartButton = document.querySelector('.add-to-cart');
const backButton = document.querySelector('.back-button');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];


// ================================
// FETCH PRODUCTS
// ================================

const fetchProducts = async () => {

    try {

        const response = await fetch(
            'https://fakestoreapi.com/products/category/women%27s%20clothing'
        );

        if (!response.ok) {
            throw new Error('Network Error');
        }

        products = await response.json();

        displayProduct();

    } catch (error) {

        console.error(error);

        productTitle.textContent = 'Unable to load product';

        productDescription.textContent =
            'Please check your internet connection and try again.';

    }

};


// ================================
// DISPLAY PRODUCT
// ================================

const displayProduct = () => {

    const productId = new URLSearchParams(
        window.location.search
    ).get('id');

    const product = products.find(
        item => item.id == productId
    );

    if (!product) {

        productTitle.textContent = 'Product not found';

        productDescription.textContent =
            'This product does not exist in the collection.';

        addToCartButton.disabled = true;

        return;
    }


    productImage.src = product.image;

    productImage.alt = product.title;

    productTitle.textContent = product.title;

    productPrice.textContent =
        `$${product.price.toFixed(2)}`;

    productDescription.textContent =
        product.description;


    addToCartButton.addEventListener('click', () => {

        addToCart(product.id);

        addToCartButton.innerHTML =
            '<i class="ri-check-line"></i> Added to Cart';

        setTimeout(() => {

            addToCartButton.innerHTML =
                '<i class="ri-shopping-bag-line"></i> Add to Cart';

        }, 1500);

    });

};


// ================================
// ADD TO CART
// ================================

const addToCart = productId => {

    const existingProduct = cart.find(
        item => item.product_id == productId
    );

    if (existingProduct) {

        existingProduct.quantity++;

    } else {

        cart.push({
            product_id: productId,
            quantity: 1
        });

    }

    localStorage.setItem(
        'cart',
        JSON.stringify(cart)
    );

};


// ================================
// BACK BUTTON
// ================================

backButton.addEventListener('click', () => {

    window.location.href = 'home.html';

});


// ================================
// INITIALIZE
// ================================

fetchProducts();