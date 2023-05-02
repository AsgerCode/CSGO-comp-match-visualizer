import addTime from "./../../src/lib/time";

describe("Time helper function", () => {
    it("should return a date object", () => {
        expect(Object.prototype.toString.call(addTime(new Date(2024, 10, 4, 10, 30, 0), 1, 1, 1))).toEqual("[object Date]");
    });

    it("should correctly add time to a date object", () => {
        const date = new Date(2024, 10, 4, 10, 30, 0);
        const addedDate = addTime(date, 1, 10, 30);

        expect(addedDate.getHours()).toEqual(11);
        expect(addedDate.getMinutes()).toEqual(40);
        expect(addedDate.getSeconds()).toEqual(30);
    });
});