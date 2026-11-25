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

        const link =
            card.querySelector(".product-card-link");

        const image =
            card.querySelector(
                ".product-image, .shop-product-image"
            );

        if (!link) {
            return;
        }

        /*
         * IMPORTANT:
         * The hyperlink itself is NEVER transformed.
         * This keeps its click area fixed and reliable.
         */

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
                 * Move only the product image.
                 * The card/link/text do not move at all.
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


        /*
         * Keyboard users:
         * Keep the depth shadow on focus without moving the link.
         */
        link.addEventListener(
            "focus",
            () => {
                card.classList.add(
                    "is-depth-active"
                );
            }
        );

        link.addEventListener(
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


    /*
     * Products are dynamically created by products.js,
     * so watch for newly-added cards.
     */
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
