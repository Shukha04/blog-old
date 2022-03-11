console.time('server')
const modules = {
  path: require('path'),
  allowPrototypeAccess: require('@handlebars/allow-prototype-access'),
  chalk: require('chalk'),
  compression: require('compression'),
  connectFlash: require('connect-flash'),
  connectMongodbSession: require('connect-mongodb-session'),
  csurf: require('csurf'),
  express: require('express'),
  expressHandlebars: require('express-handlebars'),
  expressSession: require('express-session'),
  handlebars: require('handlebars'),
  helmet: require('helmet'),
  mongoose: require('mongoose')
}

const middlewares = {
  variables: require('./middlewares/variables')
}

const routes = {
  home: require('./routes/home'),
  about: require('./routes/about'),
  contacts: require('./routes/contacts')
}

const key = require('./keys')
const helpers = require('./utils/hbsHelpers')

const app = modules.express()

app.use(modules.express.static(modules.path.join(__dirname, 'public')))
app.use(modules.express.static(modules.path.join(__dirname, 'public/icons')))
app.use(modules.express.static(modules.path.join(__dirname, 'node_modules')))
app.use(
  modules.express.urlencoded({
    extended: true,
  })
)

const hbs = modules.expressHandlebars.create({
  defaultLayout: 'index',
  extname: 'hbs',
  handlebars: modules.allowPrototypeAccess.allowInsecurePrototypeAccess(
    modules.handlebars
  ),
  helpers
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

const store = new modules.connectMongodbSession(modules.expressSession)({
  collection: 'sessions',
  uri: key.DB
})

app.use(
  modules.expressSession({
    secret: key.SECRET,
    resave: false,
    saveUninitialized: false,
    store
  })
)

app.use(modules.csurf())
app.use(modules.connectFlash())
app.use(modules.helmet())
app.use(modules.compression())
app.use(middlewares.variables)

app.use('/', routes.home)
app.use('/about', routes.about)
app.use('/contacts', routes.contacts)

async function start() {
  try {
    await modules.mongoose.connect(key.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })

    app.listen(key.PORT, async () => {
      await console.log(
        modules.chalk.cyanBright.bold(
          ` _______________________________\n|                               |\n| Сервер запущен на порту ${modules.chalk.yellow.underline(
						key.PORT
					)}  |\n| Ссылка: ${modules.chalk.yellow.underline(
						`http://localhost:${key.PORT}`
					)} |\n|_______________________________|`
        )
      )

      if (!process.env.NODE_ENV === 'production') modules.open(`http://localhost:${key.PORT}`)
    })
  } catch (error) {
    console.log(modules.chalk.redBright.bold(error))
  }
}

start()

console.timeEnd('server')