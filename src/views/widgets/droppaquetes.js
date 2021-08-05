import React ,{useEffect, useState ,useContext}from 'react';
import {
  
  CRow,
  CCol,
  CWidgetIcon,
  CLink,
  CCardFooter,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import fire from '../../firebase';
import Cookies from "js-cookie";
import { AuthContext } from "../../Auth";

const Droppaquetes = () => {
    const {tipo } = useContext(AuthContext);
    const [uid, setuid] = useState();
    const [hoy, sethoy] = useState('0');
    const [hoyrevisado, setHoyrevisados] = useState('0');
    const [pedidoshoy, setPedidoshoy] = useState('0');
    const [pedidoshoyrevisado, setPedidoshoyrevisado] = useState('0');
  // const [items, setItems] = useState(usersData)
useEffect(
    () => {
      
        (async () => {
        const uids=Cookies.get('uid');
        setuid(uids);

        var cuenta= 0
       var today = new Date();
       var dd = String(today.getDate()).padStart(2, '0');
       var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
       var yyyy = today.getFullYear();

       today = dd + '-' + mm + '-' + yyyy;

       if (tipo === 0){
                await fire.firestore().collection("ordenes").where("fecha_import", "==", today)
                .get()
                .then((querySnapshot) => {   
                    sethoy(querySnapshot.size.toString())
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
                await fire.firestore().collection("pedidos").where("fecha_import", "==", today)
                .get()
                .then((querySnapshot) => {   
                    setPedidoshoy(querySnapshot.size.toString())
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            
               

       }else{
                await fire.firestore().collection("ordenes").where("cliente", "==", uids).where("fecha_import", "==", today)
                .get()
                .then((querySnapshot) => {   
                    setHoyrevisados(querySnapshot.size.toString())
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
                await fire.firestore().collection("ordenes").where("cliente", "==", uids).where("fecha_import", "==", today)
                .get()
                .then((querySnapshot) => {   
                    setPedidoshoyrevisado(querySnapshot.size.toString())
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            
       }
        
  
     })();
   
     
     

    },
    []
  );
  // render
  return (
    <CRow >
                <CCol xs="12" sm="3" lg="3">
                <CWidgetIcon 
                    text="Ordenes de hoy" 
                    header={hoy} 
                    color="light" 
                    iconPadding={false}
                    footerSlot={
                    <CCardFooter className="card-footer px-3 py-2">
                        <CLink
                        className="font-weight-bold font-xs btn-block text-muted"
                        href=  '#/dash/control/pedidos'
                        rel="noopener norefferer" 
                        target="_blank"
                        >
                        Ver todos
                        <CIcon name="cil-arrow-right" className="float-right" width="16"/>
                        </CLink>
                    </CCardFooter>
                    }
                >
                    <CIcon width={25} name="cil-inbox" className="mx-0"/>
                </CWidgetIcon>
                </CCol>

                <CCol xs="12" sm="3" lg="3">
                <CWidgetIcon 
                
                    text="Ordenes revisadas" 
                    header={hoyrevisado} 
                    color="dark" 
                    iconPadding={false}
                    footerSlot={
                    <CCardFooter className="card-footer px-3 py-2">
                        <CLink
                        className="font-weight-bold font-xs btn-block text-muted"
                        href="#/dash/control/pedidos"
                        rel="noopener norefferer" 
                        target="_blank"
                        >
                        Ver todos
                        <CIcon name="cil-arrow-right" className="float-right" width="16"/>
                        </CLink>
                    </CCardFooter>
                    }
                >
                    <CIcon width={25} name="cil-inbox" className="mx-0" color={'#0a2b4c'}/>
                </CWidgetIcon>
                </CCol>

                <CCol xs="12" sm="3" lg="3">
                <CWidgetIcon 
                
                    text="Pedidos de hoy" 
                    header={pedidoshoy} 
                    color="light" 
                    iconPadding={false}
                    footerSlot={
                    <CCardFooter className="card-footer px-3 py-2">
                        <CLink
                        className="font-weight-bold font-xs btn-block text-muted"
                        href="#/dash/control/pedidos"
                        rel="noopener norefferer" 
                        target="_blank"
                        >
                        Ver todos
                        <CIcon name="cil-arrow-right" className="float-right" width="16"/>
                        </CLink>
                    </CCardFooter>
                    }
                >
                    <CIcon width={25} name="cil-inbox" className="mx-0"/>
                </CWidgetIcon>
                </CCol>

                <CCol xs="12" sm="3" lg="3">
                <CWidgetIcon 
                
                    text="Pedidos revisados" 
                    header={pedidoshoyrevisado} 
                    color="dark" 
                    iconPadding={false}
                    footerSlot={
                    <CCardFooter className="card-footer px-3 py-2">
                        <CLink
                        className="font-weight-bold font-xs btn-block text-muted"
                        href="#/dash/control/pedidos"
                        rel="noopener norefferer" 
                        target="_blank"
                        >
                        Ver todos
                        <CIcon name="cil-arrow-right" className="float-right" width="16"/>
                        </CLink>
                    </CCardFooter>
                    }
                >
                    <CIcon width={25} name="cil-inbox" className="mx-0"/>
                </CWidgetIcon>
                </CCol>

        </CRow>
  )
}

export default Droppaquetes
