// grab the mongoose module
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
mongoose.connect('mongodb://localhost:27017/doorjamb-node');

// define our nerd model
// module.exports allows us to pass this to other files when it is called
var personSchema = mongoose.Schema({
//module.exports = mongoose.model('Person', {
    local:
    {
        email : String,
        password: String,
    },
	moniker : {type : String, default: ''},
	//first_name : {type : String, default: ''},
	//last_name : {type : String, default: ''},
	height: {type: Number, default: 0},
	current_room: {type: Number, default: -1},
    do_not_track: {type: Boolean, default: false}
});

// methods ======================
// generating a hash
personSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
personSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Person', personSchema);
