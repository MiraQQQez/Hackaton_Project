'use strict';

/**
 * Обработчик модальных окон авторизации
 * @author Igor Silin
 */
class LoginModalHandler {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.loginModal = document.getElementById('loginModal');
        this.registerModal = document.getElementById('registerModal');
        this.initialize();
    }

    initialize() {
        // Инициализация форм
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
            this.initializeRegistrationValidation();
        }

        // Инициализация кнопок показа пароля
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', (e) => this.togglePasswordVisibility(e));
        });

        // Обработка маршрутов
        this.handleRoutes();
        window.addEventListener('hashchange', () => this.handleRoutes());

        // Обработка закрытия модальных окон
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('hidden.bs.modal', () => {
                if (window.location.hash === '#login' || window.location.hash === '#register') {
                    history.pushState('', document.title, window.location.pathname);
                }
            });
        });
    }

    togglePasswordVisibility(e) {
        e.preventDefault();
        const button = e.currentTarget;
        const input = button.previousElementSibling; // Получаем input напрямую
        const icon = button.querySelector('i');
        
        if (input && icon) {
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }
    }

    initializeRegistrationValidation() {
        const regPassword = document.getElementById('regPassword');
        const regPasswordConfirm = document.getElementById('regPasswordConfirm');
        const regEmail = document.getElementById('regEmail');
        const regName = document.getElementById('regName');
        const regPhone = document.getElementById('regPhone');

        if (regPassword) {
            regPassword.addEventListener('input', () => {
                const requirements = {
                    length: regPassword.value.length >= 8,
                    lowercase: /[a-z]/.test(regPassword.value),
                    uppercase: /[A-Z]/.test(regPassword.value),
                    number: /[0-9]/.test(regPassword.value),
                    special: /[!@#$%^&*]/.test(regPassword.value)
                };

                Object.entries(requirements).forEach(([req, isValid]) => {
                    const reqElement = document.getElementById(req);
                    if (reqElement) {
                        reqElement.classList.remove('valid', 'invalid');
                        reqElement.classList.add(isValid ? 'valid' : 'invalid');
                        
                        // Добавляем анимацию
                        reqElement.style.animation = 'none';
                        reqElement.offsetHeight; // Форсируем перерисовку
                        reqElement.style.animation = isValid ? 'validRequirement 0.3s ease' : 'invalidRequirement 0.3s ease';
                    }
                });
            });
        }

        if (regPasswordConfirm) {
            regPasswordConfirm.addEventListener('input', () => this.validatePasswordConfirm());
        }

        if (regEmail) {
            regEmail.addEventListener('input', () => this.validateEmail(regEmail));
        }

        if (regName) {
            regName.addEventListener('input', () => this.validateName(regName));
        }

        if (regPhone) {
            regPhone.addEventListener('input', () => this.validatePhone(regPhone));
        }
    }

    handleRoutes() {
        const hash = window.location.hash;
        
        // Закрываем все модальные окна
        [this.loginModal, this.registerModal].forEach(modal => {
            if (modal) {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
            }
        });

        // Открываем нужное модальное окно
        switch(hash) {
            case '#login':
                if (this.loginModal) {
                    new bootstrap.Modal(this.loginModal).show();
                }
                break;
            case '#register':
                if (this.registerModal) {
                    new bootstrap.Modal(this.registerModal).show();
                }
                break;
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = this.loginForm.querySelector('input[type="email"]');
        const password = this.loginForm.querySelector('input[type="password"]');

        if (!this.validateEmail(email)) {
            return;
        }

        try {
            console.log('Авторизация успешна');
            const modal = document.getElementById('loginModal');
            if (modal) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
            const errorContainer = this.loginForm.querySelector('.error-message');
            if (errorContainer) {
                errorContainer.textContent = 'Ошибка при входе. Пожалуйста, проверьте введенные данные.';
            }
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('regName');
        const email = document.getElementById('regEmail');
        const phone = document.getElementById('regPhone');
        const password = document.getElementById('regPassword');

        const isNameValid = this.validateName(name);
        const isEmailValid = this.validateEmail(email);
        const isPhoneValid = this.validatePhone(phone);
        const isPasswordValid = this.validateRegistrationPassword(password);
        const isConfirmValid = this.validatePasswordConfirm();

        if (!isNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmValid) {
            return;
        }

        try {
            console.log('Регистрация успешна');
            const modal = document.getElementById('registerModal');
            if (modal) {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            const errorContainer = this.registerForm.querySelector('.error-message');
            if (errorContainer) {
                errorContainer.textContent = 'Ошибка при регистрации. Пожалуйста, попробуйте позже.';
            }
        }
    }

    validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input.value);
        this.setValidationState(input, isValid, 'Введите корректный email');
        return isValid;
    }

    validateName(input) {
        const nameRegex = /^[А-ЯЁа-яё\s-]{2,}$/;
        const isValid = nameRegex.test(input.value);
        this.setValidationState(input, isValid, 'Используйте только русские буквы');
        return isValid;
    }

    validatePhone(input) {
        const phoneRegex = /^[78]\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/;
        const isValid = phoneRegex.test(input.value);
        this.setValidationState(input, isValid, 'Формат: 7(999)999-99-99');
        return isValid;
    }

    validateRegistrationPassword(input) {
        const requirements = {
            length: input.value.length >= 8,
            lowercase: /[a-z]/.test(input.value),
            uppercase: /[A-Z]/.test(input.value),
            number: /[0-9]/.test(input.value),
            special: /[!@#$%^&*]/.test(input.value)
        };

        const isValid = Object.values(requirements).every(Boolean);
        this.setValidationState(input, isValid, 'Пароль не соответствует требованиям');
        return isValid;
    }

    validatePasswordConfirm() {
        const password = document.getElementById('regPassword');
        const confirm = document.getElementById('regPasswordConfirm');
        const isValid = password.value === confirm.value;
        this.setValidationState(confirm, isValid, 'Пароли не совпадают');
        return isValid;
    }

    setValidationState(input, isValid, errorMessage) {
        input.classList.toggle('is-invalid', !isValid);
        input.classList.toggle('is-valid', isValid);
        
        const errorContainer = input.parentElement.querySelector('.error-message') || 
                             input.parentElement.nextElementSibling;
        
        if (errorContainer && errorContainer.classList.contains('error-message')) {
            errorContainer.textContent = isValid ? '' : errorMessage;
        }
    }
}

class LoginModalHandlerNew {
    constructor() {
        this.modal = document.getElementById('loginModal');
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('loginEmail');
        this.passwordInput = document.getElementById('loginPassword');
        this.initialize();
    }

    initialize() {
        if (!this.modal || !this.form) return;

        // Инициализация Bootstrap Modal
        this.bsModal = new bootstrap.Modal(this.modal);

        // Инициализация обработчиков
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Обработчик формы
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Обработчик показа/скрытия пароля
        const toggleButton = this.form.querySelector('.toggle-password');
        if (toggleButton) {
            toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                const input = toggleButton.closest('.input-group').querySelector('input');
                const icon = toggleButton.querySelector('i');
                
                if (input && icon) {
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                }
            });
        }

        // Валидация email при вводе
        if (this.emailInput) {
            this.emailInput.addEventListener('input', () => this.validateEmail());
        }

        // Валидация пароля при вводе
        if (this.passwordInput) {
            this.passwordInput.addEventListener('input', () => this.validatePassword());
        }
    }

    validateEmail() {
        const email = this.emailInput.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);

        this.emailInput.classList.toggle('is-valid', isValid);
        this.emailInput.classList.toggle('is-invalid', !isValid && email !== '');

        return isValid;
    }

    validatePassword() {
        const password = this.passwordInput.value;
        const isValid = password.length >= 6;

        this.passwordInput.classList.toggle('is-valid', isValid);
        this.passwordInput.classList.toggle('is-invalid', !isValid && password !== '');

        return isValid;
    }

    showError(message) {
        // Удаляем предыдущее сообщение об ошибке, если оно есть
        const existingAlert = this.form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Создаем новое сообщение об ошибке
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger mt-3';
        alert.textContent = message;

        // Добавляем сообщение в форму
        this.form.appendChild(alert);

        // Удаляем сообщение через 3 секунды
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Валидация формы
        const isEmailValid = this.validateEmail();
        const isPasswordValid = this.validatePassword();

        if (!isEmailValid || !isPasswordValid) {
            this.showError('Пожалуйста, проверьте правильность заполнения полей');
            return;
        }

        try {
            // Здесь будет логика входа
            console.log('Форма входа отправлена');
            
            // Имитация успешного входа
            this.showSuccess();
            
            // Закрываем модальное окно через 2 секунды
            setTimeout(() => {
                this.bsModal.hide();
                this.form.reset();
            }, 2000);
        } catch (error) {
            console.error('Ошибка при входе:', error);
            this.showError('Произошла ошибка при входе');
        }
    }

    showSuccess() {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success mt-3';
        alert.textContent = 'Вход выполнен успешно!';
        
        this.form.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginModalHandler = new LoginModalHandler();
    const loginModalHandlerNew = new LoginModalHandlerNew();
});