const products = [

    {
        name: "Beaded Necklace 01",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-1.png",
        featured: true
    },

    {
        name: "Beaded Necklace 02",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-2.png",
        featured: true
    },

    {
        name: "Beaded Necklace 03",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-3.png",
        featured: true
    },

    {
        name: "Beaded Necklace 04",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-4.png",
        featured: false
    },

    {
        name: "Beaded Necklace 05",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-5.png",
        featured: false
    },

    {
        name: "Beaded Necklace 06",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-6.png",
        featured: false
    }

];


const categoryNames = {
    earrings: "Earrings",
    necklaces: "Necklaces",
    bracelets: "Bracelets",
    art: "Art + Other"
};


/* =========================================================
   SHOP PAGE
   ========================================================= */

const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("product-search");
const filterButtons = document.querySelectorAll(".filter-button");
const emptyMessage = document.getElementById("shop-empty");


if (grid && searchInput && emptyMessage) {

    let activeCategory = "all";


    /* Hide filters that currently have no products */

    filterButtons.forEach(button => {

        const category = button.dataset.filter;

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


            card.innerHTML = `

                <div class="shop-product-image">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy">
                </div>

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

}


/* =========================================================
   HOMEPAGE CATEGORY COLLECTION
   ========================================================= */

const homeCategoryGrid =
    document.getElementById("home-category-grid");


if (homeCategoryGrid) {

    const availableCategories =
        [...new Set(
            products.map(product => product.category)
        )];


    homeCategoryGrid.dataset.count =
        availableCategories.length;


    availableCategories.forEach(category => {

        const categoryProduct =
            products.find(
                product =>
                    product.category === category
            );


        const card =
            document.createElement("a");


        card.href =
            `shop.html?category=${category}`;


        card.className =
            "category-card";


        card.innerHTML = `

            <div class="category-image">

                <img
                    src="${categoryProduct.image}"
                    alt="${categoryNames[category]}">

            </div>

            <h3>
                ${categoryNames[category]}
            </h3>

            <p>
                View Collection
            </p>

        `;


        homeCategoryGrid.appendChild(card);

    });

}


/* =========================================================
   HOMEPAGE FEATURED PRODUCTS
   ========================================================= */

const featuredGrid =
    document.getElementById("featured-grid");


if (featuredGrid) {

    let featuredProducts =
        products.filter(
            product => product.featured
        );


    /*
       If no products are manually marked as featured,
       automatically use the first three.
    */

    if (featuredProducts.length === 0) {

        featuredProducts =
            products.slice(0, 3);

    }


    featuredProducts
        .slice(0, 3)
        .forEach(product => {

            const card =
                document.createElement("article");


            card.className =
                "product-card";


            card.innerHTML = `

                <div class="product-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        loading="lazy">

                </div>

                <p class="product-category">
                    ${categoryNames[product.category]}
                </p>

                <h3>
                    ${product.name}
                </h3>

                <p class="product-price">
                    ${product.price}
                </p>

            `;


            featuredGrid.appendChild(card);

        });

}
