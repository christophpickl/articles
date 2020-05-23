import {Tags} from "../domain";

export class TagFontSizer {

    private static readonly MIN_FONT_SIZE = 8;
    private static readonly MAX_FONT_SIZE = 15;
    private static readonly DEFAULT_FONT_SIZE = "11pt";
    private static readonly DIF_FONT_SIZE = TagFontSizer.MAX_FONT_SIZE - TagFontSizer.MIN_FONT_SIZE;
    private readonly sizes: Map<number, string>

    constructor(tags: Tags) {
        this.sizes = new Map();

        let counts = tags.counts;
        let minCount = counts[0];
        let maxCount = counts[counts.length - 1];
        let globalCountDif = maxCount - minCount;
        tags.forEach((any, count) => {
            this.sizes[count] = TagFontSizer.calculateFontSize(count, minCount, globalCountDif);
        });
    }

    public sizeFor(count: number): string {
        return this.sizes[count]!
    }

    private static calculateFontSize(count: number, min: number, globalCountDif: number): string {
        if (globalCountDif == 0) {
            return TagFontSizer.DEFAULT_FONT_SIZE;
        }
        let countDif = count - min;
        let difMultiplicator = countDif / globalCountDif;
        let result = TagFontSizer.DIF_FONT_SIZE * difMultiplicator + TagFontSizer.MIN_FONT_SIZE;
        return result + "pt";
    }
}