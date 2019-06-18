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

import fs from 'fs';

// Import all flags
function importAll (r) {
    r.keys().forEach(r);
}

importAll(require.context('../../assets/img/flags', true, /\.svg$/));

export function throttle(callback, wait, context = this) {
    let timeout = null
    let callbackArgs = null

    const later = () => {
        timeout = null
    }

    return function() {
        if (!timeout) {
            callbackArgs = arguments
            callback.apply(context, callbackArgs)
            timeout = setTimeout(later, wait)
        }
    }
}


// Source https://davidwalsh.name/javascript-debounce-function
export function debounce(callback, wait, immediate) {
    let timeout;

    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) callback.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) callback.apply(context, args);
    };
}

export function readJsonFile(fileName) {
    return new Promise((res, rej) => {
        fs.readFile(fileName, (err, data) => {
            if (err && err.code === 'ENOENT') {
                res(null);
            } else if (err) {
                rej(err);
            }

            try {
                data = JSON.parse(data);
                res(data);
            } catch(err) {
                rej(err);
            }
        });
    });
}

export function getLocales() {
    return [
        { value: 'en', name: 'English', labelKey: 'langEnglish', flag: require('../../assets/img/flags/en.svg') },
        { value: 'fr', name: 'Français', labelKey: 'langFrench', flag: require('../../assets/img/flags/fr.svg') },
        { value: 'es', name: 'Español', labelKey: 'langSpanish', flag: require('../../assets/img/flags/es.svg') },
        { value: 'de', name: 'Deutsch', labelKey: 'langGerman', flag: require('../../assets/img/flags/de.svg') },
        { value: 'it', name: 'Italiano', labelKey: 'langItalian', flag: require('../../assets/img/flags/it.svg') },
        { value: 'ru', name: 'русский', labelKey: 'langRussian', flag: require('../../assets/img/flags/ru.svg') },
        { value: 'pt', name: 'Português', labelKey: 'langPortuguese', flag: require('../../assets/img/flags/pt.svg') },
        { value: 'nl', name: 'Nederlandse', labelKey: 'langDutch', flag: require('../../assets/img/flags/nl.svg') },
        { value: 'sv', name: 'Svenska', labelKey: 'langSwedish', flag: require('../../assets/img/flags/se.svg') },
        { value: 'no', name: 'Norsk', labelKey: 'langNorwegian', flag: require('../../assets/img/flags/no.svg') },
        { value: 'da', name: 'Dansk', labelKey: 'langDanish', flag: require('../../assets/img/flags/dk.svg') },
        { value: 'pl', name: 'Polski', labelKey: 'langPolish', flag: require('../../assets/img/flags/pl.svg') }
    ]
}