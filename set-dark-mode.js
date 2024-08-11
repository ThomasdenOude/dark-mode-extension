"use strict";
const prefix = 'dm-ext-';
const body = document.querySelector('body');
function excludeElement(element) {
    if (!element) {
        return true;
    }
    const exclude = element.nodeType !== 1 ||
        element instanceof HTMLImageElement;
    if (exclude) {
        return true;
    }
    return Array.from(element.classList).some(className => className.includes('dm-ext-'));
}
function setDarkMode(body) {
    const elements = body.querySelectorAll('*');
    elements.forEach(element => {
        addDarkModeClass(element);
    });
    body.classList.add(prefix + 'active');
}
function addDarkModeClass(element) {
    if (excludeElement(element)) {
        return;
    }
    addBackgroundClass(element);
    addTextClass(element);
}
function addBackgroundClass(element) {
    const backgroundColor = getComputedStyle(element).backgroundColor;
    const backgroundRgba = getRgba(backgroundColor);
    if (!backgroundRgba) {
        return;
    }
    const { r, g, b, a } = backgroundRgba;
    if (r === g && r === b) {
        const backgroundClass = prefix + getClassForGrayscaleElements(r, a);
        element.classList.add(backgroundClass);
    }
    else {
        const coloredClass = prefix + getClassForColoredElements(r, g, b, a, 'background');
        element.classList.add(coloredClass);
    }
}
function addTextClass(element) {
    const textColor = getComputedStyle(element).color;
    const textRgba = getRgba(textColor);
    if (!textRgba) {
        return;
    }
    const { r, g, b, a } = textRgba;
    if (r !== g || r !== b) {
        const textClass = prefix + getClassForColoredElements(r, g, b, a, 'text');
        element.classList.add(textClass);
    }
}
function getRgba(colorString) {
    var _a, _b;
    const rgbaStrings = (_b = (_a = colorString.split('(')[1]) === null || _a === void 0 ? void 0 : _a.split(')')[0]) === null || _b === void 0 ? void 0 : _b.split(',');
    if (!rgbaStrings) {
        return;
    }
    const a = Number(rgbaStrings[3]);
    if (a === 0) {
        return;
    }
    const r = Number(rgbaStrings[0]);
    const g = Number(rgbaStrings[1]);
    const b = Number(rgbaStrings[2]);
    return { r, g, b, a };
}
function getClassForColoredElements(r, g, b, a, type) {
    if (!isNaN(a)) {
        r = r * a;
        g = g * a;
        b = b * a;
    }
    if (r < 51 && g < 51 && b < 51) {
        return type === 'background' ? 'light' : 'dark-text';
    }
    if (type !== 'text' && r > 204 && g > 204 && b > 204) {
        return type === 'background' ? 'dark-mid' : 'light-text';
    }
    return type === 'background' ? 'keep-background' : 'keep-text';
}
function getClassForGrayscaleElements(grayscale, alpha) {
    const currentGrayScale = isNaN(alpha) ? grayscale : grayscale * alpha;
    if (currentGrayScale < 51) {
        return 'light';
    }
    if (currentGrayScale < 102) {
        return 'light-mid';
    }
    if (currentGrayScale < 153) {
        return 'keep-background';
    }
    if (currentGrayScale < 204) {
        return 'dark-mid';
    }
    if (currentGrayScale <= 255) {
        return 'dark';
    }
    return 'keep-background';
}
const mutationConfig = { attributes: true, childList: true, subtree: true };
const setDarkModeForNewElements = (mutationList) => {
    for (const mutation of mutationList) {
        const addedNodes = mutation.addedNodes;
        if (addedNodes.length) {
            addedNodes.forEach((element) => {
                addDarkModeClass(element);
            });
        }
    }
};
const observer = new MutationObserver(setDarkModeForNewElements);
chrome.runtime.onMessage.addListener((message) => {
    if (message.mode === 'dark' && body) {
        setDarkMode(body);
        observer.observe(body, mutationConfig);
    }
    if (message.mode === 'light' && body) {
        body.classList.remove(prefix + 'active');
        observer.disconnect();
    }
});
