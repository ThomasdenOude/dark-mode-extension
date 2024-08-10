type ColorClass = 'background' | 'text';
type DmBackground = 'dark' | 'dark-mid' | 'light' | 'light-mid' | 'keep-background';
type DmText = 'dark-text' | 'light-text' | 'keep-text';
type RGBA = {
    r: number;
    g: number;
    b: number;
    a: number;
}

const prefix = 'dm-ext-';
const body: HTMLBodyElement | null = document.querySelector('body');

function setDarkMode(body: HTMLBodyElement): void {
    const elements: NodeListOf<Element> = body.querySelectorAll('*');
    elements.forEach(element => {
        addDarkModeClass(element);
    });
    body.classList.add(prefix + 'active')
}

function addDarkModeClass(element: Element): void {
    if (element instanceof HTMLImageElement) {
        return
    }
    addBackgroundClass(element);
    addTextClass(element);
}

function addBackgroundClass(element: Element): void {
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

function addTextClass(element: Element): void {
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

function getRgba(colorString: string): undefined | RGBA {

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

function getClassForColoredElements(r: number, g: number, b: number, a: number, type: ColorClass): DmBackground | DmText {
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

function getClassForGrayscaleElements(grayscale: number, alpha: number): DmBackground {
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

chrome.runtime.onMessage.addListener((message) => {
    if (message.mode === 'dark' && body) {
        setDarkMode(body);
    }
    if (message.mode === 'light' && body) {
        body.classList.remove(prefix + 'active')
    }
});