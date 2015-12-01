// grab the mongoose module
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/doorjamb-node');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Person', {
	base_height : {type : Number, default: 0},
	roomA : {type : Number, default: 0},
	roomB : {type: Number, default: 0},
	time_first: {type: Number, default: 0}
});
