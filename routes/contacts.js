const modules = {
  router: require('express').Router()
}

modules.router.get('/', async (req, res) => {
  res.render('contacts/index', {
    pageTitle: 'Контакты',
    isContacts: true
  })
})

module.exports = modules.router