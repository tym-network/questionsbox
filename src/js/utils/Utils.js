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
            if (err && err.code !== 'ENOENT') {
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