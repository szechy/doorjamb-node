// grab the mongoose module
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/doorjamb-node');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Person', {
	first_name : {type : String, default: ''},
	last_name : {type : String, default: ''},
	height: {type: Number, default: 0},
	current_room: {type: Number, default: 0}
});
