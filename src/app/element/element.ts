import { CLASS_PREFIX } from "../constants/class-prefix";

/**
 * Returns true if a node does not need any dark mode styling added
 *
 * Examples
 *  - textNode
 *  - comment
 *  - Elements that already have dark mode styling applied
 */
export function excludeElement(node: Node | null): boolean {
    if (!node) {
        return true
    }
    if (node.nodeType !== 1) {
        return true
    }
    if (node instanceof Element) {
        return Array.from(node.classList).some(className => className.includes(CLASS_PREFIX));
    }
    return true
}
