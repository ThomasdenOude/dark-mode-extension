import { excludeElement} from "./element";

describe('excludeElement', () => {
    let node: Node | null = null;

    it('returns true if no node provided', () => {
        const result = excludeElement(node);
        // Assert
        expect(result).toBe(true)
    });

    it('returns true if node is a text node', () => {
        node = document.createComment('test');
        const result = excludeElement(node);
        // Assert
        expect(result).toBe(true)
    });

    it('returns true if node is a comment', () => {
        node = document.createComment('test');
        const result = excludeElement(node);
        // Assert
        expect(result).toBe(true)
    });

    it('returns false if node is a HTMLElement without any class added', () => {
        const div = document.createElement('div');
        const result = excludeElement(div);
        // Assert
        expect(result).toBe(false)
    });

    it('returns false if node is a HTMLElement with a normal class added', () => {
        const div = document.createElement('div');
        div.classList.add('some-class');
        const result = excludeElement(div);
        // Assert
        expect(result).toBe(false)
    });
    it('returns true if node is a HTMLElement with a dark mode class added', () => {
        const div = document.createElement('div');
        div.classList.add('some-class', 'dm-ext-dark', 'dm-ext-light');
        const result = excludeElement(div);
        // Assert
        expect(result).toBe(true)
    });
})
