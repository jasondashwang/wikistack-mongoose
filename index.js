let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let swig = require('swig');
let chalk = require('chalk');

let app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);

swig.setDefaults({cache: false});

app.use('/wiki', require('./routes/wiki'));

let models = require('./models');
let Page = models.Page;
let User = models.User;

app.get('/', function(req, res, next){
  Page.find({}).exec()
  .then(pages => {
    res.render('index.html', {pages: pages});
  })
  .catch(next);
})

app.listen(1337, function(){
  console.log(chalk.green('Server started on port 1337'));
})
