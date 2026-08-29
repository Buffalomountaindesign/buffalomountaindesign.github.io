const products = [

    {
        name: "Beaded Necklace 01",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-1.png"
    },

    {
        name: "Beaded Necklace 02",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-2.png"
    },

    {
        name: "Beaded Necklace 03",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-3.png"
    },

    {
        name: "Beaded Necklace 04",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-4.png"
    },

    {
        name: "Beaded Necklace 05",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-5.png"
    },

    {
        name: "Beaded Necklace 06",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-6.png"
    }

];


const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("product-search");
const filterButtons = document.querySelectorAll(".filter-button");
const emptyMessage = document.getElementById("shop-empty");


const categoryNames = {
    earrings: "Earrings",
    necklaces: "Necklaces",
    bracelets: "Bracelets",
    art: "Art + Other"
};

/* Hide category filters that currently have no products */

filterButtons.forEach(button => {

    const category = button.dataset.filter;

    // Always keep the "All" button
    if (category === "all") {
        return;
    }

    const categoryHasProducts =
        products.some(product =>
            product.category === category
        );

    if (!categoryHasProducts) {
        button.hidden = true;
    }

});

let activeCategory = "all";


function renderProducts() {

    const searchTerm = searchInput.value
        .toLowerCase()
        .trim();


    const filteredProducts = products.filter(product => {

        const matchesCategory =
            activeCategory === "all" ||
            product.category === activeCategory;


        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            categoryNames[product.category]
                .toLowerCase()
                .includes(searchTerm);


        return matchesCategory && matchesSearch;

    });


    grid.innerHTML = "";


    if (filteredProducts.length === 0) {

        emptyMessage.hidden = false;

        return;

    }


    emptyMessage.hidden = true;


    filteredProducts.forEach(product => {

        const card = document.createElement("article");

        card.className = "shop-product-card";


        let imageMarkup;


        if (product.image) {

            imageMarkup = `
                <div class="shop-product-image">
                    <img
                        src="${product.image}"
                        alt="${product.name}">
                </div>
            `;

        } else {

            imageMarkup = `
                <div class="shop-product-image placeholder"></div>
            `;

        }


        card.innerHTML = `

            ${imageMarkup}

            <p class="product-category">
                ${categoryNames[product.category]}
            </p>

            <h2>
                ${product.name}
            </h2>

            <p class="product-price">
                ${product.price}
            </p>

        `;


        grid.appendChild(card);

    });

}


function setCategory(category) {

    activeCategory = category;


    filterButtons.forEach(button => {

        const isActive =
            button.dataset.filter === category;

        button.classList.toggle(
            "active",
            isActive
        );

    });


    renderProducts();

}


filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        setCategory(
            button.dataset.filter
        );

    });

});


searchInput.addEventListener(
    "input",
    renderProducts
);


/* Read category links from homepage */

const urlParams =
    new URLSearchParams(window.location.search);

const requestedCategory =
    urlParams.get("category");


if (
    requestedCategory &&
    categoryNames[requestedCategory]
) {

    setCategory(requestedCategory);

} else {

    setCategory("all");

}
