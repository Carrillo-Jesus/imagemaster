const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const arrayValidGrayscale = ['true', '1', 'on', 'yes', 'y'];
const arrayValidFit = ['cover', 'contain', 'fill', 'inside', 'outside'];
const arrayValidFlop = ['true', '1', 'on', 'yes', 'y'];
const arrayValidFlip = ['true', '1', 'on', 'yes', 'y'];
const arrayValidNegative = ['true', '1', 'on', 'yes', 'y'];

function donwloadImage(req, res) {
    fs.access(req.localpath, fs.constants.R_OK, (err) => {
        if(err) return res.status(404).end();

        let image =     sharp(req.localpath);
        let width =     +req.query.width;
        let height =    +req.query.height;
        let grayscale = arrayValidGrayscale.includes(req.query.grayscale);
        let fit =       arrayValidFit.includes(req.query.fit);
        let rotate =    +req.query.rotate;
        let flop =      arrayValidFlop.includes(req.query.flop);
        let flip =      arrayValidFlip.includes(req.query.flip);
        let negative =  arrayValidNegative.includes(req.query.negative);
        let blur =      +req.query.blur;

        if ( width > 0 && height > 0) image.resize( width, height,
                { 
                    withoutEnlargement: true,
                    fit: fit ? req.query.fit : 'cover',  
                });
         else if ( width || height ) image.resize(width || null, height || null);

        if (grayscale) image.grayscale();

        if(rotate > 0 && rotate <= 360) image.rotate(rotate);
        
        if(flop) image.flop();

        if(flip) image.flip();

        if(negative) image.negate({ alpha: false });

        if(blur >= 0.3 && blur <= 1000) image.blur(blur);

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