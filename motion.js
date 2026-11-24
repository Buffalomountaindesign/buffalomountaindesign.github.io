(() => {

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

    const finePointer =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        );

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    const revealItems =
        Array.from(
            document.querySelectorAll(
                "[data-reveal]"
            )
        );

    if (
        reducedMotion.matches ||
        !("IntersectionObserver" in window)
    ) {

        revealItems.forEach(
            item =>
                item.classList.add(
                    "is-revealed"
                )
        );

    } else {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "is-revealed"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -6% 0px"
                }
            );

        revealItems.forEach(
            item =>
                revealObserver.observe(item)
        );

    }

    const hero =
        document.querySelector(
            ".hero-carousel"
        );

    const heroVisual =
        document.querySelector(
            ".hero-carousel-visual"
        );

    const ambientBeads =
        Array.from(
            document.querySelectorAll(
                ".ambient-bead"
            )
        );

    function resetHeroDepth() {

        if (heroVisual) {
            heroVisual.style.transform = "";
            heroVisual.classList.remove(
                "is-depth-active"
            );
        }

        ambientBeads.forEach(
            bead =>
                bead.style.transform = ""
        );

    }

    if (
        hero &&
        heroVisual &&
        finePointer.matches &&
        !reducedMotion.matches
    ) {

        hero.addEventListener(
            "pointermove",
            event => {

                const rect =
                    hero.getBoundingClientRect();

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

                const rotateY =
                    (x - 0.5) * 2.4;

                const rotateX =
                    (0.5 - y) * 1.5;

                heroVisual.style.transform =
                    `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(4px)`;

                heroVisual.classList.add(
                    "is-depth-active"
                );

                ambientBeads.forEach(
                    (bead, index) => {

                        const strength =
                            8 + index * 3.2;

                        const moveX =
                            (x - 0.5) * strength;

                        const moveY =
                            (y - 0.5) * strength * 0.75;

                        bead.style.transform =
                            `translate3d(${moveX}px, ${moveY}px, 0)`;

                    }
                );

            }
        );

        hero.addEventListener(
            "pointerleave",
            resetHeroDepth
        );

    }

    const tiltSelector =
        ".product-card, .shop-product-card, .category-card";

    function attachTilt(card) {

        if (
            card.dataset.tiltReady === "true"
        ) {
            return;
        }

        card.dataset.tiltReady = "true";

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

                const rotateY =
                    (x - 0.5) * 5;

                const rotateX =
                    (0.5 - y) * 4;

                const target =
                    card.matches(
                        ".category-card"
                    )
                        ? card
                        : card.querySelector(
                            ".product-card-link"
                        );

                if (!target) {
                    return;
                }

                target.style.transform =
                    `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;

                card.classList.add(
                    "is-tilting"
                );

            }
        );

        card.addEventListener(
            "pointerleave",
            () => {

                const target =
                    card.matches(
                        ".category-card"
                    )
                        ? card
                        : card.querySelector(
                            ".product-card-link"
                        );

                if (target) {
                    target.style.transform = "";
                }

                card.classList.remove(
                    "is-tilting"
                );

            }
        );

    }

    function scanTiltCards() {

        document
            .querySelectorAll(
                tiltSelector
            )
            .forEach(
                attachTilt
            );

    }

    scanTiltCards();

    const cardObserver =
        new MutationObserver(
            scanTiltCards
        );

    cardObserver.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );

    const detailImage =
        document.querySelector(
            ".product-detail-image"
        );

    if (
        detailImage &&
        finePointer.matches &&
        !reducedMotion.matches
    ) {

        detailImage.addEventListener(
            "pointermove",
            event => {

                const rect =
                    detailImage.getBoundingClientRect();

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

                const rotateY =
                    (x - 0.5) * 2.4;

                const rotateX =
                    (0.5 - y) * 1.8;

                const image =
                    detailImage.querySelector(
                        "img"
                    );

                if (image) {

                    image.style.transform =
                        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.006)`;

                    detailImage.classList.add(
                        "is-depth-active"
                    );

                }

            }
        );

        detailImage.addEventListener(
            "pointerleave",
            () => {

                const image =
                    detailImage.querySelector(
                        "img"
                    );

                if (image) {
                    image.style.transform = "";
                }

                detailImage.classList.remove(
                    "is-depth-active"
                );

            }
        );

    }

    reducedMotion.addEventListener?.(
        "change",
        event => {

            if (event.matches) {

                resetHeroDepth();

                document
                    .querySelectorAll(
                        tiltSelector
                    )
                    .forEach(card => {

                        card.classList.remove(
                            "is-tilting"
                        );

                        const target =
                            card.matches(
                                ".category-card"
                            )
                                ? card
                                : card.querySelector(
                                    ".product-card-link"
                                );

                        if (target) {
                            target.style.transform = "";
                        }

                    });

            }

        }
    );

})();
