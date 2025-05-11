export function splitParagraphs(text: string): string[] {
    if (!text) {
        return [];
    }
    return text.split('|:::|');
}
