import {Tags} from "../domain";

export class TagFontSizer {

    private static readonly MIN_FONT_SIZE = 9;
    private static readonly MAX_FONT_SIZE = 18;
    private static readonly DEFAULT_FONT_SIZE = 11;
    private static readonly DIF_FONT_SIZE = TagFontSizer.MAX_FONT_SIZE - TagFontSizer.MIN_FONT_SIZE;
    private readonly sizes: Map<number, number>

    constructor(tags: Tags) {
        this.sizes = new Map();

        let counts = tags.counts;
        let minCount = counts[0];
        let maxCount = counts[counts.length - 1];

        tags.forEach((any, count) => {
            this.sizes[count] = TagFontSizer.calculateFontSize(count, minCount, maxCount);
        });
    }

    public sizeFor(count: number): number {
        return this.sizes[count]!
    }

    private static calculateFontSize(count: number, min: number, max: number): number {
        console.log("count: " + count + " min: " + min + " max: " + max);
        let globalCountDif = max - min;
        if (globalCountDif == 0) {
            return TagFontSizer.DEFAULT_FONT_SIZE;
        }
        let countDif = count - min;
        let difMultiplicator = 100 * countDif / globalCountDif / 100.0;
        let result = TagFontSizer.DIF_FONT_SIZE * difMultiplicator + TagFontSizer.MIN_FONT_SIZE;
        return parseInt(result.toString());
    }
}