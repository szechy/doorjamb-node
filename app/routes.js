// Grab the Nerd model
//var Nerd = require('./models/nerd');
var Person = require('./models/person');
var Log = require('./models/log');
var Door = require('./models/door');

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
            console.log(persons);
            res.json(persons); // return all nerds in JSON format
        });
    });

    // reports all current users and their statuses
    app.get('/api/status', function(req, res) {
        console.log('Reporting status');
        Person.find(function(err, persons) {
            console.log('found status');
            if(err)
                res.send(err);
            var statuses = [];
            console.log(persons);
            for(var i = 0; i < persons.length; ++i)
            {
                console.log(i);
                statuses.push({
                    name: persons[i].moniker,
                    room: persons[i].current_room});
            }
            res.json(statuses);
        });
    });

    // report status for one person
    app.get('/api/status/:personName', function(req, res) {
        var proper = req.params.personName.replace("+", " ");
        Person.findOne({'first_name': proper}, function(err, person) {
            console.log(person);
            var status = { 
                    name: person.moniker,
                    room: person.current_room
                };
            res.json(status);
        });
    });

    app.get('/api/person/:personId', function(req, res) {
        console.log('In routes, ' + req.params.personId);
        Person.findOne({}, function(err, person) {
            if(err)
                res.send(err);
            res.json(person);
        });
    });

    app.post('/api/person/create', function(req, res) {
        console.log('adding person');
        //res.json(req.query);
        /*res.send('You sent first name: ' + req.body.first_name, 
            + ', last name: ' + req.body.last_name + ', height: '
            + req.body.height);*/
        Person.create({
            moniker: req.body.moniker,
            //first_name: req.body.first_name,
            //last_name: req.body.last_name,
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
        res.render('index');
    });

    app.get('/api/person/delete/', function(req, res) {
        console.log("in the first delete one");
    });

    app.post('/api/person-delete/', function(req, res) {
        Person.findByIdAndRemove(req.body.id, function(err, data) {
            if(err)
                console.log(err);
            res.render('index');
        });
    });

    app.get('/api/logs', function(req, res) {
        console.log('Finding logs');
        Log.find(function(err, logs) {
            if(err)
                res.send(err);
            res.json(logs);
            console.log('done finding logs');
        });
    });

    app.get('/api/new_log', function(req, res) {
        console.log("adding new log");
        Person.findOne({'moniker':'Colin Szechy'}, function(err, result) {
            if(err != null)
            {
                console.log('error');
                console.log(err);
            }
            else
            {
                Log.create({
                    roomB: 1,
                    height: 79.5,
                    actual_name: result.moniker,
                    person: result
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
        res.render('index');
    });

    app.get('/api/doors', function(req, res) {
        console.log('Finding doors');
        Door.find(function(err, doors) {
            if(err)
                res.send(err);
            res.json(doors);
            console.log('done finding doors');
        });
    });

    app.post('/api/new_door', function(req, res) {
        console.log('creating door');
        Door.create({
            ble_id: req.body.ble_id,
            height: req.body.height,
            roomA: req.body.roomA,
            roomB: req.body.roomB
        });
        res.render('index');
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