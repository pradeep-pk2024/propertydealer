var multer = require('multer');
const { uuid } = require('uuidv4');

var storage = multer.diskStorage({

    destination: function (req, file, path) {
        path(null, 'public/images');
    },

    filename: function (req, file, path) {
        var fn=uuid()+file.originalname.substring(file.originalname.lastIndexOf("."))

        path(null,fn)
    }

});

var upload = multer({ storage: storage });

module.exports = upload;