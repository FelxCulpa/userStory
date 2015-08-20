var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');

var secretKey = config.secretKey;

var jsonwebtoken = require('jsonwebtoken');

function createToken(user) {                           

	var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	}, secretKey, {
		expirtesInMinute: 1440
	});

	return token;
}

module.exports = function(app, express, io) {

	var api = express.Router();

	api.get('/all_stories', function(req, res){
		Story.find({}, function(err, stories) {

			if(err) {
				res.send(err);
				return;
			}

			res.json(stories);
		});
	});

	api.post('/signup', function(req, res) {    //Регистрация пользователя

		var user = new User({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password
		});
		var token = createToken(user);
		user.save(function(err) {
			if(err) {
				res.send(err);
				return;
			}

			res.json({ 
				success: true,
				message: 'Пользователь успешно создан',
				token: token});
		});
	});

api.get('/users', function(req, res) {            //Получение списка пользователей

	User.find({}, function(err, users) {
		if(err) {
			res.send(err);
			return;

		}

		res.json(users);
	});
});

api.post('/login', function(req, res) {          //Вход в аккаунт

	User.findOne({ 
		username: req.body.username
		}).select('name username password').exec(function(err, user) {
			if(err) throw err;

			if(!user) {

				res.send({ message: "Пользователь не существует"});
			} else if(user) {

				var validPassword = user.comparePassword(req.body.password);

				if(!validPassword) {
					res.send({ message: "Неверный пароль"});
									} else {
										                      //token

										var token = createToken(user);

										res.json({
											success: true,
											message: "Успешный вход!",
											token: token
										});
									}
			}
		})
});

api.use(function(req, res, next){               //Middleware

	console.log("Кто-то зашел в приложение");

	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// Проверка наличия токена
	if(token) {
		jsonwebtoken.verify(token, secretKey, function(err, decoded) {

			if(err) {
				res.status(403).send({success: false, message: "Failed"});
			} else {
				//
				req.decoded = decoded;

				next();
			}
		}); 
	} else {

		res.status(403).send({ success: false, message: "No Token Provided"});
	}


});

// Доступные действия для валидного токена

api.route('/')

	.post(function (req, res) {

			var story = new Story({

				creator: req.decoded.id,
				content: req.body.content,

			});

			story.save(function(err, newStory) {
				if(err) {
					res.send(err);
					return
				}
				io.emit('story', newStory)
				res.json({ message: "Новые данные записаны!"});
			});

	})

	.get(function(req, res){

		Story.find({ creator: req.decoded.id}, function(err, stories) {

			if(err) {
				res.send(err);
				return;
			}

			res.json(stories);
		});
	});

api.get('/me', function(req, res) {
	res.json(req.decoded);
});

return api
}
