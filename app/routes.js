// Grab the Nerd model
//var Nerd = require('./models/nerd');
var Person = require('./models/person');
var Log = require('./models/log');

module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes
    // sample api route
    app.get('/api/persons', function(req, res) {
        // use mongoose to get all nerds in the database
        console.log('finding people');
        Person.find(function(err, persons) {
        	console.log('people found');
            // if there is an error retrieving, send the error. 
                            // nothing after res.send(err) will execute
            if (err)
                res.send(err);
            res.json(persons); // return all nerds in JSON format
        });
        console.log('done finding people');
    });

    app.post('/api/person/create', function(req, res) {
        console.log('adding person');
        //console.log(req.body.first_name);
        //console.log(req.body.last_name);
        console.log(req.body.height);
        //res.json(req.query);
        /*res.send('You sent first name: ' + req.body.first_name, 
            + ', last name: ' + req.body.last_name + ', height: '
            + req.body.height);*/
        Person.create({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            height: req.body.height,
            current_room: -1
        }, function(err) {
            if(err != null)
            {
                console.log('error');
                console.log(err);
            }
            else
                console.log('person added');
        });
    });

    /*app.get('/api/new_person', function(req, res) {
    	console.log("adding person");
    	Person.create({
            first_name: 'Colin',
            last_name: 'Szechy',
            height: 69.5,
        }, function(err) {
            if(err != null)
            {
                console.log("error")
                console.log(err);
            }
        });
    	console.log("done adding person");

    });*/

    app.get('/api/logs', function(req, res) {
        console.log('Finding logs');
        Log.find(function(err, logs) {
            if(err)
                res.send(err);
            res.json(logs);
        });
        console.log('done finding logs');
    });

    app.get('/api/new_log', function(req, res) {
        console.log("adding new log");
        Person.findOne({'last_name':'Szechy'}, function(err, result) {
            if(err != null)
            {
                console.log('error');
                console.log(err);
            }
            else
            {
                Log.create({
                    roomB: 1,
                    height: 69.5,
                    persoon: result._id
                }, function(err) {
                    if(err != null)
                    {
                        console.log("error");
                        console.log(err);
                    }
                });
            }
        });
        console.log("good work");
    });
	// frontend routes =========================================================
	// route to handle all angular requests
	/*app.get('*', function(req, res) {
		res.sendfile('./public/index.html');
	});*/

	// index page
    // use res.render with ejs I guess 
	app.get('*', function(req, res) {
	    res.render('index');
	});


};