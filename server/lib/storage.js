const multer = require('multer');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(!fs.existsSync('./storage')){
            fs.mkdirSync('./storage',{recursive:true});
            console.log("Carpeta creada");
        }
        cb(null, './storage')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
 //       cb(null, file.fieldname + '-' + uniqueSuffix + '.jpg')
        cb(null, `imagen.jpg`);
    }
})

const upload = multer({ storage: storage })

module.exports = upload;