const products = [

    {
        id: "desert-oasis",
        name: "Desert Oasis",
        category: "necklaces",
        price: "$200 CAD",
        image: "assets/images/necklace-1.png",
        featured: true,
        materials: "Various types of 6 mm Czech seed beads",
        dimensions: "28 in circumference · 71 cm",
        availability: "Available",
        description: "Inspired by desert rattlesnakes."
    },

    {
        id: "beaded-necklace-02",
        name: "Beaded Necklace 02",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-2.png",
        featured: true
    },

    {
        id: "beaded-necklace-03",
        name: "Beaded Necklace 03",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-3.png",
        featured: true
    },

    {
        id: "beaded-necklace-04",
        name: "Beaded Necklace 04",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-4.png",
        featured: false
    },

    {
        id: "beaded-necklace-05",
        name: "Beaded Necklace 05",
        category: "necklaces",
        price: "$—",
        image: "assets/images/necklace-5.png",
        featured: false
    },

    {
        id: "beaded-necklace-06",
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
    leather: "Leather",
    art: "Art + Other"
};


function productUrl(product) {
    return `product.html?piece=${encodeURIComponent(product.id)}`;
}


/* =========================================================
   SHOP PAGE
   ========================================================= */

const grid = document.getElementById("product-grid");
const searchInput = document.getElementById("product-search");
const filterButtons = document.querySelectorAll(".filter-button");
const emptyMessage = document.getElementById("shop-empty");


if (grid && searchInput && emptyMessage) {

    let activeCategory = "all";


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

                <a
                    class="product-card-link"
                    href="${productUrl(product)}"
                    aria-label="View ${product.name}">

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

                    <p class="view-piece">
                        View Piece →
                    </p>

                </a>

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

                <a
                    class="product-card-link"
                    href="${productUrl(product)}"
                    aria-label="View ${product.name}">

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

                    <p class="view-piece">
                        View Piece →
                    </p>

                </a>

            `;


            featuredGrid.appendChild(card);

        });

}


/* =========================================================
   PRODUCT DETAIL PAGE
   ========================================================= */

const productDetail =
    document.getElementById("product-detail");


if (productDetail) {

    const params =
        new URLSearchParams(window.location.search);

    const requestedPiece =
        params.get("piece");


    const productIndex =
        products.findIndex(
            product =>
                product.id === requestedPiece
        );


    if (productIndex === -1) {

        document.title =
            "Piece Not Found | Buffalo Mountain Design";


        productDetail.innerHTML = `

            <section class="product-not-found">

                <p class="eyebrow">
                    COLLECTION
                </p>

                <h1>
                    Piece not found.
                </h1>

                <p>
                    This piece may have moved or the link may no longer be available.
                </p>

                <a
                    class="button"
                    href="shop.html">
                    Return to Shop
                </a>

            </section>

        `;

    } else {

        const product =
            products[productIndex];


        const previousProduct =
            products[
                (productIndex - 1 + products.length)
                % products.length
            ];


        const nextProduct =
            products[
                (productIndex + 1)
                % products.length
            ];


        document.title =
            `${product.name} | Buffalo Mountain Design`;


        productDetail.innerHTML = `

            <section class="product-detail-layout">

                <div class="product-detail-image">

                    <img
                        src="${product.image}"
                        alt="${product.name}">

                </div>


                <div class="product-detail-info">

                    <a
                        href="shop.html?category=${product.category}"
                        class="back-link">
                        ← Back to ${categoryNames[product.category]}
                    </a>

                    <p class="eyebrow">
                        ${categoryNames[product.category]}
                    </p>

                    <h1>
                        ${product.name}
                    </h1>

                    <p class="product-detail-price">
                        ${product.price}
                    </p>

                    <div class="product-detail-divider"></div>

                    ${
                        product.description
                            ? `
                                <p class="product-detail-copy">
                                    ${product.description}
                                </p>
                            `
                            : `
                                <p class="product-detail-copy">
                                    Handcrafted beadwork from Buffalo Mountain
                                    Design in Alberta, Canada.
                                </p>
                            `
                    }

                    ${
                        product.materials ||
                        product.dimensions
                            ? `
                                <dl class="product-meta">

                                    ${
                                        product.materials
                                            ? `
                                                <div class="product-meta-row">
                                                    <dt>Materials</dt>
                                                    <dd>${product.materials}</dd>
                                                </div>
                                            `
                                            : ""
                                    }

                                    ${
                                        product.dimensions
                                            ? `
                                                <div class="product-meta-row">
                                                    <dt>Size</dt>
                                                    <dd>${product.dimensions}</dd>
                                                </div>
                                            `
                                            : ""
                                    }

                                </dl>
                            `
                            : ""
                    }

                    <div class="product-status">
                        <span class="status-dot ${
                            product.availability === "Available"
                                ? "is-available"
                                : ""
                        }"></span>

                        ${
                            product.availability ||
                            "Materials, sizing and availability coming soon"
                        }
                    </div>

                </div>

            </section>


            <nav
                class="product-pagination"
                aria-label="Browse pieces">

                <a href="${productUrl(previousProduct)}">

                    <span>
                        Previous Piece
                    </span>

                    <strong>
                        ← ${previousProduct.name}
                    </strong>

                </a>


                <a
                    href="${productUrl(nextProduct)}"
                    class="product-next">

                    <span>
                        Next Piece
                    </span>

                    <strong>
                        ${nextProduct.name} →
                    </strong>

                </a>

            </nav>

        `;

    }

}
