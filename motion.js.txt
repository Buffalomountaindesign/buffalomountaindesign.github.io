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

    const cardSelector =
        ".product-card, .shop-product-card, .category-card";

    const clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);


    function attachDepth(card) {

        if (
            card.dataset.depthReady === "true"
        ) {
            return;
        }

        card.dataset.depthReady = "true";


        const target =
            card.matches(".category-card")
                ? card
                : card.querySelector(
                    ".product-card-link"
                );


        if (!target) {
            return;
        }


        card.addEventListener(
            "pointermove",
            event => {

                if (
                    reducedMotion.matches ||
                    !finePointer.matches
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


                /* Intentionally restrained:
                   enough movement to read as depth,
                   but not a dramatic "gaming card" tilt. */

                const rotateY =
                    (x - 0.5) * 6.5;

                const rotateX =
                    (0.5 - y) * 5;

                const translateX =
                    (x - 0.5) * 2.5;

                const translateY =
                    -5 + (y - 0.5) * 1.5;


                target.style.transform =
                    `perspective(1200px)
                     translate3d(${translateX}px, ${translateY}px, 0)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     scale(1.008)`;


                card.classList.add(
                    "is-depth-active"
                );

            }
        );


        card.addEventListener(
            "pointerleave",
            () => {

                target.style.transform = "";

                card.classList.remove(
                    "is-depth-active"
                );

            }
        );

    }


    function scanCards() {

        document
            .querySelectorAll(
                cardSelector
            )
            .forEach(
                attachDepth
            );

    }


    /* Handles cards already present on page load */
    scanCards();


    /* Handles product cards generated later by products.js */
    const observer =
        new MutationObserver(
            scanCards
        );


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

})();
