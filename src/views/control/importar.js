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
      Este documento no tiene todos los campos requeridos.
      Campos faltantes: {faltantes}
      </CAlert> })

      setTimeout(() => {
        this.setState({alert:undefined})
      }, 25000);

        }
    
  }

  verificarcsv =(csv)=>{
    var allTextLines = csv.split(/\r\n|\n/);
    
    let confirmados = []
    let req = ["DIRECCION","NOMBRE PROD","CANTIDAD","FECHA MIN ENTREGA",
    "FECHA MAX ENTREGA","NOMBRE CONTACTO","TELEFONO","CORREO"]
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
    
    if (cuenta >= 8){
      
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
    
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
	
    let requeridos = ["LATITUD","LONGITUD","DIRECCION","NOMBRE PROD","CANTIDAD","FECHA MIN ENTREGA",
    "FECHA MAX ENTREGA","NOMBRE CONTACTO","TELEFONO","CORREO"]
 
    //first line of csv
    var keys = allTextLines.shift().split(',');
    
      while (allTextLines.length-1) {
        var arr = allTextLines.shift().split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
       
        var obj = {};
        for(var i = 0; i < keys.length; i++){
          if (requeridos.includes(keys[i])){
            
            obj[keys[i]] = arr[i];
          }
            
	}
        lines.push(obj);
    }
        this.setState({data:lines})
        
    }
    

  leerfile = ()=>{
    
    if (this.state.files.length === 0 ){
      
        <CAlert color="danger">
        This is a danger alert — check it out!
      </CAlert> ;
    } else {

      var db = fire.firestore();
  

           


            var pedidos = this.state.data
            var token_uid = this.state.token_uid
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = dd + '-' + mm + '-' + yyyy;

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
              nombre: this.state.files[0].name,
              cliente: token_uid,
              ct_origen:'central',
              identificador_contacto: token_uid,
              status:0,
              fecha_import: today,
              hora_import:hora,
              
          })



            pedidos.forEach((ped) => {
            
            var data = db.collection("pedidos").doc()
            data.set({
              uid: data.id,
              cliente: token_uid,
              ct_origen:'central',
              identificador_contacto: token_uid,
              min_horario: '06:00',
              max_horario: '20:00',
              status:0,
              fecha_import: today,
              hora_import:hora,
              orden_uid:dataorden.id,
              ...ped
          })
          .then(() => {
            this.setState({modal:true})
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
          <h6>DIRECCION, NOMBRE PROD, CANTIDAD, FECHA MIN ENTREGA,
    FECHA MAX ENTREGA, NOMBRE CONTACTO, TELEFONO, CORREO</h6>
          
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

