import React, { Component,useCallback,useMemo } from 'react';
import { HashRouter, Route, Switch,Redirect } from 'react-router-dom';
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CAlert,
    CCol,

} from '@coreui/react';
import fire from '../../firebase';
import Dropzone, {useDropzone} from 'react-dropzone';
import Cookies from "js-cookie";


class importar extends Component {
  constructor() {
    super();
    this.onDrop = (files) => {
        this.getAsText(files[0]);
        this.setState({files})
        console.log(files);
    };
    this.state = {
      files: [],
      data:[],
      token_uid:undefined,
      modal:false
    };
  }

  componentDidMount(){
    const uid= Cookies.get('uid');
    this.setState({token_uid:uid})
  }

  getAsText=(fileToRead)=> {
    var reader = new FileReader();
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = this.loadHandler;
    reader.onerror = this.errorHandler;
  } 

  loadHandler=(event)=>{
    var csv = event.target.result;
    const verificar = this.verificarcsv(csv)
    
    if (verificar === true ){
      
      this.processData(csv);
    }else{
      var faltantes = ''
      verificar.forEach(campo => {
        faltantes= faltantes+', '+campo
      })
     
      this.setState({files:[]})
      this.setState({alert:<CAlert color="danger">
      Este documento no tiene todas las Columnas requeridos.
      Columnas faltantes: {faltantes}
      </CAlert> })

      setTimeout(() => {
        this.setState({alert:undefined})
      }, 25000);

        }
    
  }

  verificarcsv =(csv)=>{
    var allTextLines = csv.split(/\r\n|\n/);
    
    let confirmados = []
    let req = ["DIRECCION","LATITUD","LONGITUD","DESCRIPCION","CANTIDAD","TELEFONO","CORREO","NOMBRE PROD","NOMBRE CONTACTO"]
    var cuenta = 0
    //first line of csv
    var keys = allTextLines.shift().split(',');
    for(var i = 0; i < keys.length; i++){
      if (req.includes(keys[i])){
       confirmados.push(keys[i])
        cuenta = cuenta +1
      }
    }
    var faltantes = req.filter((i => a => a !== confirmados[i] || !++i)(0));
    
    if (cuenta >= req.length){
      
      return true
     
            
	}else{
    var faltantes = req.filter((i => a => a !== confirmados[i] || !++i)(0));
    return faltantes
    
    }
    
    

  }

  errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
  }

  processData(csv) {

    var today = new Date();
    var manana = new Date(today)
    manana.setDate(manana.getDate() + 1)
    var dd2 = String(manana.getDate()).padStart(2, '0');
    var mm2 = String(manana.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy2 = manana.getFullYear();
    manana = dd2 + '-' + mm2 + '-' + yyyy2;

    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
	
    let requeridos =  ["DIRECCION",
    "DESCRIPCION","CANTIDAD","TELEFONO","CORREO",
    "NOMBRE PROD","NOMBRE CONTACTO"]

    //first line of csv
    var keys = allTextLines.shift().split(',');
	let linea = 2
	if (allTextLines.length <= 1 ){
		this.setState({files:[]})
		this.setState({alert:<CAlert color="danger">
		El archivo esta vacio
		
		</CAlert> })
		setTimeout(() => {
			this.setState({alert:undefined})
		}, 25000);
		return
	}
    while (allTextLines.length - 1) {
          
        var arr = allTextLines.shift().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
		for(var i = 0; i < keys.length; i++){
				if (requeridos.includes(keys[i])){
						
					if( arr[i] === ''){
						this.setState({files:[]})
						this.setState({alert:<CAlert color="danger">
						El archivo Tiene un error en la linea {linea}. El Campo {keys[i]} esta vacio
						
						</CAlert> })
						setTimeout(() => {
							this.setState({alert:undefined})
						}, 25000);
						return
					}
				}
			}

			
        var obj = {};
        for(var i = 0; i < keys.length; i++){
          
            if (keys[i] == "FECHA MIN ENTREGA" ){
				console.log(arr[i]);
              if (arr[i] != ''){
                obj[keys[i]] = arr[i];
              }else{
                obj[keys[i]] = manana;
              }

              
            }else{
              if( arr[i] == undefined){
                obj[keys[i]] = ".";
              }else{
                obj[keys[i]] = arr[i];
              }
             
            }     
		}
        lines.push(obj);
		linea = linea + 1    
	}
        this.setState({data:lines})

  }
    

  leerfile = ()=>{
    
    if (this.state.files.length === 0 ){
      
        <CAlert color="danger">
        Porfavor seleccione un archivo
      </CAlert> ;
    } else {

      var db = fire.firestore();
  

           

            
            var pedidos = this.state.data
    
            var token_uid = this.state.token_uid
            var today = new Date();
            var manana = new Date(today)
            manana.setDate(manana.getDate() + 1)
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            var dd2 = String(manana.getDate()).padStart(2, '0');
            var mm2 = String(manana.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy2 = manana.getFullYear();
            today = dd + '-' + mm + '-' + yyyy;
            manana = dd2 + '-' + mm2 + '-' + yyyy2;

            var now     = new Date(); 
            var hour    = now.getHours();
            var minute  = now.getMinutes();
            var second  = now.getSeconds(); 
            if(hour.toString().length === 1) {
              hour = '0'+hour;
            }
            if(minute.toString().length === 1) {
                  minute = '0'+minute;
            }
            if(second.toString().length === 1) {
                  second = '0'+second;
            }   
            var hora = hour+':'+minute+':'+second;
            
      
            var dataorden = db.collection("ordenes").doc()
            dataorden.set({
              uid: dataorden.id,
              nombre: this.state.files[0].name+" "+today,
              cliente: token_uid,
              ct_origen:'central',
              identificador_contacto: token_uid,
              status:0,
              fecha_import: today,
              hora_import:hora,
              
          })



            pedidos.forEach((ped) => {
             var consig = ped["DIRECCION"].replace(/"/g, '').replace(/\s/g, '_');
             
            var data = db.collection("pedidos").doc()
            
            data.set({
              uid: data.id,
              cliente: token_uid,
              ct_origen:'central',
              identificador_contacto: token_uid,
              min_horario: '06:00',
              max_horario:'24:00',
              status:0,
              fecha_import: today,
              hora_import:hora,
              orden_uid:dataorden.id,
              peso:"Sin definir",
              consignatario: consig,
			  tamano:1,
              ...ped
          })
          .catch((error) => {
           
              console.error("Error writing document: ", error);
          });
              
  
            });
            
            this.setState({files:[],modal:true})
    }
   
          
    
  }
  render(){
    const files = this.state.files.map((file,index) => (
      <li key={file.name}>
        {file.name} - {file.size} bytes {<CButton onClick={()=> this.setState({files:[]})} color="danger" > Delete</CButton>
        
         }
      </li>
    ));

    return (
        <div>
          <h5> Campos Requeridos</h5>
          <h6>DIRECCION LATITUD LONGITUD DESCRIPCION 
            CANTIDAD TELEFONO CORREO NOMBRE PROD NOMBRE CONTACTO
            </h6>
          
          {this.state.alert}
      <Dropzone  className='dropzone'  accept=".csv" onDrop={this.onDrop} >
        {({getRootProps, getInputProps}) => (
          <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <p>Arrastra un arrchivo csv o haz click para seleccionar</p>
            </div>
            <aside>
              <h4>Files</h4>
              <ul>{files}</ul>
            </aside>
          </section>
        )}
      </Dropzone>

      <CButton block color="primary" onClick={this.leerfile}>Subir Pedidos</CButton>
      <CModal 
              show={this.state.modal} 
              onClose={() => this.setState({modal:false})}
              color="success"
            >
              <CModalHeader closeButton>
                <CModalTitle>Éxito</CModalTitle>
              </CModalHeader>
              <CModalBody>
                pedidos ingresados correctamente
              </CModalBody>
              <CModalFooter>
                <CButton color="success" onClick={() => this.setState({modal:false})}>Listo</CButton>
              </CModalFooter>
            </CModal>
      </div>
    );
  }
}
export default importar;

