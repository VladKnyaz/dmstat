export const NumericArrayToPercantageArr = (list: number[]) => {
    var total = 0;
    for (var i = 0; i < list.length; i++) {
        total += list[i];
    }
    return list.map((x: number) => {
        return parseFloat(((x * 100) / total).toFixed(2));
    });
}