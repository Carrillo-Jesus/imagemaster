const sharp = require('sharp');
const fs = require('fs');
const path = require('path');


function donwloadImage(req, res) {
    fs.access(req.localpath, fs.constants.R_OK, (err) => {
        if(err) return res.status(404).end();

        let image = sharp(req.localpath);

        if (req.width && req.height) {
            image.resize({
                width: req.width,
                height: req.height,
                withoutEnlargement: true
            });
        } else if (req.width || req.height) {
            image.resize(req.width, req.height);
        }

        if (req.grayscale) {
            image.grayscale();
        }

        res.setHeader('Content-Type', `image/${path.extname(req.image).slice(1)}`);

        image.pipe(res);

    });
}

function saveImage(req, res) {
    let fd = fs.createWriteStream(path.join(req.localpath),{
        flags: 'w+',
        encoding: 'binary'
    });

    fd.end(req.body);

    fd.on('close', () => {
        res.status(200).send( { status: 'OK', size: req.body.length } );
    });
}
module.exports = {
    donwloadImage,
    saveImage
};