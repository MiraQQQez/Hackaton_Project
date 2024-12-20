// Менеджер анимаций и эффектов
const AnimationManager = {
    // Конфигурация
    config: {
        observer: {
            threshold: 0.2,
            rootMargin: '50px'
        },
        animations: {
            duration: '0.6s',
            easing: 'ease-out',
            delay: 0.1 // базовая задержка между элементами
        }
    },

    // Инициализация
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initScrollHandler();
            this.initParallax();
            this.initHoverEffects();
            this.initIntersectionObserver();
            this.initRippleEffect();
        });
    },

    // Оптимизированный обработчик скролла
    initScrollHandler() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                this.handleParallax();
                this.handleScrollAnimations();
            });
        });
    },

    // Параллакс эффекты
    initParallax() {
        this.heroElement = document.querySelector('.hero');
        this.parallaxElements = document.querySelectorAll('.parallax');
    },

    handleParallax() {
        const scrolled = window.pageYOffset;
        
        // Параллакс для hero секции
        if (this.heroElement) {
            this.heroElement.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }

        // Параллакс для элементов с data-speed
        this.parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    },

    // Intersection Observer для анимаций при скролле
    initIntersectionObserver() {
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.config.observer
        );

        // Инициализация элементов для анимации
        this.initAnimatedElements();
    },

    initAnimatedElements() {
        const elements = document.querySelectorAll(
            '.route-card, .step, .testimonial-card, .fade-in, .slide-in, .scale-in'
        );

        elements.forEach((element, index) => {
            // Установка начальных стилей
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `all ${this.config.animations.duration} ${this.config.animations.easing}`;
            element.style.transitionDelay = `${index * this.config.animations.delay}s`;

            // Добавление в observer
            this.observer.observe(element);
        });
    },

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                this.observer.unobserve(entry.target);
            }
        });
    },

    // Эффекты при наведении
    initHoverEffects() {
        // Анимация чисел в шагах
        const numbers = document.querySelectorAll('.step-number');
        numbers.forEach(number => {
            number.addEventListener('mouseover', () => {
                number.style.transform = 'scale(1.1) rotate(360deg)';
                number.style.transition = 'all 0.5s ease';
            });
            
            number.addEventListener('mouseout', () => {
                number.style.transform = 'scale(1) rotate(0deg)';
            });
        });

        // Анимация иконок
        const icons = document.querySelectorAll('.step i');
        icons.forEach(icon => {
            icon.addEventListener('mouseover', () => {
                icon.style.transform = 'scale(1.2) rotate(15deg)';
            });
            
            icon.addEventListener('mouseout', () => {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    },

    // Эффект волны для кнопок
    initRippleEffect() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const x = e.clientX - e.target.offsetLeft;
                const y = e.clientY - e.target.offsetTop;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    },

    // Вспомогательные методы
    handleScrollAnimations() {
        const elements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
            
            if (isVisible) {
                element.classList.add('visible');
            }
        });
    }
};

// Инициализация
AnimationManager.init();

// Экспорт для возможного использования в других модулях
export default AnimationManager;