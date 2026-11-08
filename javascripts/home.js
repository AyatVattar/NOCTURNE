// ================================
// NAVIGATION
// ================================

const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

navToggle?.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
});

navClose?.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});


// ================================
// HERO SLIDER
// ================================

const slider = document.getElementById('slider');

document.addEventListener('click', event => {
    if (!slider) return;

    const items = slider.querySelectorAll('.slider-item');

    if (event.target.closest('.next')) {
        slider.append(items[0]);
    }

    if (event.target.closest('.prev')) {
        slider.prepend(items[items.length - 1]);
    }
});


// ================================
// STYLE CAROUSEL
// ================================

const navLinks = document.querySelectorAll('.carousel .nav-link');
const styleSlides = document.querySelectorAll('.carousel .slides img');
const overlays = document.querySelectorAll('.carousel .bar');

if (styleSlides.length && navLinks.length) {

    styleSlides[0].classList.add('active');
    navLinks[0].classList.add('active');

    navLinks.forEach((link, index) => {

        link.addEventListener('click', event => {
            event.preventDefault();

            navLinks.forEach(item => {
                item.classList.remove('active');
            });

            styleSlides.forEach(item => {
                item.classList.remove('active');
            });

            link.classList.add('active');

            styleSlides[index].classList.add('active');

            if (overlays[index]) {
                overlays[index].animate(
                    [
                        { transform: 'scaleX(0)' },
                        { transform: 'scaleX(1)' },
                        { transform: 'scaleX(0)' }
                    ],
                    {
                        duration: 900,
                        easing: 'ease-in-out'
                    }
                );
            }
        });

    });
}


// ================================
// SHOPPING CART
// ================================

const closeCart = document.querySelector('.close');
const iconCart = document.querySelector('.icon-card');
const body = document.body;

const slidesWrapper = document.querySelector('.slides-wrapper');
const listCartHTML = document.querySelector('.listCart');
const iconCartSpan = document.querySelector('.icon-card span');

const nextButton = document.querySelector('.slide-next');
const prevButton = document.querySelector('.slide-prev');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];
let currentSlide = 0;


// OPEN CART

iconCart?.addEventListener('click', () => {
    body.classList.add('showCart');
});


// CLOSE CART

closeCart?.addEventListener('click', () => {
    body.classList.remove('showCart');
});


// ================================
// FETCH PRODUCTS
// ================================

const fetchProducts = async () => {

    if (!slidesWrapper) return;

    slidesWrapper.innerHTML = '<p class="loading">Loading collection...</p>';

    try {

        const response = await fetch(
            'https://fakestoreapi.com/products/category/women%27s%20clothing'
        );

        if (!response.ok) {
            throw new Error('Could not load products');
        }

        products = await response.json();

        addDataToHTML();
        addCartToHTML();

    } catch (error) {

        console.error(error);

        slidesWrapper.innerHTML =
            '<p class="loading">Unable to load collection. Please try again.</p>';
    }
};


// ================================
// DISPLAY PRODUCTS
// ================================

const productImages = [
    "../images/dress1.jpg",
    "../images/dress2.jpg",
    "../images/dress3.jpg",
    "../images/boots.jpg",
    "../images/jeans.jpg",
    "../images/dress5.jpg"
];

const addDataToHTML = () => {

    slidesWrapper.innerHTML = '';

    products.forEach((product, index) => {

        if (index % 6 === 0) {

            const slideItem = document.createElement('div');

            slideItem.classList.add('slide-item');

            slidesWrapper.appendChild(slideItem);
        }

        const slideItem = slidesWrapper.lastElementChild;

        const newProduct = document.createElement('div');

        newProduct.classList.add('product-item');

        newProduct.dataset.id = product.id;


        newProduct.innerHTML = `
            <a href="product.html?id=${product.id}">
           <img src="${productImages[index] || '../images/default.jpg'}" alt="${product.title}">
                <h2>${product.title}</h2>
                <div class="price">$${product.price.toFixed(2)}</div>
            </a>

            <button class="addCart">
                Add to Cart
            </button>
        `;

        slideItem.appendChild(newProduct);

    });

    currentSlide = 0;
    slidesWrapper.style.transform = 'translateX(0)';
};


