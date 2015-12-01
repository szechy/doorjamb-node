var async 			= require('async');
var noble			= require('noble');
var mongoose 		= require('mongoose');
var Person 			= require('./app/models/person');
var Log 			= require('./app/models/log');
var Door 			= require('./app/models/door');

var peripheralId                  = '427311e3e83e4b7cacf2a37dfbb71f31';
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
  if (peripheral.id === peripheralId) {
    //noble.stopScanning();

    //console.log('peripheral with ID ' + peripheral.id + ' found ' + peripheral.advertisement.localName);
    var advertisement = peripheral.advertisement;

    var localName = advertisement.localName;
    var txPowerLevel = advertisement.txPowerLevel;
    var manufacturerData = advertisement.manufacturerData;
    var serviceData = advertisement.serviceData;
    var serviceUuids = advertisement.serviceUuids;

    /*if (localName) {
      console.log('  Local Name        = ' + localName);
    }

    if (txPowerLevel) {
      console.log('  TX Power Level    = ' + txPowerLevel);
    }

    if (manufacturerData) {
      console.log('  Manufacturer Data = ' + manufacturerData.toString('hex'));
    }

    if (serviceData) {
      console.log('  Service Data      = ' + serviceData);
    }

    if (serviceUuids) {
      console.log('  Service UUIDs     = ' + serviceUuids);
    }*/
    exploreDoorjambCharacteristics(peripheral);
    //exploreDoorjamb(peripheral);
}
});

function exploreDoorjambCharacteristics(peripheral) {
  peripheral.on('disconnect', function() {
    process.exit(0);
  });

  peripheral.connect(function(error) {
    peripheral.discoverAllServicesAndCharacteristics(function(error, services, characteristics) {
      console.log(characteristics.length);
      for(var i = 0; i < characteristics.length; i++)
      {
         console.log(i + " " + characteristics[i].uuid);
         characteristics[i].read(function(error, data) {
            var data_array = [];
            for(var count = 0; count < data.length; count++) {
              data_array.push(data[count].charCodeAt(0));
            }
            console.log("here");
            console.log("DATA: " + data_array);
            /*var data_array = [];
            for(var count = 0; count < data.length; count++) {
              data_array.push(data[count].charCodeAt(0));
            }
            console.log("DATA: " + data_array);*/
         });       
      }
    });
  });
}

function exploreDoorjamb(peripheral) {
  //console.log('doorjamb peripheral');

  peripheral.on('disconnect', function() {
    process.exit(0);
  });

  peripheral.connect(function(error) {
    // doorjamb service
    //console.log(serviceId);
    // for some reason handling serviceId as a hex string is broken
    peripheral.discoverServices([], function(error, services) {
      if(services[0].uuid == serviceId){
        console.log('entering doorjamb');
        exploreDoorjambService(error, service[0]);
        console.log('done with doorjamb');
      }
      else {
        //console.log('weirdo service');
        //console.log(services[0].uuid);
        exploreDoorjambService(error, services[0]);
      }
    });
      // doorjamb characteristics
      /*console.log(services.length);
      peripheral.discoverCharacteristics([], function(error, characteristics) {
      //peripheral.discoverCharacteristics(characteristicsIds, function(error, characteristics) {
        console.log(characteristics.length);
        for(var i = 0; i < characteristics.length; i++)
        {
          characteristics[i].read( function(error, data) {
            console.log(characteristics[i].uuid);
            console.log(data);
            console.log(" ");
          });
        }
      });*/
  });
}

function exploreDoorjambService(error, service) {
  console.log("in service " + service.uuid);
  
  service.discoverCharacteristics([], exploreCharacteristic);

  /*service.discoverCharacteristics([], function(error, characteristics) {
    console.log(characteristics.length);
    for(var i = 0; i < characteristics.length; i++)
    {
      characteristics[i].read(function(error, data) {
        console.log(characteristics[i].uuid);
        console.log(data);
        console.log(" ");
      });
    }
  });*/
}

function exploreCharacteristic(error, characteristics) {
    console.log("exploring characteristic");
    console.log(characteristics.length);
    for(var i = 0; i < characteristics.length; i++)
    {
      //if(characteristics[i])
      console.log(characteristics[i].uuid);
      {
        characteristics[i].read(function(error, data) {
          var data_array = [];
          for(var count = 0; count < data.length; count++) {
            data_array.push(data[count].charCodeAt(0));
          }
          console.log("DATA: " + data_array);
          //console.log(characteristics[i].uuid);
          //console.log(data);
          //console.log(" ");
        });     
      }
    }
}

function explore(peripheral) {
  console.log('services and characteristics:');

  peripheral.on('disconnect', function() {
    process.exit(0);
  });

  peripheral.connect(function(error) {
    peripheral.discoverServices([], function(error, services) {
      var serviceIndex = 0;

      async.whilst(
        function () {
          return (serviceIndex < services.length);
        },
        function(callback) {
          var service = services[serviceIndex];
          var serviceInfo = service.uuid;

          if (service.name) {
            serviceInfo += ' (' + service.name + ')';
          }
          console.log(serviceInfo);

          service.discoverCharacteristics([], function(error, characteristics) {
            var characteristicIndex = 0;
            console.log(characteristics.length);

            async.whilst(
              function () {
                return (characteristicIndex < characteristics.length);
              },
              function(callback) {
                var characteristic = characteristics[characteristicIndex];
                var characteristicInfo = '  ' + characteristic.uuid;

                if (characteristic.name) {
                  characteristicInfo += ' (' + characteristic.name + ')';
                }

                async.series([
                  function(callback) {
                    characteristic.discoverDescriptors(function(error, descriptors) {
                      async.detect(
                        descriptors,
                        function(descriptor, callback) {
                          return callback(descriptor.uuid === '2901');
                        },
                        function(userDescriptionDescriptor){
                          if (userDescriptionDescriptor) {
                            userDescriptionDescriptor.readValue(function(error, data) {
                              if (data) {
                                characteristicInfo += ' (' + data.toString() + ')';
                              }
                              callback();
                            });
                          } else {
                            callback();
                          }
                        }
                      );
                    });
                  },
                  function(callback) {
                        characteristicInfo += '\n    properties  ' + characteristic.properties.join(', ');

                    if (characteristic.properties.indexOf('read') !== -1) {
                      characteristic.read(function(error, data) {
                        if (data) {
                          var string = data.toString('ascii');

                          characteristicInfo += '\n    value       ' + data.toString('hex') + ' | \'' + string + '\'';
                        }
                        callback();
                      });
                    } else {
                      callback();
                    }
                  },
                  function() {
                    console.log(characteristicInfo);
                    characteristicIndex++;
                    callback();
                  }
                ]);
              },
              function(error) {
                serviceIndex++;
                callback();
              }
            );
          });
        },
        function (err) {
          peripheral.disconnect();
        }
      );
    });
  });
}

