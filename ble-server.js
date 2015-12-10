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
  //console.log(peripheralIds);
});

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
  //console.log(peripheral.id + ": " + peripheralIds.indexOf(peripheral.id));
  //console.log(peripheral.advertisement.manufacturerData.toString('hex'));
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
      var data = manufacturerData.slice(2);
      //var data = manufacturerData.slice(4);
      console.log(data);
      var height = data.readUIntBE(0,4);
      console.log("HEIGHT: " + height.toString(10));
      var actionType = data.readUIntBE(4,1);
      console.log("ACTION_TYPE: " + actionType.toString(10));
      var transactionId = data.readUIntBE(5,1);
      console.log("TRANSACTION_COUNT: " + transactionId.toString(10));
      
      // find Door
      if(transactionId != oldTransactionId)
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
        console.log("adjusted: " + adjusted_height);
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
    }
  }
});

function calculateHeight(height, door)
{
  // calculate real height from mapping height to real height
  // and using the door height
  // pull all individuals
  // match their height, set as polished height

  return height;//[polished_height, real_height];
}
