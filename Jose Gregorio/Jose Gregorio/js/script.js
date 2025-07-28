document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('#joseCarousel');
    carousel.addEventListener('mouseenter', () => {
        new bootstrap.Carousel(carousel).pause();
    });
    carousel.addEventListener('mouseleave', () => {
        new bootstrap.Carousel(carousel).cycle();
    });
});