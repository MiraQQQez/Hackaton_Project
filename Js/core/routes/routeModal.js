'use strict';

/**
 * Обработчик модальных окон для топовых маршрутов
 * @author Igor Silin
 */
class RouteModalHandler {
    constructor() {
        this.initialize();
    }

    initialize() {
        // Находим все кнопки для топовых маршрутов
        document.querySelectorAll('[data-route]').forEach(button => {
            button.addEventListener('click', (e) => this.handleRouteClick(e));
        });
    }

    handleRouteClick(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const routeId = button.getAttribute('data-route');
        
        // Проверяем авторизацию
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (!isAuthenticated) {
            // Если пользователь не авторизован, показываем окно входа
            const loginModal = document.getElementById('loginModal');
            if (loginModal) {
                const modal = new bootstrap.Modal(loginModal);
                modal.show();
            }
            return;
        }

        // Если пользователь авторизован, показываем окно бронирования
        const bookingModal = document.getElementById('bookingModal');
        if (bookingModal) {
            // Заполняем данные маршрута в форме бронирования
            const routeInput = bookingModal.querySelector('[name="route"]');
            if (routeInput) {
                routeInput.value = routeId;
            }
            
            const modal = new bootstrap.Modal(bookingModal);
            modal.show();
        }
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    new RouteModalHandler();
});
