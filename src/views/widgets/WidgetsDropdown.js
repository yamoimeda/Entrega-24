import React,{useContext,useState,useEffect} from 'react'
import {
  CWidgetDropdown,
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import ChartLineSimple from '../charts/ChartLineSimple'
import ChartBarSimple from '../charts/ChartBarSimple';
import { AuthContext } from "../../Auth";
import fire from '../../firebase';
import Cookies from "js-cookie";


const WidgetsDropdown = () => {
  const { user,tipo } = useContext(AuthContext);
  const [uid, setuid] = useState();
  const [hoy, sethoy] = useState('0');
  const [hoyoredenes ,sethoyordenes] = useState('0');


  useEffect(
    () => {
      
        (async () => {
        const uids=Cookies.get('uid');
        setuid(uids);

        var cuenta= 0
      

       if (tipo === 0){
         
                await fire.firestore().collection("pedidos")
                .get()
                .then((querySnapshot) => {   
                    sethoy(querySnapshot.size.toString())
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });

                await fire.firestore().collection("ordenes")
                .get()
                .then((querySnapshot) => {   
                    sethoyordenes(querySnapshot.size.toString())
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });
            
               

       }else{
                await fire.firestore().collection("pedidos").where("cliente", "==", uids)
                .get()
                .then((querySnapshot) => {   
                    sethoy(querySnapshot.size.toString())
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
      <CCol sm="6" lg="6">
        <CWidgetDropdown
          color="gradient-dark"
          header={hoyoredenes}
          text="Ordenes"
          
          footerSlot={
            <ChartLineSimple
              pointed
              className="c-chart-wrapper mt-3 mx-3"
              style={{height: '20px'}}
              dataPoints={[hoy, hoy, hoy, hoy, hoy, hoy, hoy]}
              pointHoverBackgroundColor="primary"
              label="Paquetes"
              labels="Mes"
            />
          }
        >
        </CWidgetDropdown>
      </CCol>
      <CCol sm="6" lg="6">
        <CWidgetDropdown
          color="gradient-dark"
          header={hoy}
          text="Paquetes"
          
          footerSlot={
            <ChartLineSimple
              pointed
              className="c-chart-wrapper mt-3 mx-3"
              style={{height: '20px'}}
              dataPoints={[hoy, hoy, hoy, hoy, hoy, hoy, hoy]}
              pointHoverBackgroundColor="primary"
              label="Paquetes"
              labels="Mes"
            />
          }
        >
        </CWidgetDropdown>
      </CCol>

     
    </CRow>
  )
}

export default WidgetsDropdown
