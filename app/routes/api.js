var User = require('../models/user');
var Story = require('../models/story');
var config = require('../../config');
var secretKey = config.secretKey;
var jsonWebToken = require('jsonwebtoken');

var createToken  = function(user){
	
	var token = jsonWebToken.sign({
		_id : user._id,
		name : user.name,
		username : user.username
	}, secretKey, {
		expiresInMinute : 1440
	});

	return token;
}


/* ======= Validations ======= */
// Note : This gets triggered only if content is present in the object so v'll have to use required : true in Schema
Story.schema.path('content').validate(function (value) {
	console.log(value.trim().length);
	return value.trim().length === 0 ? false : true;
}, 'Error : Story content is empty');

/* ======= Validations ======= */

module.exports = function(app, express, io){ 	//added io for socket io

	var api = express.Router();
	api.post('/signup', function(req, res) {
		var user = new User({
			name : req.body.name,
			username : req.body.username,
			password : req.body.password
		});
	
		//Generate Token
		var token = createToken(user);
		user.save(function(err) {
			if(err){
				res.send(err);
				return;
			} 

			res.json({
				success : true,
				message : 'User has been created successfully',
				token : token
			});
		});

	});

	api.get('/users', function(req, res) {
		User.find({}, function(err, users) {
			if(err) {
				res.send(err);
				return;
			}
			res.json(users);
		});
	});

	api.post('/login', function(req, res) {
		User.findOne({
			username : req.body.username
		}).select('name username password').exec(function(err, user){
			if(err) {
				throw err;
			}
			if(!user){
				res.send({message : 'User does not exist'});
			}else{
				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword){
					res.send({message : 'Invalid Password'});
				}else{

					//Generate Token
					var token = createToken(user);
					res.send({
						success : true,
						message : 'Successfully logged in!',
						token : token,
						user : user
					})
				}
			}
		})
	});


	
	


	//Middleware
	api.use(function(req, res, next) {
		console.log('Gets executed when user visits the site');

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		if(token){
			jsonWebToken.verify(token, secretKey, function(err, decoded) {
				if(err){
					res.status(403).send({ success : false, message : "Failed to authenticate user"});
				}else{
					req.decoded = decoded;
					console.log("Decoded val is ");
					console.log(req.decoded);
					next();
				}
			});
		}else{
			res.status(403).send({ success : false, message : "No token provided" });
		}
	});


	// api.get('/', function(req, res) {
	// 	res.json("Hello World!!!");
	// });

	api.route('/all_stories')
		.get(function(req, res) {
			Story.find({}, function(err, stories) {
			if(err){
				res.send(err);
				return;
			}
				res.json(stories);
			});
		});

	api.route('/update_story')
		.put(function(req, res) {
			Story.findByIdAndUpdate(req.body._id ,{content : req.body.content}, function(err, story) {
			if(err){
				res.send(err);
				return;
			}
				res.json({
					message : 'Story Updated Successfully',
					story : story
				});
			});
		});	

	api.route('/search_stories')
		.post(function(req, res) {
			Story.searchInStories({string : req.body.searchString}, function(err, stories) {
			if(err){
				res.send(err);
				return;
			}
				res.json(stories);
			});
		});	

	api.route('/myinfo')

		.get(function(req, res) {
			console.log(req.decoded);
			res.json(req.decoded);
		});
	
	api.route('/')
		.post(function(req, res) {
			var story = new Story({
				creator : req.decoded._id,
				content : req.body.content
			});


			story.save(function(err, newStory) {
				if(err){
					res.send(err);
					return;
				}
				
				/* Socket.io emit */
				io.emit('story', newStory);		/* Added this for socket.io */
				res.json({ success : true, message : "New story created" });
			});

		})

		.get(function(req, res) {
			console.log("Decoded id is : " + req.decoded._id)
			Story.find({creator : req.decoded._id}, function(err, stories) {
				if(err){
					res.send(err);
					return;
				}
				res.json(stories);
			});

		});


	return api;


}