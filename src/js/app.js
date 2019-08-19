// Copyright (C) 2018 Théotime Loiseau
//
// This file is part of QuestionsBox.
//
// QuestionsBox is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// QuestionsBox is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with QuestionsBox.  If not, see <http://www.gnu.org/licenses/>.
//

import React from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import winston from 'winston';
import electron from 'electron';

import withRecorder from './components/containers/WebRTCContainer.js';
import App from './components/App.js';
import '../sass/main.scss';

// Add a logger
window.logger = winston.createLogger({
    level: 'warn',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: electron.remote.getGlobal('paths').error }),
        new winston.transports.Console({ level: 'info' })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: electron.remote.getGlobal('paths').error }),
        new winston.transports.Console()
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
