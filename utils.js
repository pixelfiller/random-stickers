
module.exports = {
    removeUdentifiedImages: function removeUdentifiedImages(arr) {
        var i = 0;
        while (i < arr.length) {
            if (arr[i] === "undefined") {
                arr.splice(i, 1);
            } else {
                ++i;
            }
        }
        return arr;
    },
}