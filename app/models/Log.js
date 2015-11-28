// grab the mongoose module
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/doorjamb-node');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Log', {
	roomA : {type : Number, default: 0},
	roomB : {type : Number, default: 0},
	timestamp: {type : Date, default: Date.now},
	height: {type: Number, default: 0},
	person: {type: mongoose.Schema.Types.ObjectId, ref: 'Person', index:true},
	actual_name: {type: String, default: ''}
});
