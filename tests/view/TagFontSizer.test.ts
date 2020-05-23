import {TagFontSizer} from "../../src/view/TagFontSizer";
import {Tags} from "../../src/domain";
import {mapOf, tuple} from "../../src/common";

describe('TagFontSizer', function () {
    it('Given some tags When get different sizes Then return proper point values', function () {
        const map = mapOf(
            tuple("x", 7),
            tuple("y", 1),
            tuple("z", 4)
        );
        const sizer = new TagFontSizer(new Tags(map));

        expect(sizer.sizeFor(1)).toEqual("8pt");
        expect(sizer.sizeFor(4)).toEqual("11.5pt");
        expect(sizer.sizeFor(7)).toEqual("15pt");
    });

    it('Given a single tag When get size Then return default size', function () {
        const map = mapOf(
            tuple("x", 42)
        );
        const sizer = new TagFontSizer(new Tags(map));

        expect(sizer.sizeFor(42)).toEqual("11pt");
    });

    it('When get size for invalid count Then throw', function () {
        const sizer = new TagFontSizer(new Tags(mapOf<string, number>()));

        const action = () => {
            sizer.sizeFor(-1);
        };

        expect(action).toThrow("No font size stored for count: -1");
    });
});
