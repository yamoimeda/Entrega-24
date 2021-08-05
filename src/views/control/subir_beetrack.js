import React, { useEffect, useState ,useContext} from "react";
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CCallout,
  CWidgetProgress,
  CWidgetIcon,
  CWidgetProgressIcon,
  CWidgetSimple,
  CLink,
  CDataTable,
  CCollapse,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CModalBody,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import XLSX from 'xlsx';
import MainChartExample from '../charts/MainChartExample.js';
import fire from '../../firebase'; 
import { saveAs } from 'file-saver'
import { object } from 'prop-types';
import { AuthContext } from "../../Auth";
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
  { key:"NOMBRE PROD" ,label: 'Nombre Prod', _style: { width: '40%'} },
  { key:"cliente_nombre" ,label: 'Cliente'},
  { key:"DIRECCION" ,label: 'Dirección'},
  { key:"TELEFONO" , label: 'Telefono', _style: { width: '20%'} },
  { key:"CORREO" ,label: 'Correo', _style: { width: '20%'} },
  { key:"NOMBRE CONTACTO",label: 'Nombre contacto', _style: { width: '20%'} },
  { key: "FECHA MAX ENTREGA",label: 'Fecha Max Entrega', _style: { width: '20%'} },
  { key:"status",label: 'status', _style: { width: '20%'} },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    sorter: false,
    filter: false
  }
]

const subirapi= (data,today)=>{
var jd= []
  data.forEach((doc) => {


    var stop = {"tags": [
        {
          "type": "Type 1",
          "values": [
            "Value 1",
            "Value 2"
          ]
        },
        {
          "type": "Type 2",
          "values": [
            "Value 3",
            "Value 4"
          ]
        }
      ],
      "items": [
        {
          "code": doc["CODIGO ITEM"],
          "cost": 0,
          "quantity": doc["CANTIDAD"],
          "capacities": [
            1
          ],
          "description": ""
        }
      ],
      "groups": [
        {
          "name": today,
          "names": [
            "Value One",
            "Value Two"
          ]
        }
      ],
      "address": doc["DIRECCION"],
      "contact": {
        "name": doc["NOMBRE CONTACTO"],
        "email":  doc["EMAIL CONTACTO"],
        "phone":doc["TELEFONO"],
        "identification": doc["IDENTIFICADOR CONTACTO"]
  },
      "priority": 5,
      "identifier": "",
      "window_one_end": doc["MAX VENTANA HORARIA 1"],
      "window_two_end": "",
      "dispatch_center": "entrega24",
      "window_one_start": doc["MIN VENTANA HORARIA 1"],
      "window_two_start": "",
      "max_dispatch_date":  doc["FECHA MAX ENTREGA"],
      "min_dispatch_date": doc["FECHA MIN ENTREGA"]
    }
      //doc.data()
      jd.push(stop)
  });
return jd
}

const actualizar = ()=>{
  fire.firestore().collection("pedidos").where("status","==",4)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    fire.firestore().collection("pedidos").doc( doc.data().uid).update({status:9})
                    
                  })
                })

}

