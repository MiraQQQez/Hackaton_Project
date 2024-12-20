document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const parallaxScroll = () => {
        const scrolled = window.pageYOffset;
        requestAnimationFrame(() => {
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    };

    window.addEventListener('scroll', parallaxScroll);
    parallaxScroll(); // Инициализация
}); 