import { excludeElement} from "./element/element";
import { ColorClass, DarkModeBackground, DarkModeText } from "./models/dark-mode-classes";
import { CLASS_PREFIX as prefix } from "./constants/class-prefix";

export type RGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
}

const body: HTMLBodyElement | null = document.querySelector('body');

/**
 * Test
 *
 * @param body - The html body element
 */
function setDarkMode(body: HTMLBodyElement): void {
    const elements: NodeListOf<Element> = body.querySelectorAll('*');
    elements.forEach(element => {
        addDarkModeClass(element);
    });
    body.classList.add(prefix + 'active')
}

export function addDarkModeClass(element: Element): void {
    if (excludeElement(element)) {
        return
    }
    addBackgroundClass(element);
    addTextClass(element);
}

export function addBackgroundClass(element: Element): void {
    const backgroundColor: string = getComputedStyle(element).backgroundColor;
    const backgroundRgba: RGBA | undefined = getRgba(backgroundColor);
    if (!backgroundRgba) {
        return
    }
    const {r, g, b, a } = backgroundRgba
    if (r === g && r === b) {
        const backgroundClass = prefix + getClassForGrayscaleElements(r, a)
        element.classList.add(backgroundClass);
    } else {
        const coloredClass = prefix + getClassForColoredElements(r, g, b, a, 'background')
        element.classList.add(coloredClass)
    }
}

export function addTextClass(element: Element): void {
    const textColor = getComputedStyle(element).color;
    const textRgba: RGBA | undefined = getRgba(textColor);
    if (!textRgba) {
        return;
    }
    const {r, g, b, a} = textRgba
    if (r !== g || r !== b) {
        const textClass = prefix + getClassForColoredElements(r, g, b, a, 'text')
        element.classList.add(textClass)
    }
}

export function getRgba(colorString: string): undefined | RGBA {

    const rgbaStrings = colorString.split('(')[1]?.split(')')[0]?.split(',');

    if (!rgbaStrings) {
        return;
    }
    const a: number = Number(rgbaStrings[3]);
    if (a === 0) {
        return;
    }
    const r: number = Number(rgbaStrings[0]);
    const g: number = Number(rgbaStrings[1]);
    const b: number = Number(rgbaStrings[2]);

    return { r, g, b, a};
}

export function getClassForColoredElements(r: number, g: number, b: number, a: number, type: ColorClass): DarkModeBackground | DarkModeText {
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

export function getClassForGrayscaleElements(grayscale: number, alpha: number): DarkModeBackground {
    const currentGrayScale: number = isNaN(alpha) ? grayscale : grayscale * alpha;
    if (currentGrayScale < 51) {
        return 'light';
    }
    if (currentGrayScale < 102) {
        return  'light-mid';
    }
    if (currentGrayScale < 153) {
        return 'keep-background'
    }
    if (currentGrayScale < 204) {
        return 'dark-mid'
    }
    if (currentGrayScale <= 255) {
        return 'dark'
    }
    return 'keep-background'
}

// Only check for added nodes
const mutationConfig = { attributes: true, childList: true, subtree: true };

// For each added node, add dark mode class
export const setDarkModeForNewElements = (mutationList: MutationRecord[]) => {
    for (const mutation of mutationList) {
        const addedNodes = mutation.addedNodes;
        if (addedNodes.length) {
            addedNodes.forEach((element: Element) => {
                addDarkModeClass(element);
            })
        }
    }
};

const observer: MutationObserver = new MutationObserver(setDarkModeForNewElements);

chrome.runtime.onMessage.addListener((message) => {
    if (
        message.mode === 'dark' &&
        body &&
        !body.classList.contains(prefix + 'active')
    ) {
        setDarkMode(body);
        observer.observe(body, mutationConfig);
    }
    if (
        message.mode === 'light' &&
        body &&
        body.classList.contains(prefix + 'active')
    ) {
        body.classList.remove(prefix + 'active')
        observer.disconnect();
    }
});