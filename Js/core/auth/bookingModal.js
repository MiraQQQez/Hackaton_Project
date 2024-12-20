'use strict';

class BookingModalHandler {
    constructor() {
        // Инициализация элементов
        this.modal = document.getElementById('bookingModal');
        this.form = document.getElementById('bookingForm');
        this.authMessage = document.querySelector('.auth-message');
        this.routeInfo = document.querySelector('.route-info');
        this.loginBtn = document.getElementById('bookingLoginBtn');
        
        // Минимальная дата - сегодня
        this.minDate = new Date().toISOString().split('T')[0];
        
        // Инициализация
        this.initialize();
    }

    initialize() {
        if (!this.modal) return;

        // Создаем экземпляр модального окна Bootstrap
        this.bsModal = new bootstrap.Modal(this.modal);

        // Устанавливаем минимальную дату
        const dateInput = document.getElementById('bookingDate');
        if (dateInput) {
            dateInput.min = this.minDate;
        }

        // Обработчики событий
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Обработчик кнопки входа для неавторизованных пользователей
        if (this.loginBtn) {
            this.loginBtn.addEventListener('click', () => {
                this.bsModal.hide();
                const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
                loginModal.show();
            });
        }

        // Обработчик формы бронирования
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Валидация при вводе
            this.form.querySelectorAll('input').forEach(input => {
                input.addEventListener('input', () => this.validateField(input));
            });
        }

        // Обработчик кнопок бронирования в карточках маршрутов
        document.querySelectorAll('.route-card .btn-secondary').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleBooking(e));
        });
    }

    handleBooking(e) {
        e.preventDefault();
        const routeCard = e.target.closest('.route-card');
        
        if (routeCard) {
            // Получаем информацию о маршруте
            const routeTitle = routeCard.querySelector('h3').textContent;
            const routeInfo = routeCard.querySelector('p').textContent;
            const routePrice = routeCard.querySelector('.price').textContent;

            // Обновляем информацию в модальном окне
            this.updateRouteInfo(routeTitle, routeInfo, routePrice);
        }

        // Показываем модальное окно
        this.bsModal.show();
    }

    validateField(input) {
        const value = input.value.trim();
        const isValid = value !== '';
        
        input.classList.toggle('is-invalid', !isValid);
        input.classList.toggle('is-valid', isValid);
        
        return isValid;
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Проверяем все поля на валидность
        const inputs = this.form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Здесь будет логика отправки формы
            console.log('Форма валидна, можно отправлять');
            this.bsModal.hide();
        }
    }

    updateRouteInfo(title, info, price) {
        if (this.routeInfo) {
            this.routeInfo.innerHTML = `
                <h4>${title}</h4>
                <p>${info}</p>
                <p class="price">${price}</p>
            `;
        }
    }
}

// Создаем экземпляр обработчика при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new BookingModalHandler();
});