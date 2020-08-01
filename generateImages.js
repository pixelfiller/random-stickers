const fs = require("fs");

const { 
    getRandomImageLink 
} = require('./getRandomImageLink');

const {
    clearCanvas,
    loadImage,
    context,
    canvas,
} = require('./createCanvas');


var imagesData = []

function getRandomImage() {
    var imageURL = getRandomImageLink();
    return new Promise((resolve) => {
        loadImage(imageURL).then((image) => {
            if (image.width == 161) {
                getRandomImage();
            } else {
                resolve(image);
                console.log(imageURL);
                clearCanvas();
                context.drawImage(image, 0, 0, image.width, image.height,
                    0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL();
                imagesData.push(imageData)
                // Save canvas image
                var buffer = canvas.toBuffer();
                fs.writeFileSync(`${imageURL.split("https://i.imgur.com/").pop()}`, buffer);
            }
        });
    });   
}

function generateImages() {
    imagesData = [];
    for (i = 0; i < 30; i++) {
        getRandomImage();
    }
}
generateImages();


function getImagesData() {
    console.log(imagesData.length)
}
setTimeout(getImagesData, 10000)



// async function getRandomImage() {
//     var imageURL = getRandomImageLink();
//     const image = await loadImage(imageURL);
//     return image
// }


// async function getRandomImage() {
//     var imageURL = getRandomImageLink();
//     await loadImage(imageURL).then((image) => {
//         if (image.width == 161) {
//             getRandomImage();
//         } else {
//             return image
//         }
//     });
// }


// async function generateImages(linksNumber) {
//     var images = []
//     for (i = 0; i < linksNumber; i++) {
//         const image = await getRandomImage()
//         images.push(image);
//     }
//     return Promise.all(images)
//     .then(() => {
//         console.log("All done", images);
//     });
// }

// generateImages(10)

