

import React, { useEffect, useState ,useContext} from "react";
import {
  CBadge,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDataTable,
  CRow,
  CButton,
  CCollapse,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CModalBody,
  CFormGroup,
  CSelect,
  CLabel,
  CAlert,
  CForm,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CInput,

} from '@coreui/react'
import fire from '../../firebase';
import Cookies from "js-cookie";
import { AuthContext } from "../../Auth";
import { useLocation } from "react-router-dom";
import {imprimir} from '../../funciones/imprimir';

import XLSX from 'xlsx';
import { saveAs } from 'file-saver'
const getBadge = status => {

  switch (status) {
    case 3: return 'success'
    case 1: return 'info'
    case 6: return 'warning'
    case 5: return 'danger'
    default: return 'primary'
  }
}
const fields = [
    { key:"PLACA" ,label: 'Placa', _style: { width: '40%'} },
    { key:"ORIGEN" ,label: 'Origen'},
    { key:"CAPACIDAD UNO" ,label: 'Capacidad'},
    { key:"HORA INICIO JORNADA" , label: 'Inicio de jornada', _style: { width: '20%'} },
    { key:"HORA FIN JORNADA" ,label: 'Fin de jornada', _style: { width: '20%'} },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]





const Tables = () => {
  const { user,tipo } = useContext(AuthContext);
    const [details, setDetails] = useState([])
    const [uid, setuid] = useState();
    const [uidborrar, setUidborrar] = useState();
    const [uidedit, setUidedit] = useState();
    const [alert, setAlert] = useState(false);
    const [status, setEstatus] = useState('');
    const [modal, setModal] = useState(false);
    const [modaladd, setmodaladd] = useState(false);
    const [modaledit, setModaledit] = useState(false);
    const [data, setData] = useState([]);
    const [alert_mensaje, setAlertmensaje] = useState(false);
    const [placa, setplaca] = useState('');
    const [origen, setorigen] = useState('');
    const [capacidad, setcapacidad] = useState('');
    const [direccion, setdireccion] = useState('');
    const [modalsuss, setmodalsuss] = useState('');
    const [inicio, setinicio] = useState('');
    const [fin, setfin] = useState('');
    const [subir, setmodalasubir] = useState('');
    const location = useLocation();

  // const [items, setItems] = useState(usersData)
useEffect(
    () => {

     

     

        (async () => {
        const uids=Cookies.get('uid');
        setuid(uids);
        var newdata= []

       
                
               fire.firestore().collection("camiones")
                  .get()
                  .then((querySnapshot) => {
                   
                    querySnapshot.forEach((doc) => {
                     
                        newdata.push( doc.data())
                      });
                      setData(newdata)
                    
                  })
                  .catch((error) => {
                    console.log("Error getting documents: ", error);
                  });
      
  
     })();
   
     
     

    },
    []
  );

  const agregarcamion = () => {
    var db = fire.firestore();
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

    var data = db.collection("camiones").doc()
    data.set({
      uid: data.id,
      fecha_import: today,
      hora_import:hora,
      orden_uid:'sinOrden',
      "PLACA": placa,
      "ORIGEN": origen,
      "CAPACIDAD UNO": capacidad,
      "HORA INICIO JORNADA":inicio,
      "HORA FIN JORNADA":fin,
      
  })
  .then(() => {
    setmodaladd(false)
    setmodalsuss(true)
  })
  .catch((error) => {
    setmodaladd(false)
  });

 
  }

const  subircamion =()=>{

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    var jd = []
     fire.firestore().collection("camiones")
    .get()
    .then((querySnapshot) => {
       
      querySnapshot.forEach((doc) => {
         
        var obect = 
        {"PLACA" : doc.data()["PLACA"],
        "ORIGEN":doc.data()["ORIGEN"], "CAPACIDAD UNO":doc.data()["CAPACIDAD UNO"] , "HORA INICIO JORNADA": doc.data()["HORA INICIO JORNADA"],
        "HORA FIN JORNADA":doc.data()["HORA FIN JORNADA"]}
          //doc.data()
          jd.push(obect)
      });
      //jsson = jd.map(Object.values)

      var wb = XLSX.utils.book_new();
      wb.Props = {
          Title: "camiones en"+" " +today,
          Author: "Pedidos 24",
          CreatedDate: new Date()
      };
      wb.SheetNames.push("camiones");

      var ws = XLSX.utils.json_to_sheet(jd,{header: ["PLACA","ORIGEN", "CAPACIDAD UNO","HORA INICIO JORNADA","HORA FIN JORNADA","HORA FIN JORNADA"]});
      wb.Sheets["camiones"] = ws;
      var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
  
      var buf = new ArrayBuffer(wbout.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf);  //create uint8array as viewer
      for (var i=0; i<wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF; 
      saveAs(new Blob([buf],{type:"application/octet-stream"}), 'camiones-'+today+'.xlsx');
    })
}

  const editar = (uid) => {
  console.log(uid);
    
      var edit=fire.firestore().collection("camiones").doc(uid);

      edit.update({
        "ORIGEN": origen,
        "CAPACIDAD UNO": capacidad,
        "HORA INICIO JORNADA":inicio,
        "HORA FIN JORNADA":fin,
     })
     .then(() => {
       setModaledit(false)
     })
     .catch((error) => {
       setModaledit(false)
       console.log(error)
     });
    
    


  
  }


  const toggleDetails = (index) => {
    
    const position = details.indexOf(index)
    let newDetails = details.slice()
    if (position !== -1) {
      newDetails.splice(position, 1)
    } else {
      newDetails = [...details, index]
    }
    setDetails(newDetails)
  }
  
  return (
    <>
     <CRow>
      <CCol  md="6" lg="4">
          <CCard>
        
              <CCardBody>
                  <CCol col="6" sm="6" md="12" xl className="mb-3 mb-xl-0">
                    <CButton onClick={()=> setmodaladd(true)} block color="primary">Agregar camion</CButton>
                  </CCol>
              </CCardBody>
          </CCard>
      </CCol >
      <CCol  md="6" lg="4">
          <CCard>
        
              <CCardBody>
                  <CCol col="6" sm="6" md="12" xl className="mb-3 mb-xl-0">
                    <CButton onClick={()=> subircamion(true)} block color="primary">Subir camiones</CButton>
                  </CCol>
              </CCardBody>
          </CCard>
      </CCol >
      </CRow>
    <CRow>
        <CCol >
        <CCard>
        <CCardHeader>
            Camiones
        </CCardHeader>
        <CCardBody>
        <CDataTable
        items={data}
        fields={fields}
        columnFilter
        tableFilter
        footer
        outlined
        itemsPerPageSelect
        itemsPerPage={50}
        
        sorter
        pagination
        scopedSlots = {{
           
            'show_details':
            (item, index)=>{
                return (
                <td className="py-2">
                    <CButton
                    color="primary"
                    variant="outline"
                    shape="square"
                    size="sm"
                    onClick={()=>{toggleDetails(index)}}
                    >
                    {details.includes(index) ? 'Cerrar' : 'Opciones'}
                    </CButton>
                </td>
                )
            },
            'details':
                (item, index)=>{
                return (
                <CCollapse show={details.includes(index)}>
                    <CCardBody>
                    
                    <p className="text-muted"> camion ingresado el: {item.fecha_import}</p>
                    <CButton onClick={()=> {setUidedit(item.uid);  setModaledit(true);}} size="sm" color="info">
                        Editar
                    </CButton> 
                    
                    </CCardBody>
                </CCollapse>
                )
            }
        }}
        />
            </CCardBody>
            </CCard>
            </CCol>
        </CRow>

        

            
    
            <CModal 
              show={modaledit} 
              onClose={() => setModal(false)}
              color="primary"
            >
              <CModalHeader closeButton>
                <CModalTitle>Editar</CModalTitle>
              </CModalHeader>
              <CModalBody>
              {alert === true && <CAlert color="danger">
                error
              </CAlert>}
              <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                              <CInputGroupText>
                              </CInputGroupText>
                            </CInputGroupPrepend>

                            <CInput type="text" placeholder="ORIGEN"  required 
                            value={origen}
                            onChange={(e) => setorigen(e.target.value) }/>
                          </CInputGroup>

                         

                          
                          <CInputGroup className="mb-3">
                            <CInputGroupPrepend>
                              <CInputGroupText>
                              </CInputGroupText>
                            </CInputGroupPrepend>

                            <CInput type="text" placeholder="CAPACIDAD UNO"  required 
                            value={capacidad}
                            onChange={(e) => setcapacidad(e.target.value) }/>
                          </CInputGroup>
                          
                          
                          <CInputGroup className="mb-3">
                            <CInputGroupPrepend>
                              <CInputGroupText>
                              </CInputGroupText>
                            </CInputGroupPrepend>

                            <CInput type="text" placeholder="HORA INICIO JORNADA"  required 
                            value={inicio}
                            onChange={(e) => setinicio(e.target.value) }/>
                          </CInputGroup>

                          <CInputGroup className="mb-3">
                            <CInputGroupPrepend>
                              <CInputGroupText>
                              </CInputGroupText>
                            </CInputGroupPrepend>

                            <CInput type="text" placeholder="HORA FIN JORNADA"  required 
                            value={fin}
                            onChange={(e) => setfin(e.target.value) }/>
                          </CInputGroup>    
              </CModalBody>
              <CModalFooter>
              <CButton color="danger" onClick={() => setModaledit(false)}>Cancelar</CButton>
                <CButton color="primary" onClick={() => editar(uidedit)}>Cambiar</CButton>
              </CModalFooter>
            </CModal>

            <CModal 
              show={modaladd} 
              onClose={() => setmodaladd(false)}
              color="primary"
              size ="lg"
            >
              <CModalHeader closeButton>
                <CModalTitle>Agregar</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CRow className="justify-content-center">
                  <CCol md="9" lg="12" xl="12">
                      {alert === true && <CAlert color="danger">
                      {alert_mensaje}
                    </CAlert>}

                    <CCard className="mx-4">
                      <CCardBody className="p-4">
                        <CForm>
                          <h1>Agregar</h1>

                      

                         
                          <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                              <CInputGroupText>
                              </CInputGroupText>
                            </CInputGroupPrepend>

                            <CInput type="text" placeholder="PLACA"  required 
                            value={placa}
                            onChange={(e) => setplaca(e.target.value) }/>
                          </CInputGroup>

                          <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                              <CInputGroupText>
                              </CInputGroupText>
                            </CInputGroupPrepend>

                            <CInput type="text" placeholder="ORIGEN"  required 
                            value={origen}
                            onChange={(e) => setorigen(e.target.value) }/>
                          </CInputGroup>

                         

                          
                          <CInputGroup className="mb-3">
                            <CInputGroupPrepend>
                              <CInputGroupText>
                              </CInputGroupText>
                            </CInputGroupPrepend>

                            <CInput type="text" placeholder="CAPACIDAD UNO"  required 
                            value={capacidad}
                            onChange={(e) => setcapacidad(e.target.value) }/>
                          </CInputGroup>
                          
                          
                          <CInputGroup className="mb-3">
                            <CInputGroupPrepend>
                              <CInputGroupText>
                              </CInputGroupText>
                            </CInputGroupPrepend>

                            <CInput type="text" placeholder="HORA INICIO JORNADA"  required 
                            value={inicio}
                            onChange={(e) => setinicio(e.target.value) }/>
                          </CInputGroup>

                          <CInputGroup className="mb-3">
                            <CInputGroupPrepend>
                              <CInputGroupText>
                              </CInputGroupText>
                            </CInputGroupPrepend>

                            <CInput type="text" placeholder="HORA FIN JORNADA"  required 
                            value={fin}
                            onChange={(e) => setfin(e.target.value) }/>
                          </CInputGroup>    

                         
                         
                        </CForm>
                      </CCardBody>
                  
                    </CCard>
            </CCol>
          </CRow>
              </CModalBody>
              <CModalFooter>
              <CButton color="danger" onClick={() => setmodaladd(false)}>Cancelar</CButton>
                <CButton color="primary" onClick={agregarcamion}>Agregar</CButton>
              </CModalFooter>
            </CModal>
         
            <CModal 
              show={modalsuss} 
              onClose={() => setmodalsuss(false)}
              color="success"
            >
              <CModalHeader closeButton>
                <CModalTitle>Éxito</CModalTitle>
              </CModalHeader>
              <CModalBody>
              Camion ingresado correctamente
              </CModalBody>
              <CModalFooter>
                <CButton color="success" onClick={() => setmodalsuss(false)}>Listo</CButton>
              </CModalFooter>
            </CModal>
    </>
  )
}

export default Tables;