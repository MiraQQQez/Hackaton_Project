// Оптимизированные функции для работы с cookie и localStorage
const StorageManager = {
    // Cookie функции
    setCookie(name, value, days) {
        const expires = days 
            ? `; expires=${new Date(Date.now() + days * 864e5).toUTCString()}`
            : '';
        document.cookie = `${name}=${value || ''}${expires}; path=/`;
    },

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        return parts.length === 2 ? parts.pop().split(';').shift() : null;
    },

    // LocalStorage функции с проверкой доступности
    isLocalStorageAvailable() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    },

    // Сохранение состояния загрузки скриптов
    saveScriptState(scriptName, state) {
        if (this.isLocalStorageAvailable()) {
            localStorage.setItem(`script_${scriptName}`, state);
        } else {
            this.setCookie(`script_${scriptName}`, state, 1);
        }
    },

    // Проверка состояния загрузки скрипта
    getScriptState(scriptName) {
        if (this.isLocalStorageAvailable()) {
            return localStorage.getItem(`script_${scriptName}`);
        }
        return this.getCookie(`script_${scriptName}`);
    }
};

// Экспортируем для использования в других скриптах
window.StorageManager = StorageManager;