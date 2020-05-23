import {Tags} from "../domain";

export class TagFontSizer {

    private static readonly MIN_FONT_SIZE = 8;
    private static readonly MAX_FONT_SIZE = 15;
    private static readonly DEFAULT_FONT_SIZE = "11pt";
    private static readonly DIF_FONT_SIZE = TagFontSizer.MAX_FONT_SIZE - TagFontSizer.MIN_FONT_SIZE;

    private readonly sizes: Map<number, string> = new Map();

    constructor(tags: Tags) {
        const minMax = tags.getMinMax();
        const globalCountDif = minMax.y - minMax.x;
        tags.forEach((_, count) => {
            this.sizes.set(count, TagFontSizer.calculateFontSize(count, minMax.x, globalCountDif));
        });
    }

    public sizeFor(count: number): string {
        const size = this.sizes.get(count);
        if (size === undefined) {
            throw new Error("No font size stored for count: " + count);
        }
        return size;
    }

    private static calculateFontSize(count: number, min: number, globalCountDif: number): string {
        if (globalCountDif == 0) {
            return TagFontSizer.DEFAULT_FONT_SIZE;
        }
        const countDif = count - min;
        const difMultiplicator = countDif / globalCountDif;
        const result = TagFontSizer.DIF_FONT_SIZE * difMultiplicator + TagFontSizer.MIN_FONT_SIZE;
        return result + "pt";
    }
}