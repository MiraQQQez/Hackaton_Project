'use strict';

/**
 * Базовый менеджер для будущей интеграции с картами
 * @copyright Igor Silin
 */
const MapManager = {
    /**
     * Флаг инициализации
     * @type {boolean}
     */
    _initialized: false,

    /**
     * Инициализация менеджера карт
     * @returns {void}
     */
    initialize() {
        if (this._initialized) {
            return;
        }
        
        try {
            console.log('Map manager initialized');
            this._initialized = true;
        } catch (error) {
            console.error('Ошибка при инициализации Map Manager:', error);
        }
    },

    /**
     * Проверка статуса инициализации
     * @returns {boolean}
     */
    isInitialized() {
        return this._initialized;
    }
};

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    try {
        MapManager.initialize();
    } catch (error) {
        console.error('Ошибка при инициализации MapManager:', error);
    }
});

// Экспортируем для использования в других модулях
window.mapManager = MapManager;