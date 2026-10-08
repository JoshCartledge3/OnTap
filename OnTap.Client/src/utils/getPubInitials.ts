export function getPubInitials(name: string): string {
    const words = name.trim().split(/\s+/).filter(word => word && word.toLowerCase() !== 'and');
    const initialWords = words[0]?.toLowerCase() === 'the' && words.length > 2
        ? words.slice(1)
        : words;

    return initialWords.slice(0, 2).map(word => word[0]).join('').toUpperCase();
}
