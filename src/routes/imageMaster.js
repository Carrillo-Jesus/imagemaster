const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const { donwloadImage , saveImage } = require('../controllers/ImageMasterController');
router.get('/uploads/:width(\\d+)x:height(\\d+)-:grayscale-:image', donwloadImage);
router.get('/uploads/:width(\\d+)x:height(\\d+)-:image', donwloadImage);

router.get('/uploads/_x:height(\\d+)-:grayscale-:image', donwloadImage);
router.get('/uploads/_x:height(\\d+)-:image', donwloadImage);

router.get('/uploads/:width(\\d+)x_-:grayscale-:image', donwloadImage);
router.get('/uploads/:width(\\d+)x_-:image', donwloadImage);

router.get('/uploads/:grayscale-:image', donwloadImage);
router.get('/uploads/:image', donwloadImage);

router.get(/\/thumbnail\.(jpg|png)/, (req, res, next) => {
    let format = req.params[0] === 'jpg' ? 'jpg' : 'png';
    let width = req.query.width || 300;
    let height = req.query.height || 200;
    let border = req.query.border || 5;
    let bgColor = req.query.bgColor || '#ffffff';
    let fgColor = req.query.fgColor || '#cccccc';
    let textColor = req.query.textColor || '#000000';
    let textSize = req.query.textSize || 24;
    
    const thumbnail = new Buffer.from(
        `
        <svg width="${width}" height="${height}">
            <rect 
                width="${width}" height="${height}" 
                fill="${bgColor}" />
            
            <rect
                x="${border}" y="${border}"
                width="${width - border * 2}" height="${height - border * 2}"
                fill="${bgColor}" />

            <line
                x1="${border * 2}" y1="${border * 2}"
                x2="${width - border * 2}" y2="${height - border * 2}"
                stroke-width="${border}" stroke="${fgColor}" />

            <line
                x1="${width - border * 2}" y1="${border * 2}"
                x2="${border * 2}" y2="${height - border * 2}"
                stroke-width="${border}" stroke="${fgColor}" />

            <rect
                x="${border}" y="${(height - textSize)/2}"
                width="${width - border * 2}" height="${textSize}"
                fill="${bgColor}" />

            <text
                x="${width / 2}" y="${height / 2}" dy="8"
                font-family="Arial" font-size="${textSize}"
                fill="${textColor}" text-anchor="middle">${width} x ${height}</text>
        </svg>

        `);

    sharp({
        create: {
            width: width,
            height: height,
            channels: 4,
            background: { r: 255, g: 255, b: 255 }
        }
    })
    .composite([
        {
            input: thumbnail, // Aquí coloca tu SVG válido
            gravity: 'center' // Ajusta la posición de la superposición si es necesario
        }
    ])
    .toFormat(format)
    .pipe(res);

});

router.post('/uploads/:image', bodyParser.raw({ limit: '10mb', type: 'image/*' }), saveImage);

router.head('uploads/:image', (req, res) => {
    fs.access(path.join(req.localpath), fs.constants.R_OK, (err) => {
        res.status(err ? 404 : 200).end();
    });
});

router.param('width', (req, res, next, width) => {
    if(!width.match(/^\d+$/)) {
        return res.status(403).send('Invalid width');
    }
    req.width = parseInt(width, 10);
    next();
});

router.param('height', (req, res, next, height) => {
    if(!height.match(/^\d+$/)) {
        return res.status(403).send('Invalid height');
    }
    req.height = parseInt(height, 10);
    next();
});

router.param('image', (req, res, next, image) => {
    if(!image.match(/\.(png|jpg)$/i)) {
        return res.status(403).send('Invalid image type');
    }
    req.image = image;
    req.localpath = path.join(__dirname, '..\\..\\uploads', image);
    next();
});

router.param('grayscale', (req, res, next, grayscale) => {
    if(grayscale !== 'bw') {
        return res.status(403).send('Invalid grayscale type, use bw');
    }
    req.grayscale = grayscale;
    next();
});


module.exports = router;