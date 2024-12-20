document.addEventListener('DOMContentLoaded', () => {
    console.log('Mobile menu script loaded');

    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) {
        console.error('Menu elements not found!');
        return;
    }

    console.log('Menu elements found:', { menuToggle, mainNav });

    menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Menu toggle clicked');
        
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        // Анимация бургер-меню
        const spans = menuToggle.querySelectorAll('span');
        if (menuToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            mainNav.style.display = 'block';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            setTimeout(() => {
                mainNav.style.display = 'none';
            }, 300);
        }
    });
}); 