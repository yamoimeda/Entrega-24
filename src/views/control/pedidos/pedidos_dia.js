import React, { useEffect, useState ,useContext} from "react";
import fire from '../../../firebase';
import Cookies from "js-cookie";
import { AuthContext } from "../../../Auth";
import TablaPedidos from "src/funciones/TablaPedidos";
import {
	CCard,
	CCardBody,
	CCol,
	CRow,
	CSelect,
  
  } from '@coreui/react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const Tables = () => {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = dd + '-' + mm + '-' + yyyy;
  	const { tipo } = useContext(AuthContext);
    const [info, setData] = useState({
      nombre:'Pedidos por Dia',
      loading:true,
    });
    const [datauser, setDatauser] = useState(false);
  // const [items, setItems] = useState(usersData)

  
useEffect(
    () => {
      const fetch = async () => {
        const datas = await buscar(today);
        setData({
			nombre:'Pedidos por Dia',
			loading:false,
			data:datas
        })
        
      };
      fetch();
    },
    []
  );

  const buscar = async  (dia) =>{
    var newdatauser= {}
    const uids=Cookies.get('uid');
   await fire.firestore().collection("usuarios")
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            
            newdatauser[doc.data().user_uid] = { nombre: doc.data().nombre}
        });
        setDatauser(newdatauser)

        
        
    }).catch((error) => {
      console.log("Error getting documents: ", error);
  });

    var newdata= []

           //inicia
              if (tipo === 0  ){
                  
             await   fire.firestore().collection("pedidos").where("fecha_import","==",dia)
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
              }else{

             await fire.firestore().collection("pedidos").where("cliente", "==", uids).where("fecha_import","==",dia)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        newdata.push( doc.data())
                    });
                    
                })
                .catch((error) => {
                    console.log("Error getting documents: ", error);
                });


              }

    //termina
    
  return newdata
    
  }

	const daychange = async (day) => {
		var dd = String(day.getDate()).padStart(2, '0');
		var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = day.getFullYear();
		var today = dd + '-' + mm + '-' + yyyy;
		const datas = await buscar(today);
		setData({
			nombre:'Pedidos por Dia',
			loading:false,
			data:datas
        })
	}

  return (
    <>
      <CRow>

      {tipo === 0 &&
      <CCol  md="6" lg="4">
          <CCard>
        
              <CCardBody>
                  <CCol col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        <DayPickerInput  placeholder={ 'click para filtrar fecha'} onDayChange={day => daychange(day)}/>
                  </CCol>
              </CCardBody>
          </CCard>
      </CCol > }
    </CRow>

      <TablaPedidos data={info} />
      
    </>
  )
}

export default Tables;