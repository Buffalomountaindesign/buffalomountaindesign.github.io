(() => {
    "use strict";

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    const finePointer =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        );

    const clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);

    const cardSelector =
        ".product-card, .shop-product-card";


    function attachDepth(card) {

        if (card.dataset.depthReady === "true") {
            return;
        }

        card.dataset.depthReady = "true";

        /*
         * The OUTER card is now the real <a> link.
         * The inner .product-card-link is only a visual transform layer.
         */
        const visualLayer =
            card.querySelector(".product-card-link");

        const image =
            card.querySelector(
                ".product-image, .shop-product-image"
            );

        if (!visualLayer) {
            return;
        }


        card.addEventListener(
            "pointerenter",
            () => {

                if (
                    !reducedMotion.matches &&
                    finePointer.matches
                ) {
                    card.classList.add(
                        "is-depth-active"
                    );
                }

            }
        );


        card.addEventListener(
            "pointermove",
            event => {

                if (
                    reducedMotion.matches ||
                    !finePointer.matches ||
                    !image
                ) {
                    return;
                }

                const rect =
                    card.getBoundingClientRect();

                const x =
                    clamp(
                        (event.clientX - rect.left)
                        / rect.width,
                        0,
                        1
                    );

                const y =
                    clamp(
                        (event.clientY - rect.top)
                        / rect.height,
                        0,
                        1
                    );

                /*
                 * Only the image gets perspective motion.
                 * The actual link/card never moves.
                 */
                const rotateY =
                    (x - 0.5) * 4.5;

                const rotateX =
                    (0.5 - y) * 3.5;

                const moveX =
                    (x - 0.5) * 3;

                const moveY =
                    (y - 0.5) * 2;

                image.style.transform =
                    `perspective(1000px)
                     translate3d(${moveX}px, ${moveY}px, 24px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     scale(1.012)`;
            }
        );


        card.addEventListener(
            "pointerleave",
            () => {

                if (image) {
                    image.style.transform = "";
                }

                card.classList.remove(
                    "is-depth-active"
                );

            }
        );


        card.addEventListener(
            "focus",
            () => {
                card.classList.add(
                    "is-depth-active"
                );
            }
        );


        card.addEventListener(
            "blur",
            () => {
                card.classList.remove(
                    "is-depth-active"
                );
            }
        );

    }


    function scanCards() {

        document
            .querySelectorAll(cardSelector)
            .forEach(attachDepth);
    }


    scanCards();


    new MutationObserver(
        scanCards
    ).observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

})();
