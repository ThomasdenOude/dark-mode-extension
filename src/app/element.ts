function excludeElement(node: Node | Element | null): boolean {
    if (!node) {
        return true
    }
    if (node.nodeType !== 1) {
        return true
    }
    if (node instanceof Element) {
        return Array.from(node.classList).some(className => className.includes('dm-ext-'));
    }
    return true
}

export {
    excludeElement
}