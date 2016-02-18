var mongoose = require('Mongoose');
var Schema = mongoose.Schema;

var SuperStorySchema = new Schema({
	ageRestriction : Number
});

module.exports = mongoose.model('SuperStory', SuperStorySchema);