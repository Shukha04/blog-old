const modules = {
  multer: require('multer'),
  slugify: require('slugify')
}

const storage = modules.multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '../sources/img/articles')
  },
  filename(req, file, cb) {
    const imgType = file.originalname.split('.').reverse()
    cb(null, modules.slugify(req.body.articleTitle({
      replacement: '_',
      remove: undefined,
      lower: true,
      strict: true,
      locale: 'en'
    })) + '.' + imgType[0])
  }
})

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = modules.multer({
  storage,
  fileFilter
})