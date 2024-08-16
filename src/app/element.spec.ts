import { excludeElement} from "./element";

describe('excludeElement', () => {
    let node: Node | Element | null = null;

    it('returns true if no node provided', () => {
        // Act
        const result = excludeElement(node);
        // Assert
        expect(result).toBe(true)
    });

    it('returns true if node is a text node', () => {
        // Arrange
        node = document.createComment('test');
        // Act
        const result = excludeElement(node);
        // Assert
        expect(result).toBe(true)
    });

    it('returns true if node is a comment', () => {
        // Arrange
        node = document.createComment('test');
        // Act
        const result = excludeElement(node);
        // Assert
        expect(result).toBe(true)
    });

    it('returns false if node is a HTMLElement without any class added', () => {
        // Arrange
        node = document.createElement('div')
        // Act
        const result = excludeElement(node);
        // Assert
        expect(result).toBe(false)
    });

    it('returns false if node is a HTMLElement with a normal class added', () => {
        // Arrange
        document.body.innerHTML = '<div id="test" class="some-class">test</div>'
        node = document.querySelector('#test');
        // Act
        const result = excludeElement(node);
        // Assert
        expect(result).toBe(false)
    });
    it('returns true if node is a HTMLElement with a dark mode class added', () => {
        // Arrange
        document.body.innerHTML = '<div id="test" class="some-class dm-ext-dark dm-ext-light">test</div>'
        node = document.querySelector('#test');
        // Act
        const result = excludeElement(node);
        // Assert
        expect(result).toBe(true)
    });
})
