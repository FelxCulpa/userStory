var mongoose = require('mongoose');              //Хранилище данных

var Schema = mongoose.Schema;

var StorySchema = new Schema({

	creator: { type: Schema.Types.ObjectId, ref: 'User'},
	content: String,
	created: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Story', StorySchema);