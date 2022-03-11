const modules = {
  router: require('express').Router()
}

modules.router.get('/', async (req, res) => {
  res.render('about/index', {
    pageTitle: 'О себе',
    isAbout: true
  })
})

module.exports = modules.router