const subir = async () =>{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
  
    today = dd + '-' + mm + '-' + yyyy;
   

    
    var jsson;
    var jd = []
    await fire.firestore().collection("pedidos").where("status","==",4)
    .get()
    .then((querySnapshot) => {
       
      querySnapshot.forEach((doc) => {
         
        var obect = 
        {"N° DOCUMENTO" : doc.data().uid,"LATITUD":"", "LONGITUD":"",
        "DIRECCION":doc.data()["DIRECCION"], "NOMBRE ITEM":doc.data()["NOMBRE PROD"] , "CANTIDAD": doc.data()["CANTIDAD"],
        "CODIGO ITEM":doc.data().uid, "FECHA MIN ENTREGA" : doc.data()["FECHA MIN ENTREGA"], "FECHA MAX ENTREGA": doc.data()["FECHA MAX ENTREGA"],
        "MIN VENTANA HORARIA 1":doc.data().min_horario , "MAX VENTANA HORARIA 1":doc.data().max_horario, "MIN VENTANA HORARIA 2":"",
        "MAX VENTANA HORARIA 2":"", "COSTO ITEM":"", "CAPACIDAD UNO":"",
        "CAPACIDAD DOS":"", "SERVICE TIME":"", "IMPORTANCIA":"",
        "IDENTIFICADOR CONTACTO":doc.data().cliente, "NOMBRE CONTACTO":doc.data()["NOMBRE CONTACTO"], "TELEFONO":doc.data()["TELEFONO"],
        "EMAIL CONTACTO": doc.data()["CORREO"], "CT ORIGEN":doc.data().ct_origen}
          //doc.data()
          jd.push(obect)
      });
      //jsson = jd.map(Object.values)

      var wb = XLSX.utils.book_new();
      wb.Props = {
          Title: "Pedidos subidos en"+" " +today,
          Author: "Pedidos 24",
          CreatedDate: new Date()
      };
      wb.SheetNames.push("Pedidos");

      var ws = XLSX.utils.json_to_sheet(jd,{header: ["N° DOCUMENTO" ,"LATITUD", "LONGITUD",
      "DIRECCION", "NOMBRE ITEM", "CANTIDAD","CODIGO ITEM", "FECHA MIN ENTREGA", "FECHA MAX ENTREGA",
      "MIN VENTANA HORARIA 1" , "MAX VENTANA HORARIA 1", "MIN VENTANA HORARIA 2",
      "MAX VENTANA HORARIA 2", "COSTO ITEM", "CAPACIDAD UNO",
      "CAPACIDAD DOS", "SERVICE TIME", "IMPORTANCIA",
      "IDENTIFICADOR CONTACTO", "NOMBRE CONTACTO", "TELEFONO",
      "EMAIL CONTACTO", "CT ORIGEN"]});
      wb.Sheets["Pedidos"] = ws;
      var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
  
      var buf = new ArrayBuffer(wbout.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf);  //create uint8array as viewer
      for (var i=0; i<wbout.length; i++) view[i] = wbout.charCodeAt(i) & 0xFF; 
      saveAs(new Blob([buf],{type:"application/octet-stream"}), 'pedidos-'+today+'.xlsx');


    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

   
    var st =subirapi(jd,today)
    var body = `{"name": "Stop Group Test","stops": ${JSON.stringify(st)}}`


    var sURL = 'https://api.planner.beetrack.com/v1/stop_groups' ; 
    var auth = '12a34bcdef5g6789h012ij34567k890123lmn45o67p89q0rs1tuv23wxy456z78' ;
    
    var request = require('request');
    var options = {
      'method': 'POST',
      'url': sURL,
      'headers': {
        'Authorization': "entrega24",
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    request(options, function (error, response) {
     
    });
    actualizar();
}

const Dashboard = () => {
  const { user,tipo } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [datauser, setDatauser] = useState(false);
  const [loading,setloding] = useState(true);
  
  const [modal, setModal] = useState(false);
  
  const [details, setDetails] = useState([])

  useEffect(
    () => {
      
     
      const fetch = async () => {
        const datas = await buscar();
        setData(datas)
        
      };
  
      fetch();

        
   
     
     

    },
    []
  );

 


  const buscar = async  () =>{
    var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + '-' + mm + '-' + yyyy;
    var newdatauser= {}
    var newdatauserarray= []
   await fire.firestore().collection("usuarios")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            
            newdatauser[doc.data().user_uid] = { nombre: doc.data().nombre}
    
            newdatauserarray.push({nombre:doc.data().nombre, uid:doc.data().user_uid})
        });
        setDatauser(newdatauserarray)

        
        
    }).catch((error) => {
      console.log("Error getting documents: ", error);
  });

    var newdata= []

                  await   fire.firestore().collection("pedidos").where("status","==",4)
                  .get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      
                        var dd = {
                          cliente_nombre: newdatauser[doc.data().cliente].nombre,
                          ...doc.data()
                        }
                        newdata.push( dd)
                    });
                   
                  })
                  .catch((error) => {
                    console.log("Error getting documents: ", error);
                  });

               
            
             

    //termina
    setloding(false)
  return newdata
    
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
 
  if (loading) {
    return <></>
    
  } else  if(tipo != 0){
    return (
      <CRow>
        <h1>Pagina no accesible</h1>
            
      </CRow>
    )
  }

  return (
    <>
    <CRow>
      <CCol  md="6" lg="6">
          <CCard>
        
              <CCardBody>
                  <CCol col="6" sm="4" md="12" xl className="mb-3 mb-xl-0">
                  <CButton block color="primary" onClick={()=> setModal(true)}>Subir Pedidos</CButton>
                  </CCol>
              </CCardBody>
          </CCard>
      </CCol >
    </CRow>
      

      <CRow>
        <CCol >
        <CCard>
        <CCardHeader>
            Pedidos a subir
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
            'status':
            (item)=>(
                <td>
                <CBadge color={getBadge(item.status)}>
                   
                {item.status === 0 ? 'Por recoger':item.status === 1 ? 'En transito':  
                    item.status === 3 ? 'Entregados':item.status === 4 ? 'Aceptados':  item.status === 5 ? 'Rechazados':item.status === 6 ? 'Devuelto':
                    item.status === 7 ? 'No entregado':item.status === 8 ? 'En espera':'subido a beetrack'}
                </CBadge>
                </td>
            ),
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
                    
                    <p className="text-muted"> Nombre de cliente: {item.cliente_nombre},  Pedido ingresado el: {item.fecha_import}</p>
                    
  

                    
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
              show={modal} 
              onClose={() => setModal(false)}
              color="warning"
            >
              <CModalHeader closeButton>
                <CModalTitle>Cuidado</CModalTitle>
              </CModalHeader>
              <CModalBody>
               ¿Estas seguro de subir los pedios a beetrack?
              </CModalBody>
              <CModalFooter>
                <CButton color="danger" onClick={() => setModal(false)}>Cancelar</CButton>
                <CButton color="primary" onClick={() => subir()}>Si</CButton>
              </CModalFooter>
            </CModal>
    </>
  )
}

export default Dashboard
