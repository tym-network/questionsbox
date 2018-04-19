import React from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import winston from 'winston';
import electron from 'electron';

import withRecorder from './components/containers/WebRTCContainer.js';
import App from './components/App.js';
import '../sass/main.scss';

// Add a logger
window.logger = new winston.Logger({
    level: 'warn',
    format: 'json',
    transports: [
        new winston.transports.File({ filename: electron.remote.getGlobal('paths').error }),
        new winston.transports.Console({ format: 'simple', level: 'info' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: electron.remote.getGlobal('paths').error }),
        new winston.transports.Console({ format: 'simple' })
    ],
    exitOnError: false
});

// Setup translations
window.locales = ['en', 'fr'];
const resources = {};
window.locales.forEach(locale => {
    resources[locale] = require(`./translations/${locale}.json`);
});

// Disable right click
document.body.addEventListener('contextmenu', function(ev) {
    ev.preventDefault();
    return false;
});

i18next.init(
    {
        lng: 'en',
        fallbackLng: 'en',
        debug: false,
        whitelist: window.locales,
        ns: 'default',
        defaultNS: 'default',
        resources: resources
    }, function(err) {
        if (err) {
            window.logger.err('Unable to fetch translations', err);
        }

        // Init the app
        const wrapper = document.getElementById("app");

        if (wrapper) {
            const AppWithRecorder = withRecorder(App);
            ReactDOM.render(
                <AppWithRecorder />
            , wrapper);
        }
    }
);
