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
import { DocsLink } from 'src/reusable'
import usersData from '../users/UsersData'
import fire from '../../firebase';
import Cookies from "js-cookie";
import { AuthContext } from "../../Auth";
import CIcon from '@coreui/icons-react'
import { useLocation } from "react-router-dom";
import {imprimir} from './imprimir';
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
    { key: "FECHA MIN ENTREGA",label: 'Fecha de Entrega', _style: { width: '20%'} },
    { key:"status",label: 'status', _style: { width: '20%'} },
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
    const [modalerr, setModalerr] = useState(false);
    const [modaledit, setModaledit] = useState(false);
    const [data, setData] = useState([]);
    const [modaladd, setmodaladd] =useState(false)
    const [datauser, setDatauser] = useState(false);
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [catidad, setCantidad] = useState('');
    const [fechamin, setFechamin] = useState('');
    const [fechamax, setFechamax] = useState('');
    const [contacto, setContacto] = useState('');
    const [telefono, setTelefono] = useState('');
    const [correo, setCorreo] = useState('');
    const [alert_mensaje, setAlertmensaje] = useState('');

    const location = useLocation();

  // const [items, setItems] = useState(usersData)
useEffect(
    () => {

     

     

        (async () => {
        const uids=Cookies.get('uid');
        setuid(uids);
        var newdata= []

        var newdatauser= {}
        fire.firestore().collection("usuarios")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                
                newdatauser[doc.data().user_uid] = { nombre: doc.data().nombre}
            });
            setDatauser(newdatauser)

            
            
        }).then( ()=>{
               //inicia
                
               fire.firestore().collection("pedidos").where(location.campo.toString(), "==", location.parametro.toString())
                  .get()
                  .then((querySnapshot) => {
                   
                    querySnapshot.forEach((doc) => {
                     
                        var dd = {
                          cliente_nombre: newdatauser[doc.data().cliente].nombre,
                          ...doc.data()
                        }
                        newdata.push( dd)
                      });
                      setData(newdata)
                    
                  })
                  .catch((error) => {
                    console.log("Error getting documents: ", error);
                  });
                  

        //termina
        }
         
      )
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
      


        
          
        
  
     })();
   
     
     

    },
    []
  );

  const borrar = (uid) => {
    fire.firestore().collection("pedidos").doc(uid).delete().then(() => {
      setModal(false)
  }).catch((error) => {
      setModalerr(true)
  });

  }

  const editar = (uid,status) => {
  
    if (status.length <= 0){
      setAlert(true);
    }else{
      var edit=fire.firestore().collection("pedidos").doc(uid);

      edit.update({
         status: parseInt(status)
     })
     .then(() => {
       setModaledit(false)
     })
     .catch((error) => {
       setModaledit(false)
       setModalerr(true)
       console.log(error)
     });
    }
    


  
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
  const agregar = (index) => {


  }
  
  return (
    <>
    

    <CRow>
        <CCol >
        <CCard>
        <CCardHeader>
            Pedidos
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
                    <CButton onClick={()=> {setUidedit(item.uid);  setModaledit(true);}} size="sm" color="info">
                        Cambiar Estado
                    </CButton> 
                    {tipo === 0 && <CButton onClick={()=> {setUidborrar(item.uid);  setModal(true);}} size="sm" color="danger" className="ml-1">
                        Borrar
                    </CButton> }
                    <CButton onClick={()=> {imprimir(item.uid)}} size="sm" color="success" className="ml-1">
                        Imprimir
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
              show={modal} 
              onClose={() => setModal(false)}
              color="warning"
            >
              <CModalHeader closeButton>
                <CModalTitle>Cuidado</CModalTitle>
              </CModalHeader>
              <CModalBody>
               ¿Estas seguro de Borrar este pedido pedido?
              </CModalBody>
              <CModalFooter>
                <CButton color="danger" onClick={() => setModal(false)}>Cancelar</CButton>
                <CButton color="primary" onClick={() => borrar(uidborrar)}>Si</CButton>
              </CModalFooter>
            </CModal>

            <CModal 
              show={modalerr} 
              onClose={() => setModal(false)}
              color="danger"
            >
              <CModalHeader closeButton>
                <CModalTitle>Lo sentimos</CModalTitle>
              </CModalHeader>
              <CModalBody>
              No se pudo completar la operación. Intente de nuevo
              </CModalBody>
              <CModalFooter>
                <CButton color="danger" onClick={() => setModalerr(false)}>ok</CButton>
              </CModalFooter>
            </CModal>
    
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
                Seleccione una opción
              </CAlert>}
                  <CFormGroup row>
                        <CCol md="3">
                            <CLabel htmlFor="select">Estado</CLabel>
                        </CCol>
                        <CCol xs="12" md="9">
                            <CSelect required custom name="select" id="select" onChange={(e) => setEstatus(e.target.value) }>
                            <option value='' >Please select</option>
                                <option value={4}>Aceptados</option>
                                <option value={5}>Rechazados</option>
                                <option value={8}>En espera</option>
                                <option value={6}>Devuelto</option>
                                <option value={3}>Entregados</option>
                                <option value={0}>Por recoger</option>
                                <option value={1}>En transito</option>
                                <option value={7}>No entregado</option>
                                <option value={9}>Subido a beetrack</option>
                        
                            </CSelect>
                        </CCol>
                    </CFormGroup>
              </CModalBody>
              <CModalFooter>
              <CButton color="danger" onClick={() => setModaledit(false)}>Cancelar</CButton>
                <CButton color="primary" onClick={() => editar(uidedit,status)}>Cambiar</CButton>
              </CModalFooter>
            </CModal>

            
         
      
    </>
  )
}

export default Tables;