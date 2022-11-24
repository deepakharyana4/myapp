var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');





var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var deepakRouter=require('./routes/deepak')
var ordercompleteRouter=require('./routes/ordercomplete')
var chiefRouter=require("./routes/chief")
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/menuDB');
const menuSchema = new mongoose.Schema({
  name: String
});
const Menu = mongoose.model('Menu', menuSchema);

var app = express();
const order = [];

// view engine setup
port=10000
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/de(e)?pak', deepakRouter)
app.use("/ordercomplete",ordercompleteRouter)
app.use("/chief",chiefRouter)


const cardmenu = new Menu({ name: 'garlic bread' });
const cardmenu2 = new Menu({ name: 'garlic paste' });
const Menudish=[cardmenu,cardmenu2]


const drinks=["Tea","Coffee","Banana Shake","Mango Shake","Papaya Shake","Coconut Shake","Strawberry Shake","Cold drink","Chocolate Shake","Kit-Kat Shake"]
const foods=["Garlic Bread","Taco","Aloo Paranta","Paneer Dosa","Macroni","Maggi","Yippie","Pasta","Pizza","Chowemin","Hakka Noodles"]


const snacks=["Fries","Perry-Perry Fries","Masala Fries","Saucy Salad","Popcorn","Cotton-Candy",]
app.get('/', function(req, res, next) {
  Menu.find({},function(err,foods){
    if(foods.length === 0){
      Menu.insertMany(Menudish);
      res.redirect("/");
    }else{
      res.render('index', { title: 'Express',foods:foods,drinks:drinks,snacks:snacks });
    }
    
  })
 
});

app.post('/chief', function (req, res, next) {


  const cardmenu3 = new Menu({ name: req.body.food });
  cardmenu3.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  })
})
app.post('/',function(req,res){
  console.log(req.body.foodscheckbox);
  let newList = req.body.foodscheckbox;
  
  order.push(...newList);
  res.redirect("/ordercomplete");
})

app.get('/ordercomplete', function(req, res, next) {
  res.render('ordercomplete', { title: 'Done',order:order });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port,function(){
  console.log("Server is working for the 10000 port")
})



module.exports = app;
