
module.exports = {
    getRandomImageLink: function getRandomImageLink() {
        var chars = '01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
        var stringlength = 5;
        var text = '';
        for (var i = 0; i < stringlength; i++) {
          var rnum = Math.floor(Math.random() * chars.length);
          text += chars.substring(rnum, rnum + 1);
        }
        var imageLink = 'https://i.imgur.com/' + text + 's' + '.png';
        
        return imageLink
    },
}
