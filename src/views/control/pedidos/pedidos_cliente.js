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

  const buscar = async  (cliente) =>{
    var newdatauser= {}
    var newdatauserarray= []
    const uids=Cookies.get('uid');
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

           //inicia
              if (tipo === 0  ){
                if(cliente === null || cliente === undefined || cliente === ''){
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
                  await   fire.firestore().collection("pedidos").where("cliente","==",cliente)
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

                  await   fire.firestore().collection("pedidos").where("cliente", "==", uids)
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

let clientes = datauser.length > 0
&& datauser.map((item, i) => {
return (
  <option key={i} value={item.uid}>{item.nombre}</option>
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