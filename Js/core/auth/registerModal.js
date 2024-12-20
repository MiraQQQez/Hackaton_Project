'use strict';

class AuthModalsHandler {
    constructor() {
        // Модальные окна
        this.loginModal = document.getElementById('loginModal');
        this.registerModal = document.getElementById('registerModal');
        this.forgotPasswordModal = document.getElementById('forgotPasswordModal');

        // Формы
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.forgotPasswordForm = document.getElementById('forgotPasswordForm');

        // Поля форм
        this.loginEmail = document.getElementById('loginEmail');
        this.loginPassword = document.getElementById('loginPassword');
        this.regEmail = document.getElementById('regEmail');
        this.regPassword = document.getElementById('regPassword');
        this.regPasswordConfirm = document.getElementById('regPasswordConfirm');
        this.resetEmail = document.getElementById('resetEmail');

        // Правила проверки пароля
        this.passwordChecks = {
            length: (password) => password.length >= 8,
            lowercase: (password) => /[a-z]/.test(password),
            uppercase: (password) => /[A-Z]/.test(password),
            number: (password) => /\d/.test(password),
            special: (password) => /[!@#$%^&*]/.test(password)
        };

        this.initialize();
    }

    initialize() {
        this.setupPasswordToggles();
        this.setupPasswordValidation();
        this.setupFormValidation();
        this.setupModalSwitching();
    }

    setupPasswordToggles() {
        document.querySelectorAll('.password-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const field = button.closest('.password-field');
                const input = field.querySelector('input');
                const icon = button.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }

    setupPasswordValidation() {
        if (!this.regPassword) return;

        const validatePassword = () => {
            const password = this.regPassword.value;
            const requirements = this.registerForm.querySelectorAll('.requirement');

            requirements.forEach(req => {
                const type = req.dataset.requirement;
                if (!type || !this.passwordChecks[type]) return;

                const isValid = this.passwordChecks[type](password);
                
                if (isValid && !req.classList.contains('valid')) {
                    req.classList.add('valid');
                } else if (!isValid && req.classList.contains('valid')) {
                    req.classList.remove('valid');
                }
            });

            if (this.regPasswordConfirm.value) {
                this.validatePasswordMatch();
            }
        };

        this.regPassword.addEventListener('input', validatePassword);
        this.regPassword.addEventListener('focus', validatePassword);

        this.regPasswordConfirm.addEventListener('input', () => {
            this.validatePasswordMatch();
        });
    }

    validatePasswordMatch() {
        const password = this.regPassword.value;
        const confirmPassword = this.regPasswordConfirm.value;

        if (confirmPassword === '') {
            this.regPasswordConfirm.classList.remove('is-valid', 'is-invalid');
        } else {
            const isMatch = password === confirmPassword;
            this.regPasswordConfirm.classList.toggle('is-valid', isMatch);
            this.regPasswordConfirm.classList.toggle('is-invalid', !isMatch);
        }
    }

    setupFormValidation() {
        // Валидация формы входа
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateLoginForm()) {
                    this.handleLogin();
                }
            });
        }

        // Валидация формы регистрации
        if (this.registerForm) {
            this.registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateRegisterForm()) {
                    this.handleRegistration();
                }
            });
        }

        // Валидация формы восстановления пароля
        if (this.forgotPasswordForm) {
            this.forgotPasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.validateForgotPasswordForm()) {
                    this.handlePasswordReset();
                }
            });
        }
    }

    validateLoginForm() {
        let isValid = true;

        // Валидация email
        if (!this.loginEmail.value || !this.validateEmail(this.loginEmail.value)) {
            this.loginEmail.classList.add('is-invalid');
            isValid = false;
        } else {
            this.loginEmail.classList.remove('is-invalid');
            this.loginEmail.classList.add('is-valid');
        }

        // Валидация пароля
        if (!this.loginPassword.value) {
            this.loginPassword.classList.add('is-invalid');
            isValid = false;
        } else {
            this.loginPassword.classList.remove('is-invalid');
            this.loginPassword.classList.add('is-valid');
        }

        return isValid;
    }

    validateRegisterForm() {
        let isValid = true;

        // Валидация email
        if (!this.regEmail.value || !this.validateEmail(this.regEmail.value)) {
            this.regEmail.classList.add('is-invalid');
            isValid = false;
        } else {
            this.regEmail.classList.remove('is-invalid');
            this.regEmail.classList.add('is-valid');
        }

        // Валидация пароля
        const password = this.regPassword.value;
        const isPasswordValid = Object.values(this.passwordChecks)
            .every(check => check(password));

        if (!isPasswordValid) {
            this.regPassword.classList.add('is-invalid');
            isValid = false;
        } else {
            this.regPassword.classList.remove('is-invalid');
            this.regPassword.classList.add('is-valid');
        }

        // Валидация подтверждения пароля
        if (password !== this.regPasswordConfirm.value) {
            this.regPasswordConfirm.classList.add('is-invalid');
            isValid = false;
        }

        // Валидация согласия с условиями
        const agreeTerms = document.getElementById('agreeTerms');
        if (agreeTerms && !agreeTerms.checked) {
            agreeTerms.classList.add('is-invalid');
            isValid = false;
        }

        return isValid;
    }

    validateForgotPasswordForm() {
        let isValid = true;

        if (!this.resetEmail.value || !this.validateEmail(this.resetEmail.value)) {
            this.resetEmail.classList.add('is-invalid');
            isValid = false;
        } else {
            this.resetEmail.classList.remove('is-invalid');
            this.resetEmail.classList.add('is-valid');
        }

        return isValid;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    setupModalSwitching() {
        // Переключение на форму регистрации
        document.querySelectorAll('.switch-to-register').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('loginModal');
                this.hideModal('forgotPasswordModal');
                setTimeout(() => this.showModal('registerModal'), 150);
            });
        });

        // Переключение на форму входа
        document.querySelectorAll('.switch-to-login').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('registerModal');
                this.hideModal('forgotPasswordModal');
                setTimeout(() => this.showModal('loginModal'), 150);
            });
        });

        // Переключение на форму восстановления пароля
        document.querySelectorAll('.forgot-password').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideModal('loginModal');
                setTimeout(() => this.showModal('forgotPasswordModal'), 150);
            });
        });
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            new bootstrap.Modal(modal).show();
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) {
                bsModal.hide();
            }
        }
    }

    handleLogin() {
        // Здесь будет логика входа
        this.showSuccess(this.loginForm, 'Выполняется вход...');
        setTimeout(() => {
            this.hideModal('loginModal');
            this.resetForm(this.loginForm);
        }, 2000);
    }

    handleRegistration() {
        // Здесь будет логика регистрации
        this.showSuccess(this.registerForm, 'Регистрация успешно завершена!');
        setTimeout(() => {
            this.hideModal('registerModal');
            this.resetForm(this.registerForm);
        }, 2000);
    }

    handlePasswordReset() {
        // Здесь будет логика восстановления пароля
        this.showSuccess(this.forgotPasswordForm, 'Инструкции по восстановлению пароля отправлены на ваш email');
        setTimeout(() => {
            this.hideModal('forgotPasswordModal');
            this.resetForm(this.forgotPasswordForm);
        }, 2000);
    }

    resetForm(form) {
        form.reset();
        
        form.querySelectorAll('.requirement').forEach(req => {
            req.classList.remove('valid');
        });

        form.querySelectorAll('input').forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
            if (input.type === 'text' && input.closest('.password-field')) {
                input.type = 'password';
            }
        });

        form.querySelectorAll('.password-toggle i').forEach(icon => {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        });

        form.querySelectorAll('.alert').forEach(alert => {
            alert.remove();
        });
    }

    showError(form, message) {
        this.removeAlerts(form);
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger mt-3';
        alert.textContent = message;
        form.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }

    showSuccess(form, message) {
        this.removeAlerts(form);
        const alert = document.createElement('div');
        alert.className = 'alert alert-success mt-3';
        alert.textContent = message;
        form.appendChild(alert);
    }

    removeAlerts(form) {
        form.querySelectorAll('.alert').forEach(alert => alert.remove());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AuthModalsHandler();
});
