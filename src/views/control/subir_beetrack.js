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
import { CSVLink, CSVDownload, } from "react-csv";



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

const Dashboard = () => {
  const { user,tipo } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [datacsv, setDatacsv] = useState([]);
  const [datauser, setDatauser] = useState(false);
  const [loading,setloding] = useState(true);
  
  const [modal, setModal] = useState(false);
  
  const [details, setDetails] = useState([])
  
  const csvLinkEl = React.createRef();
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  today = dd + '-' + mm + '-' + yyyy;
  const encabezados = [
    { label: "Cliente", key: "Cliente" },
    { label: "Consignatario", key: "Consignatario" },
    { label: "Referencia", key: "Referencia" },
    { label: "ID Sitio de Carga", key: "ID Sitio de Carga" },
    { label: "Nombre Sitio de Carga", key: "Nombre Sitio de Carga" },
    { label: "ID Sitio de Entrega", key: "ID Sitio de Entrega" },
    { label: "Nombre Sitio de Entrega", key: "Nombre Sitio de Entrega" },
    { label: "Dirección Sitio de Entrega", key: "Dirección Sitio de Entrega" },
    { label: "Latitud Sitio de Entrega", key: "Latitud Sitio de Entrega" },
    { label: "Longitud Sitio de Entrega", key: "Longitud Sitio de Entrega" },
    { label: "Horario desde en Sitio de Entrega", key: "Horario desde en Sitio de Entrega" },
    { label: "Tiempo estimado para la entrega", key: "Tiempo estimado para la entrega" },
    { label: "Notas relevantes a la entrega", key: "Notas relevantes a la entrega" },
    { label: "SKU", key: "SKU" },
    { label: "Descripción", key: "Descripción" },
    { label: "Peso", key: "Peso" },
    { label: "Cantidad", key: "Cantidad" },
    { label: "ID Agente de at. cliente", key: "ID Agente de at. cliente" },
    { label: "Fecha de entrega", key: "Fecha de entrega" }
  ];

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
            
            newdatauser[doc.data().user_uid] = { nombre: doc.data().nombre,clienteid: doc.data().clienteid}
    
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
                          cliente_id: newdatauser[doc.data().cliente].clienteid,
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
    var contenido = []
         
    newdata.forEach((doc) => {
         
      var obect = 
      {"Cliente" : doc.cliente_id,
      "Consignatario":doc.consignatario,
      "Referencia":doc.uid,
      "ID Sitio de Carga":"",
      "Nombre Sitio de Carga":"",
      "ID Sitio de Entrega":doc["TELEFONO"] == "" || doc["TELEFONO"] == undefined  ?  doc.uid:doc["TELEFONO"],
      "Nombre Sitio de Entrega":"",
      "Dirección Sitio de Entrega":doc["DIRECCION"].replace(/"/g, ''),
      "Latitud Sitio de Entrega":doc["LATITUD"], 
      "Longitud Sitio de Entrega":doc["LONGITUD"],
      "Horario desde en Sitio de Entrega":"",
      "Horario hasta en Sitio de Entrega": "",
      "Tiempo estimado para la entrega":20, 
      "Notas relevantes a la entrega" : doc["NOTAS"] == "." ? "": doc["NOTAS"], 
      "SKU": doc.uid,
      "Descripción":doc["DESCRIPCION"], 
      "Peso":doc.peso, 
      "Cantidad":doc["CANTIDAD"],
      "ID Agente de at. cliente":"", 
      "Fecha de entrega":doc["FECHA MIN ENTREGA"]
      }
        //doc.data()
        contenido.push(obect)
    });
    setDatacsv(contenido)
  return newdata
    
  }


  const actualizar = ()=>{
    fire.firestore().collection("pedidos").where("status","==",4).get()
                  .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                      fire.firestore().collection("pedidos").doc( doc.data().uid).update({status:9})
                      
                    })
                  })
  
  }
  
  const subir = async () =>{
    console.log(datacsv);
        //jsson = contenido.map(Object.values)
  
       /*  var wb = XLSX.utils.book_new();
        wb.Props = {
            Title: "Pedidos subidos en"+" " +today,
            Author: "Pedidos 24",
            CreatedDate: new Date()
        };
        wb.SheetNames.push("Pedidos");
  
        var ws = XLSX.utils.json_to_sheet(contenido,{header: ["N° DOCUMENTO" ,"LATITUD", "LONGITUD",
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
   */
  
      csvLinkEl.current.link.click();
      actualizar();
      setModal(false) 
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
                    item.status === 7 ? 'No entregado':item.status === 8 ? 'En espera':'subido a Fitter'}
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
            <CSVLink
              headers={encabezados}
              filename={"Fitter"+today+".csv"}
              data={datacsv}
              ref={csvLinkEl}
        />
    </>
  )
}

export default Dashboard
