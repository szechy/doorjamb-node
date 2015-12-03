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
      console.log("HEIGHT: " + height.toString(16));
      var actionType = data.readUIntBE(4,1);
      console.log("ACTION_TYPE: " + actionType.toString(16));
      var transactionId = data.readUIntBE(5,1);
      console.log("TRANSACTION_COUNT: " + transactionId.toString(16));
      
      // find Door

      // find individual

      // save as log
      if(transactionId != oldTransactionId)
      {
        Log.create({
          roomA: 11,
          roomB: -1,
          timestamp: Date.now(), 
          height: height,
        }, function(err) {
          if(err != null)
          {
              console.log("error");
              console.log(err);
          }
        });
        oldTransactionId = transactionId;
      }
    }

    /*if (serviceData) {
      console.log('  Service Data      = ' + serviceData);
    }

    if (serviceUuids) {
      console.log('  Service UUIDs     = ' + serviceUuids);
    }*/
    //exploreDoorjambCharacteristics(peripheral);
    //exploreDoorjamb(peripheral);
}
});
