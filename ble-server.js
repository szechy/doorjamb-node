var async 			= require('async');
var noble			= require('noble');
var mongoose 		= require('mongoose');
var Person 			= require('./app/models/person');
var Log 			= require('./app/models/log');
var Door 			= require('./app/models/door');

//var peripheralId                  = '427311e3e83e4b7cacf2a37dfbb71f31'; // for Edison for some reason, 'c098e5809cf3';
var peripheralIds = []; 

Door.find({}, 'ble_id', function(err, docs) {
  //console.log(docs);
  for(var i = 0; i < docs.length; i++)
    peripheralIds.push(docs[i].ble_id);
  console.log("BLE IDS");
  console.log(peripheralIds);
  console.log("OUTPUTTED");
});

peripheralIds.push('c3483b81013c4112b1f56e275c6cd954');

var oldTransactionId = 0;

var serviceId                     = '5123456789abcdef0123456789abcdef';
//serviceId = (parseInt(serviceId, 16)).toString(16);
var doorCharacteristicId          = '0123765489ABCDEF0123456789ABCDEF';
var heightCharacteristicId        = '0123012389ABCDEF0123456789ABCDEF';
var timeOriginalCharacteristicId  = '012389AB89ABCDEF0123456789ABCDEF';
var timeActionCharacteristicId    = '0123CDEF89ABCDEF0123456789ABCDEF';
var actionCharacteristicId        = '012312EF89ABCDEF0123456789ABCDEF';
var transactionCharacteristicId   = '012334CD89ABCDEF0123456789ABCDEF';
var characteristicsIds = [doorCharacteristicId, heightCharacteristicId, 
  timeOriginalCharacteristicId, timeActionCharacteristicId, actionCharacteristicId,
  transactionCharacteristicId];
var latest_messages = [];
var message_storage_format = {door_id: '', height: 0, action: 0, time: 0};

// Power on/off
noble.on('stateChange', function(state) {
	console.log('noble - changing BLE state');
	if(state == 'poweredOn')
	{
		// start scanning for specific doorjamb UUID
    console.log("we're powered on");
		var serviceUUIDs = []; // this means all of them, should just specifiy Doorjamb service UUID
		var allowDuplicates = true;
		noble.startScanning(serviceUUIDs, allowDuplicates);
	}
	else
	{
		noble.stopScanning();
	}
});

