function generateUrlTitle (title) {
  if (title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    return title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    return Math.random().toString(36).substring(2, 7);
  }
}

let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/wikistack');

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

let Schema = mongoose.Schema;

let pageSchema = new Schema({
  title: {type: String, required: true},
  urlTitle: {type: String, required: true},
  content: {type: String, required: true},
  date: {type: Date, default: Date.now},
  status: {type: String, enum: ['open', 'closed']},
  author: {type: Schema.Types.ObjectId, ref: 'User'}
});

pageSchema.virtual('route').get(function(){
  return '/wiki/' + this.urlTitle;
});

pageSchema.pre('validate', function(next){
  this.urlTitle = generateUrlTitle(this.title);
  next();
});



let userSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true}
})

userSchema.statics.findOrCreate = function(props) {
  let self = this;
  return self.findOne({email: props.email}).exec()
  .then(user => {
    if(user) {
      console.log(user);
      return user;
    }
    else {
      console.log('does not exist');
      return self.create({
        email: props.email,
        name: props.name
      })
    }
  })
}

let Page = mongoose.model('Page', pageSchema);
let User = mongoose.model('User', userSchema);

module.exports = {
  Page: Page,
  User: User
}
