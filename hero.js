(() => {

    const carousel =
        document.querySelector("[data-hero-carousel]");

    if (!carousel) {
        return;
    }


    const slides =
        Array.from(
            carousel.querySelectorAll("[data-hero-slide]")
        );

    const dots =
        Array.from(
            carousel.querySelectorAll("[data-hero-dot]")
        );

    const previousButton =
        carousel.querySelector("[data-hero-prev]");

    const nextButton =
        carousel.querySelector("[data-hero-next]");

    const pauseButton =
        carousel.querySelector("[data-hero-pause]");

    const currentCounter =
        carousel.querySelector("[data-hero-current]");


    if (slides.length < 2) {
        return;
    }


    const autoplayDelay = 6500;

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    let currentIndex = 0;
    let autoplayTimer = null;
    let manuallyPaused = reducedMotion.matches;
    let temporarilyPaused = false;

    let pointerStartX = null;
    let pointerStartY = null;


    function formatNumber(number) {

        return String(number).padStart(2, "0");

    }


    function showSlide(index) {

        currentIndex =
            (index + slides.length) % slides.length;


        slides.forEach((slide, slideIndex) => {

            const isActive =
                slideIndex === currentIndex;

            slide.classList.toggle(
                "is-active",
                isActive
            );

            slide.setAttribute(
                "aria-hidden",
                isActive ? "false" : "true"
            );

        });


        dots.forEach((dot, dotIndex) => {

            const isActive =
                dotIndex === currentIndex;

            dot.classList.toggle(
                "is-active",
                isActive
            );

            if (isActive) {

                dot.setAttribute(
                    "aria-current",
                    "true"
                );

            } else {

                dot.removeAttribute(
                    "aria-current"
                );

            }

        });


        if (currentCounter) {

            currentCounter.textContent =
                formatNumber(currentIndex + 1);

        }

    }


    function nextSlide() {

        showSlide(currentIndex + 1);

    }


    function previousSlide() {

        showSlide(currentIndex - 1);

    }


    function stopAutoplay() {

        if (autoplayTimer) {

            window.clearInterval(
                autoplayTimer
            );

            autoplayTimer = null;

        }

    }


    function startAutoplay() {

        stopAutoplay();


        if (
            manuallyPaused ||
            temporarilyPaused ||
            document.hidden
        ) {

            return;

        }


        autoplayTimer =
            window.setInterval(
                nextSlide,
                autoplayDelay
            );

    }


    function updatePauseButton() {

        if (!pauseButton) {
            return;
        }


        if (manuallyPaused) {

            pauseButton.textContent =
                "Play";

            pauseButton.setAttribute(
                "aria-label",
                "Play carousel"
            );

        } else {

            pauseButton.textContent =
                "Pause";

            pauseButton.setAttribute(
                "aria-label",
                "Pause carousel"
            );

        }

    }


    previousButton?.addEventListener(
        "click",
        () => {

            previousSlide();
            startAutoplay();

        }
    );


    nextButton?.addEventListener(
        "click",
        () => {

            nextSlide();
            startAutoplay();

        }
    );


    dots.forEach((dot, dotIndex) => {

        dot.addEventListener(
            "click",
            () => {

                showSlide(dotIndex);
                startAutoplay();

            }
        );

    });


    pauseButton?.addEventListener(
        "click",
        () => {

            manuallyPaused =
                !manuallyPaused;

            updatePauseButton();
            startAutoplay();

        }
    );


    carousel.addEventListener(
        "mouseenter",
        () => {

            temporarilyPaused = true;
            stopAutoplay();

        }
    );


    carousel.addEventListener(
        "mouseleave",
        () => {

            temporarilyPaused = false;
            startAutoplay();

        }
    );


    carousel.addEventListener(
        "focusin",
        () => {

            temporarilyPaused = true;
            stopAutoplay();

        }
    );


    carousel.addEventListener(
        "focusout",
        event => {

            if (
                !carousel.contains(
                    event.relatedTarget
                )
            ) {

                temporarilyPaused = false;
                startAutoplay();

            }

        }
    );


    carousel.addEventListener(
        "pointerdown",
        event => {

            if (
                event.pointerType !== "touch" &&
                event.pointerType !== "pen"
            ) {

                return;

            }

            pointerStartX = event.clientX;
            pointerStartY = event.clientY;

        }
    );


    carousel.addEventListener(
        "pointerup",
        event => {

            if (
                pointerStartX === null ||
                pointerStartY === null
            ) {

                return;

            }


            const deltaX =
                event.clientX - pointerStartX;

            const deltaY =
                event.clientY - pointerStartY;


            pointerStartX = null;
            pointerStartY = null;


            if (
                Math.abs(deltaX) < 55 ||
                Math.abs(deltaX) <= Math.abs(deltaY)
            ) {

                return;

            }


            if (deltaX < 0) {

                nextSlide();

            } else {

                previousSlide();

            }


            startAutoplay();

        }
    );


    document.addEventListener(
        "visibilitychange",
        startAutoplay
    );


    reducedMotion.addEventListener?.(
        "change",
        event => {

            manuallyPaused = event.matches;
            updatePauseButton();
            startAutoplay();

        }
    );


    showSlide(0);
    updatePauseButton();
    startAutoplay();

})();
