'use strict';

class ModalManager {
    constructor() {
        this.modals = {};
        this.initialize();
    }

    initialize() {
        try {
            // Инициализация всех модальных окон
            document.querySelectorAll('.modal').forEach(modalElement => {
                const modalId = modalElement.id;
                // Создаем экземпляр Bootstrap Modal
                this.modals[modalId] = new bootstrap.Modal(modalElement, {
                    backdrop: true,
                    keyboard: true,
                    focus: true
                });

                // Сохраняем состояние кнопок при открытии
                modalElement.addEventListener('show.bs.modal', () => {
                    const buttons = modalElement.querySelectorAll('button');
                    buttons.forEach(button => {
                        button.style.display = '';
                    });
                });

                // Обработчик закрытия модального окна
                modalElement.addEventListener('hidden.bs.modal', () => {
                    // Очищаем только backdrop
                    const backdrops = document.querySelectorAll('.modal-backdrop');
                    backdrops.forEach(backdrop => backdrop.remove());
                    
                    // Восстанавливаем состояние body
                    document.body.classList.remove('modal-open');
                    document.body.style.overflow = '';
                    document.body.style.paddingRight = '';
                });
            });

            // Инициализируем обработчики переключения форм
            this.initializeFormSwitching();

            console.log('ModalManager успешно инициализирован');
        } catch (error) {
            console.error('Ошибка при инициализации ModalManager:', error);
        }
    }

    initializeFormSwitching() {
        try {
            const switchToRegister = document.querySelector('.switch-to-register');
            const switchToLogin = document.querySelector('.switch-to-login');
            
            if (switchToRegister) {
                switchToRegister.addEventListener('click', (e) => {
                    e.preventDefault();
                    const loginModal = this.modals['loginModal'];
                    const registerModal = this.modals['registerModal'];
                    
                    if (loginModal) {
                        loginModal.hide();
                    }
                    
                    setTimeout(() => {
                        if (registerModal) {
                            registerModal.show();
                        }
                    }, 300);
                });
            }

            if (switchToLogin) {
                switchToLogin.addEventListener('click', (e) => {
                    e.preventDefault();
                    const registerModal = this.modals['registerModal'];
                    const loginModal = this.modals['loginModal'];
                    
                    if (registerModal) {
                        registerModal.hide();
                    }
                    
                    setTimeout(() => {
                        if (loginModal) {
                            loginModal.show();
                        }
                    }, 300);
                });
            }
        } catch (error) {
            console.error('Ошибка при инициализации переключения форм:', error);
        }
    }

    // Статический метод для получения экземпляра
    static getInstance() {
        if (!ModalManager.instance) {
            ModalManager.instance = new ModalManager();
        }
        return ModalManager.instance;
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.modalManager = ModalManager.getInstance();
});