document.addEventListener("DOMContentLoaded", function () {
    const slider = document.querySelector(".slider");
    const track = slider.querySelector(".slider-track");
    const previousButton = slider.querySelector(".previous");
    const nextButton = slider.querySelector(".next");
    const dotsContainer = slider.querySelector(".slider-dots");
    const status = slider.querySelector(".slide-status");

    const originalSlides = Array.from(track.querySelectorAll("img"));
    const slideCount = originalSlides.length;

    if (slideCount === 0) {
        return;
    }

    // Clone the first and last images for infinite looping.
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[slideCount - 1].cloneNode(true);

    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");

    track.insertBefore(lastClone, originalSlides[0]);
    track.appendChild(firstClone);

    // The first real image is at index 1.
    let currentIndex = 1;
    let isMoving = false;

    // Create one anchor link for each indicator dot.
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement("a");

        dot.href = "#";
        dot.setAttribute("aria-label", "Go to image " + (i + 1));

        dot.addEventListener("click", function (event) {
            event.preventDefault();

            if (isMoving) {
                return;
            }

            currentIndex = i + 1;
            moveToSlide();
        });

        dotsContainer.appendChild(dot);
    }

    const dots = Array.from(dotsContainer.querySelectorAll("a"));

    // Update the active dot and image counter.
    function updateSliderDetails() {
        let actualIndex = currentIndex - 1;

        if (actualIndex < 0) {
            actualIndex = slideCount - 1;
        }

        if (actualIndex >= slideCount) {
            actualIndex = 0;
        }

        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove("active");
            dots[i].removeAttribute("aria-current");
        }

        dots[actualIndex].classList.add("active");
        dots[actualIndex].setAttribute("aria-current", "true");

        status.textContent =
            "Image " + (actualIndex + 1) + " of " + slideCount;
    }

    // Move the slider horizontally.
    function moveToSlide() {
        track.style.transform =
            "translateX(-" + (currentIndex * 100) + "%)";

        updateSliderDetails();
    }

    // Move to the next image.
    function goToNext(event) {
        event.preventDefault();

        if (isMoving) {
            return;
        }

        isMoving = true;
        currentIndex++;
        moveToSlide();
    }

    // Move to the previous image.
    function goToPrevious(event) {
        event.preventDefault();

        if (isMoving) {
            return;
        }

        isMoving = true;
        currentIndex--;
        moveToSlide();
    }

    // Add click events to the arrow links.
    nextButton.addEventListener("click", goToNext);
    previousButton.addEventListener("click", goToPrevious);

    // Handle infinite looping.
    track.addEventListener("transitionend", function () {
        if (currentIndex === slideCount + 1) {
            track.style.transition = "none";
            currentIndex = 1;
            moveToSlide();
        } else if (currentIndex === 0) {
            track.style.transition = "none";
            currentIndex = slideCount;
            moveToSlide();
        }

        // Apply the position before restoring the animation.
        track.offsetHeight;

        track.style.transition = "transform 450ms ease-in-out";

        isMoving = false;
        updateSliderDetails();
    });

    // Reposition the slider when the window is resized.
    window.addEventListener("resize", function () {
        track.style.transition = "none";
        moveToSlide();

        track.offsetHeight;

        track.style.transition = "transform 450ms ease-in-out";
    });

    // Start on the first real image without animation.
    track.style.transition = "none";
    moveToSlide();

    track.offsetHeight;

    track.style.transition = "transform 450ms ease-in-out";
});
