const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const { donwloadImage , saveImage } = require('../controllers/ImageMasterController');

router.post('/uploads/:image', bodyParser.raw({ limit: '10mb', type: 'image/*' }), saveImage);

router.get('/uploads/:image', donwloadImage);

router.head('uploads/:image', (req, res) => {
    fs.access(path.join(req.localpath), fs.constants.R_OK, (err) => {
        res.status(err ? 404 : 200).end();
    });
});

router.param('image', (req, res, next, image) => {
    if(!image.match(/\.(png|jpg)$/i)) {
        return res.status(403).send('Invalid image type');
    }
    req.image = image;
    req.localpath = path.join(__dirname, '..\\..\\uploads', image);
    next();
});


module.exports = router;