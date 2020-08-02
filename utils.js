
module.exports = {
    removeUndefinedImages: function removeUndefinedImages(arr) {
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
    getTimestamp: function getTimestamp() {
        return Date(Date.now()).toString()
    }
}