// ================================
// PRODUCT SLIDER CONTROLS
// ================================

nextButton?.addEventListener('click', () => {

    const totalSlides = slidesWrapper.children.length;

    if (currentSlide < totalSlides - 1) {

        currentSlide++;

        slidesWrapper.style.transform =
            `translateX(-${currentSlide * 100}%)`;
    }

});


prevButton?.addEventListener('click', () => {

    if (currentSlide > 0) {

        currentSlide--;

        slidesWrapper.style.transform =
            `translateX(-${currentSlide * 100}%)`;
    }

});


// ================================
// ADD TO CART
// ================================

slidesWrapper?.addEventListener('click', event => {

    const button = event.target.closest('.addCart');

    if (!button) return;

    const productElement = button.closest('.product-item');

    const productId = productElement.dataset.id;

    addToCart(productId);

    button.textContent = 'Added ✓';

    setTimeout(() => {
        button.textContent = 'Add to Cart';
    }, 1000);

});


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

    addCartToMemory();
    addCartToHTML();

};


// ================================
// SAVE CART
// ================================

const addCartToMemory = () => {

    localStorage.setItem(
        'cart',
        JSON.stringify(cart)
    );

};


// ================================
// DISPLAY CART
// ================================

const addCartToHTML = () => {

    if (!listCartHTML) return;

    listCartHTML.innerHTML = '';

    let totalQuantity = 0;
    let totalPrice = 0;

    cart = cart.filter(item => {
        return products.some(
            product => product.id == item.product_id
        );
    });

    cart.forEach(item => {

        const product = products.find(
            product => product.id == item.product_id
        );

        if (!product) return;

        totalQuantity += item.quantity;

        totalPrice += product.price * item.quantity;

        const newItem = document.createElement('div');

        newItem.classList.add('item');

        newItem.dataset.id = item.product_id;

        newItem.innerHTML = `

            <div class="image">
            <img src="${productImages[products.indexOf(product)] || '../images/default.jpg'}"
     alt="${product.title}">
            </div>

            <div class="name">
                ${product.title}
            </div>

            <div class="totalPrice">
                $${(product.price * item.quantity).toFixed(2)}
            </div>

            <div class="quantity">
                <span class="minus">−</span>
                <span>${item.quantity}</span>
                <span class="plus">+</span>
            </div>

        `;

        listCartHTML.appendChild(newItem);

    });


    iconCartSpan.innerText = totalQuantity;

    const totalPriceDiv = document.createElement('div');

    totalPriceDiv.classList.add('total-price');

    totalPriceDiv.innerHTML = `
        <strong>Total: $${totalPrice.toFixed(2)}</strong>
    `;

    listCartHTML.appendChild(totalPriceDiv);

    addCartToMemory();

};


// ================================
// CHANGE QUANTITY
// ================================

listCartHTML?.addEventListener('click', event => {

    const button = event.target;

    if (
        !button.classList.contains('minus') &&
        !button.classList.contains('plus')
    ) {
        return;
    }

    const productId = button.closest('.item').dataset.id;

    const type = button.classList.contains('plus')
        ? 'plus'
        : 'minus';

    changeQuantityCart(productId, type);

});


const changeQuantityCart = (productId, type) => {

    const index = cart.findIndex(
        item => item.product_id == productId
    );

    if (index < 0) return;

    if (type === 'plus') {

        cart[index].quantity++;

    } else {

        cart[index].quantity--;

        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

    }

    addCartToMemory();
    addCartToHTML();

};


// ================================
// CHECKOUT DEMO
// ================================

document.querySelector('.checkOut')?.addEventListener('click', () => {

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    alert(
        'This is a demo store. Online checkout is not connected yet.'
    );

});


// ================================
// INITIALIZE
// ================================

fetchProducts();