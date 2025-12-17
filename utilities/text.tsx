export function splitParagraphs(text: string): string[] {
    if (!text) {
        return [];
    }
    return text.split('|:::|');
}

export function capitalize(text: string): string {
    if (!text) {
        return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1);
}
