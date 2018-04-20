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