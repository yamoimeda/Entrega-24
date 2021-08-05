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
  CContainer


} from '@coreui/react'
import { DocsLink } from 'src/reusable'
import usersData from '../users/UsersData'
import fire from '../../firebase';
import Cookies from "js-cookie";
import { AuthContext } from "../../Auth";
import { useHistory } from "react-router";

const getBadge = status => {

  switch (status) {
    case 0: return 'success'
    case 1: return 'secondary'
    default: return 'primary'
  }
}

const fields = [
    { key:"nombre" ,label: 'Nombre', _style: { width: '40%'} },
    { key:"correo" ,label: 'Correo' , _style: { width: '40%'}},
  
    { key:"tipo",label: 'Role', _style: { width: '20%'} },
    {
      key: 'show_details',
      label: '',
      _style: { width: '2%' },
      sorter: true,
      filter: false
    }
  ]





const Tables = () => {
  const { user,tipo } = useContext(AuthContext);
  const history = useHistory();

    const [details, setDetails] = useState([])
    const [uid, setuid] = useState();
    const [data, setData] = useState([]);
  // const [items, setItems] = useState(usersData)
useEffect(
    () => {
      
        (async () => {
        const uids=Cookies.get('uid');
        setuid(uids);
       var newdata= []
        
     
            await fire.firestore().collection("usuarios")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
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

  const agregar = () => {
    
     
    history.push({
      pathname:  "/dash/control/registrar"
   });
  };
  

  if (tipo != 0 ){

    return ( <div className="c-app c-default-layout flex-row align-items-center">
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md="6" lg="6">
          <div className="clearfix">
            <h4 className="pt-3">Oops!</h4>
            <p className="text-muted float-left">Esta pagina esta bloqueda</p>
          </div>
         
        </CCol>
      </CRow>
    </CContainer>
  </div>
  )
  }

  return (
    <>
 <CRow>
 <CCol  md="6" lg="4">
    <CCard>
   
        <CCardBody>
            <CCol col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
              <CButton onClick={agregar} block color="primary">Agregar usuario</CButton>
            </CCol>
        </CCardBody>
    </CCard>
    </CCol >
 </CRow>

    <CRow>
        <CCol >
        <CCard>
        <CCardHeader>
            Usuarios
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
            'tipo':
            (item)=>(
                <td>
                <CBadge color={getBadge(item.tipo)}>
                    {item.tipo === 0 ? 'Administrador': 'Cliente'}
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
                    {details.includes(index) ? 'Ocultar' : 'Mostrar'}
                    </CButton>
                </td>
                )
            },
            'details':
                (item, index)=>{
                return (
                <CCollapse show={details.includes(index)}>
                    <CCardBody>
                    <h4>
                        {item.uid}
                    </h4>
                    <p className="text-muted">User since: {item.cliente}</p>
                    <CButton size="sm" color="info">
                        User Settings
                    </CButton> 
                  <CButton size="sm" color="danger" className="ml-1">
                        Delete
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

    
    

      
    </>
  )
}

export default Tables;