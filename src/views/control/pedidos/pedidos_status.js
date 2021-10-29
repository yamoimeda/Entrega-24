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
const Tables = () => {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = dd + '-' + mm + '-' + yyyy;
  	const { tipo } = useContext(AuthContext);
    const [info, setData] = useState({
      nombre:'Pedidos por clientes',
      loading:true,
    });
    const [lista, setLista] = useState([
      {nombre:'Aceptados',valor:4},
      {nombre:'Rechazados',valor:5},
        {nombre:'En espera',valor:8},
      {nombre:'En transito',valor:1},
      {nombre:'Devuelto',valor:6},
      {nombre:'Entregados',valor:3},
        {nombre:'Por recoger',valor:0},
      {nombre:'No entregado',valor:7}]);
    const [datauser, setDatauser] = useState(false);
  // const [items, setItems] = useState(usersData)

  
useEffect(
    () => {
      const fetch = async () => {
        const datas = await buscar(null);
        setData({
			nombre:'Pedidos por clientes',
			loading:false,
			data:datas
		})
        
      };
      fetch();
    },
    []
  );

  const buscar = async  (stat) =>{
	  	let status
		if(stat === null || stat === undefined || stat === ''){
			status = stat
		}else{
			status = parseInt(stat)
			
		}
		var newdatauser= {}
		const uids=Cookies.get('uid');
		await fire.firestore().collection("usuarios")
		.get()
		.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					
					newdatauser[doc.data().user_uid] = { nombre: doc.data().nombre}
				});
				setDatauser(newdatauser)
				
			})
		.catch((error) => {
			console.log("Error getting documents: ", error);
		});

    var newdata= []

           //inicia
           if (tipo === 0  ){
            if(status === null || status === undefined || status === ''){
              await   fire.firestore().collection("pedidos")
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
              await   fire.firestore().collection("pedidos").where("status","==",status)
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
            }
        
          }else{

            if(status === null || status === undefined || status === ''){
              await  fire.firestore().collection("pedidos").where("cliente", "==", uids)
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
              await    fire.firestore().collection("pedidos").where("cliente", "==", uids).where("status","==",status)
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
            }
           

          }

    //termina
  
  return newdata
    
  }
 	const daychange = async (cliente) => {
			const datas = await buscar(cliente);
			setData({
				nombre:'Pedidos por clientes',
				loading:false,
				data:datas
			})
	}

  let clientes = lista.length > 0
    	&& lista.map((item, i) => {
      return (
        <option key={i} value={item.valor}>{item.nombre}</option>
      )
    }, this);

  return (
    <>
      <CRow>

      {tipo === 0 &&
      <CCol  md="6" lg="4">
          <CCard>
        
              <CCardBody>
                  <CCol col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                  <CSelect required custom name="select" id="select" onChange={(e) => daychange(e.target.value)}>
                                <option value='' >Please select</option>
                                {clientes}
                          
                        
                            </CSelect>
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