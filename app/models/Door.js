// grab the mongoose module
var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/doorjamb-node');

// module.exports allows us to pass this to other files when it is called
module.exports = mongoose.model('Door', {
	ble_id : {type : String, default: ''},
	roomA : {type : Number, default: 0},
	roomB: {type: Number, default: 0},
	height: {type: Number, default: 0}
});
