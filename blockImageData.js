const {
    clearCanvas,
    loadImage,
    context,
    canvas,
} = require('./createCanvas');


function getImage(imageURL) {
    return new Promise((resolve) => {
        loadImage(imageURL).then((image) => {
            clearCanvas();
            context.drawImage(image, 0, 0, image.width, image.height,
                0, 0, canvas.width, canvas.height);
            const imageData = canvas.toDataURL();
            resolve(imageData);
            console.log(imageData);
        });
    });   
}

getImage('https://i.imgur.com/7D01os.png');

