import {mapOf, sortMapByKey, tuple} from "../src/common";

describe('sortMapByKey', function() {
    it('some numbers', function() {
        const map = mapOf(
            tuple(3, ""),
            tuple(1, ""),
            tuple(2, "")
        );
        let result = sortMapByKey(map);
        expect(Array.from(result.keys())).toEqual([1, 2, 3]);
    });
    it('empty', function() {
        let result = sortMapByKey(new Map<any, any>());

        expect(result.size).toEqual(0);
    });
});