// peripheral discovery
noble.on('discover', function(peripheral) {
  //console.log('we\'ve discovered something ' + peripheral.id);
  console.log(peripheral.id + ": " + peripheralIds.indexOf(peripheral.id));
  console.log(peripheral.advertisement.manufacturerData.toString('hex'));
  if (peripheralIds.indexOf(peripheral.id) > -1) {
    //noble.stopScanning();

    console.log('peripheral with ID ' + peripheral.id + ' found ' + peripheral.advertisement.localName);
    var advertisement = peripheral.advertisement;

    var localName = advertisement.localName;
    var txPowerLevel = advertisement.txPowerLevel;
    var manufacturerData = advertisement.manufacturerData;
    var serviceData = advertisement.serviceData;
    var serviceUuids = advertisement.serviceUuids;

    if (localName) {
      console.log('  Local Name        = ' + localName);
    }

    if (txPowerLevel) {
      console.log('  TX Power Level    = ' + txPowerLevel);
    }

    if (manufacturerData) {
      console.log('  Manufacturer Data = ' + manufacturerData.toString('hex'));
	console.log(Buffer.isBuffer(manufacturerData));	
console.log(typeof(manufacturerData));      
var data = manufacturerData;
	var data = manufacturerData.slice(2);
      //var data = manufacturerData.slice(4);
      console.log(data);
	console.log(typeof(data));
	//var newData = Object.create(Buffer, data);
//console.log(newData);
//console.log(typeof(newData));
	var buf = new Buffer(data);
	for(var i = 0; i < data.length; i++)
{	console.log("[" + i + "]: " + data[i].toString(16)); 
}
	var height = data[3] + (data[2] << 8);
//var height = buf.readUIntBE(2,4);//data.readUIntBE(0,4);
      console.log("HEIGHT: " + height.toString(10) + " " + height.toString(16));
      var actionType = data[4];

//var actionType = data.readUIntBE(4,1);
      console.log("ACTION_TYPE: " + actionType.toString(10));
      var transactionId = data[5];//data.readUIntBE(5,1);
      console.log("TRANSACTION_COUNT: " + transactionId.toString(10));
      
      var adjusted_height = calculateHeight(height);
      var feet = Math.floor(adjusted_height/12);
      console.log(feet);
      console.log("adjusted: " + feet + "\' " + (adjusted_height-feet*12).toFixed(2) + "\"");

      // find Door
      if((transactionId != oldTransactionId) && (height < 10000))
      {
       Door.findOne({'ble_id': peripheral.id}, function(err, result) {
        if(err != null)
        {
          console.log("error");
          console.log(err);
        }
        console.log("door: " + result.ble_id + "\t" + result.roomA + "->" + result.roomB);
        // find individual by calculating height
        var adjusted_height = calculateHeight(height, result);
        var feet = parseInt(adjusted_height/12);
        console.log("adjusted: " + feet + "\'" + height-12*feet + "\"");
        findMatch(adjusted_height, result, actionType);
        /*Person.findOne({'height': adjusted_height}, function(err, person) {
          // save as log
          //console.log("found person: " + person.first_name + " " + person.last_name);
          if(err != null)
          {
            console.log("error");
            console.log(err);
          }
          Log.create({
            roomA: result.roomA,
            roomB: result.roomB,
            timestamp: Date.now(), 
            height: height,
            person: person,
            actual_name: person.first_name + ' ' + person.last_name
          }, function(err) {
            if(err != null)
            {
                console.log("error");
                console.log(err);
            }
          });
        });*/
      });
      oldTransactionId = transactionId;
      }
      else if(height > 10000)
      {
        console.log('too high of a value');
      }
    }
  }
});

function calculateHeight(height)//, door)
{
  // current values are Maxbotix
  var doorHeight = 79.5; //80;
  var distance = doorHeight - height*.0134704 + 16.22;//height*.00674564 +2.10508;
  //var distance = doorHeight - height/160.11 + 76.357/160.11;
  
  return distance;//[polished_height, real_height];
}

function findMatch(height, door, action_type)
{
  var originalRoom = -1;
  if((action_type === 1) || (action_type === 3))  //A->B
    originalRoom = door.roomA;
  else if((action_type == 2) || (action_type == 4))
    originalRoom = door.roomB;

  Person.find({'current_room' : originalRoom}, function(err, results) {
    // let's work with results
    if(results) {
      var result = findMostLikelyPerson(results, height);
      updateDatabase(result, door, action_type, height, originalRoom);
    }
    // check against all people
    else {
      Person.find({}, function(err, results) {
        var result = findMostLikelyPerson(results, height);
        updateDatabase(result, door, action_type, height, originalRoom);
      });
    }
  });
}

function findMostLikelyPerson(people, height)
{
  var best_diff = Math.abs(height-people[0].height);
  var best_index = 0;
  for(var i = 1; i < people.length; i++)
  {
    if(Math.abs(height - people[i].height < best_diff))
    {
      best_diff = Math.abs(height-people[i].height);
      best_index = i;
    }
  }
  return people[i];
}

function updateDatabase(person, door, action_type, height, oldRoom)
{
  // no Door update necessary
  // update Person
  var newRoom = -1;
  if((action_type == 1) || (action_type == 4))
    newRoom = door.RoomB;
  else if((action_type == 2) || (action_type == 3))
    newRoom = door.RoomA;

  person.current_room = newRoom;
  Person.findByIdAndUpdate(person.id, person, function(err, model) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("updated person " + person.moniker);
    }
  });
  // update Logs
  Log.create({
      roomA: originalRoom,
      roomB: newRoom,
      height: height,
      actual_name: result.moniker,
      person: person
  }, function(err) {
      if(err != null)
      {
          console.log("error");
          console.log(err);
      }
  });
}