
require('dotenv').config();
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const ownerId = parseInt(process.env.ADMIN_ID, 10);

const { 
    getRandomImageLink 
} = require('./getRandomImageLink');

const {
    removeUdentifiedImages
} = require('./utils')

const {
    clearCanvas,
    loadImage,
    context,
    canvas,
} = require('./createCanvas');

const stickerSetName = `random_images_stickers_12c4f`;
const stickersNumber = 30


function getRandomEmoji() {
    const emojis = ["✌", "😂", "😝", "😁", "😱", "👉", "🙌", "🍻", "🔥", "🌈", "🎈", "🌹", "💄", "🎀", "⚽", "🎾", "🏁", "😡", "👿", "🐻", "🐶", "🐬", "🐟", "🍀", "👀", "🚗", "🍎", "💝", "💙", "👌", "❤", "😍", "😉", "😓", "😳", "💪", "💩", "🍸", "🔑", "💖", "🌟", "🎉", "🌺", "🎶", "👠", "🏈", "⚾", "🏆", "👽", "💀", "🐵", "🐮", "🐩", "🐎", "💣", "👃", "👂", "🍓", "💘", "💜", "👊", "💋", "😘", "😜", "😵", "🙏", "👋", "🚽", "💃", "💎", "🚀", "🌙", "🎁", "⛄", "🌊", "⛵", "🏀", "🎱", "💰", "👶", "👸", "🐰", "🐷", "🐍", "🐫", "🔫", "👄", "🚲", "🍉", "💛", "💚"];
    let emoji = emojis[Math.floor(Math.random() * emojis.length)];
    return emoji
}

var imagesData = []

function getRandomImage() {
    var imageURL = getRandomImageLink();
    return new Promise((resolve) => {
        loadImage(imageURL).then((image) => {
            if (image.width == 161) {
                getRandomImage();
            } else {
                resolve(image);
                clearCanvas();
                context.drawImage(image, 0, 0, image.width, image.height,
                    0, 0, canvas.width, canvas.height);
                const imageData = canvas.toDataURL();
                imagesData.push(imageData)
            }
        });
    });   
}


async function getEmptySticker() {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL();
    let result = Buffer.from(imageData.split(",")[1], 'base64');
    const file = await bot.telegram.uploadStickerFile(ownerId, {
        source: result
    })
    return file.file_id
}

function generateImages() {
    imagesData = [];
    for (i = 0; i < stickersNumber + 10; i++) {
        getRandomImage();
    }
}

generateImages()
bot.start(async ctx => {
    if (ctx.message.from.id !== 131486733) {
        return false
      }
    try {
        const botUsername = 'randomGenerative_bot';
        const stickerSet = await bot.telegram.getStickerSet(
            `${stickerSetName}_by_${botUsername}`
        )
        stickersData = []
        stickersData = stickerSet.stickers
        const stikersDataIDs = await stickersData.map(element => element.file_id);
        for (let i = 0; i < stikersDataIDs.length; i++) {
            await bot.telegram.deleteStickerFromSet(stikersDataIDs[i])
        }
        await bot.telegram.addStickerToSet(
            ownerId,
            `${stickerSetName}_by_${botUsername}`, {
            png_sticker: await getEmptySticker(),
            emojis: getRandomEmoji(),
            mask_position: undefined,
        },
            false
        )
        const sticker = stickerSet.stickers[0];
        return ctx.replyWithSticker(sticker.file_id);
    } catch (err) {
        return ctx.reply(err.message);
    }
})


setTimeout(uploadStickers, 30000)
async function uploadStickers() {
    const botUsername = 'randomGenerative_bot'
    for (let i = 0; i < stickersNumber - 1; i++) {
        const stickerSet = await bot.telegram.getStickerSet(
            `${stickerSetName}_by_${botUsername}`
        )
        await bot.telegram.addStickerToSet(
            ownerId,
            `${stickerSetName}_by_${botUsername}`, {
            png_sticker: await getStickerFile(i),
            emojis: getRandomEmoji(),
            mask_position: undefined,
        },
            false
        )
    }
}

setInterval(generateImages, 250000)
setInterval(updateStickers, 300000)
async function updateStickers() {
    console.log('Updating stickers...')
    const botUsername = 'randomGenerative_bot'
    const stickerSet = await bot.telegram.getStickerSet(
        `${stickerSetName}_by_${botUsername}`
    )
    let stickersData = []
    console.log(imagesData.length) // >= stikersDataIDs.length
    // check if there is "udentified" in array
    removeUdentifiedImages(imagesData);

    stickersData = await stickerSet.stickers
    const stikersDataIDs = await stickersData.map(element => element.file_id);
    for (let i = 0; i < stikersDataIDs.length; i++) {

        await bot.telegram.deleteStickerFromSet(stikersDataIDs[i]) // fix: Error: 400: Bad Request: sticker is not specified
        await bot.telegram.addStickerToSet(
            ownerId,
            `${stickerSetName}_by_${botUsername}`, {
            png_sticker: await getStickerFile(i), 
            emojis: getRandomEmoji(),
            mask_position: undefined,
        },
            false
        )
    }
    console.log('Stickers updated successfully on: ' + Date(Date.now()).toString())
}


async function getStickerFile(i) {
    let result = Buffer.from(imagesData[i].split(",")[1], 'base64'); // fix: TypeError: Cannot read property 'split' of undefined
    const file = await bot.telegram.uploadStickerFile(ownerId, {
        source: result
    })
    return file.file_id
}


bot.launch()


