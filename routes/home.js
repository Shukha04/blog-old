const modules = {
  router: require('express').Router()
}

modules.router.get('/', async (req, res) => {
  res.render('home/index', {
    pageTitle: 'Главная',
    isHome: true
  })
})

module.exports = modules.router