var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StorySchema = new Schema({
	creator : { type : Schema.Types.ObjectId, ref : 'User' },
	content : { 
		type : String,
		required : true
	},
	created : { type : Date, default : Date.now }
},{
	versionKey : false,
	timestamps : {
		createdAt : 'created_at',
		updatedAt : 'updated_at'
	}
});

//Custom Static Method
StorySchema.statics.searchInStories = function(searchString, cb){
	return this.find({ content : new RegExp(searchString.string, 'i')} , cb );
}

//Virtuals
StorySchema.virtual('contentincaps').get(function() {
	if(this.content!=undefined)
		return this.content.toUpperCase();
	else return null;
});

//Validate Before Save
// StorySchema.set('validateBeforeSave', false);
// StorySchema.path('content').validate(function(value, respond) {
// 	return value === undefined ? false : true; 
// }, 'Error : Story Content is empty');

StorySchema.set('toJSON', {
	virtuals : true
});
StorySchema.set('toObject', {
	virtuals : true
});


//Virtuals
// StorySchema.virtual('content.caps').get(function() {
// 	return this.content.toUpperCase();
// });

module.exports = mongoose.model('Story', StorySchema);