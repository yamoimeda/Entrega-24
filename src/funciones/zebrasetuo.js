var selected_device;
var devices = [];
var setp = true;




   const BrowserPrint=  window.BrowserPrint
    export function setup()
    {
      if(setp){
        console.log(devices);
        //Get the default device from the application as a first step. Discovery takes longer to complete.
        window.BrowserPrint.getDefaultDevice("printer", function(device)
            {
          
              //Add device to list of devices and to html select element
              selected_device = device;
              devices.push(device);
              
              //Discover any other devices available to the application
              window.BrowserPrint.getLocalDevices(function(device_list){
                for(var i = 0; i < device_list.length; i++)
                {
                  //Add device to list of devices and to html select element
                  var device = device_list[i];
                  if(!selected_device || device.uid != selected_device.uid)
                  {
                    devices.push(device);
                  }
                }
                
              }, function(){alert("Error getting local devices")},"printer");
              
            }, function(error){
              
            })
            setp= false
            
          
      }
      return {
        selected_device,
        devices
    }
     
    }

    
    export function getConfig(){
	BrowserPrint.getApplicationConfiguration(function(config){
		alert(JSON.stringify(config))
	}, function(error){
		alert(JSON.stringify(new BrowserPrint.ApplicationConfiguration()));
	})
}
export function writeToSelectedPrinter(dataToWrite)

{
  if(selected_device.name != undefined || !selected_device  ){
    var direccion= ""
    var direccion2= ""
    if(dataToWrite['DIRECCION'].length < 40 ){
      if(dataToWrite['DIRECCION'].length > 20){
        direccion=  dataToWrite['DIRECCION'].slice(0,20); 
        direccion2= dataToWrite['DIRECCION'].slice(20)

      }else{
        direccion=dataToWrite['DIRECCION']
      }
    }else{
      direccion=  dataToWrite['DIRECCION'].slice(0,20); 
        direccion2= dataToWrite['DIRECCION'].slice(20,40)
    }
    var zpltext= `^XA
    ^PW812
    ^FX Top section with logo, name and address.
    ^CF0,60
    
    ^FO60,20^FDEntrega24.^FS
    ^CF0,30
    ^FO350,40^FDPanama^FS
    ^FO50,90^GB700,3,3^FS
    
    ^FX Second section with recipient address and permit information.
    ^CFA,35
    ^FO50,120^FD${dataToWrite['NOMBRE CONTACTO']}^FS
    ^FO50,160^FDTelefono: ${dataToWrite['TELEFONO']}^FS
    ^FO50,200^FD${direccion}^FS
    ^FO50,240^FD${direccion2}^FS
    ^CFA,15
    ^FO600,120^GB150,150,3^FS
    ^FO628,160^FDCantidad^FS
    ^FO638,210^FD${dataToWrite['CANTIDAD']}^FS
    ^FO50,300^GB700,3,3^FS
    
    ^FX Third section with bar code.
    ^BY5,2,160
    ^FO50,270^BY4,2.0,65^BQN,2,10^FD${dataToWrite.uid}^FS
    ^FO340,350^GB430,200,3^FS
    ^FO550,350^GB3,200,3^FS
    ^CF0,30
    ^FO350,380^FDFECHA MAX^FS FECHA
    ^FO350,430^FD${dataToWrite['FECHA MAX ENTREGA']}^FS
    ^CF0,120
    ^FO560,380^FDPTY^FS
    ^XZ`
    
    selected_device.send(zpltext, undefined, errorCallback);
  }else{
    alert("Seleccione impresora");
  }
	
}
var readCallback = function(readData) {
	if(readData === undefined || readData === null || readData === "")
	{
		alert("No Response from Device");
	}
	else
	{
		alert(readData);
	}
	
}
var errorCallback = function(errorMessage){
	alert("Error: " + errorMessage);	
}
function readFromSelectedPrinter()
{

	selected_device.read(readCallback, errorCallback);
	
}
function getDeviceCallback(deviceList)
{
	alert("Devices: \n" + JSON.stringify(deviceList, null, 4))
}


export function onDeviceSelected(selected)
{
	for(var i = 0; i < devices.length; ++i){
		if(selected.value == devices[i].uid)
		{
			selected_device = devices[i];
			return;
		}
	}
}



