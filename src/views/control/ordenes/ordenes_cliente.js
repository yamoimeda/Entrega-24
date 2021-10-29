import React, { useEffect, useState ,useContext} from "react";
import fire from '../../../firebase';
import Cookies from "js-cookie";
import { AuthContext } from "../../../Auth";
import TablaOrdenes from "src/funciones/TablaOrdedenes";
import {
	CCard,
	CCardBody,
	CCol,
	CRow,
	CSelect,
  
  } from '@coreui/react';


const Tables = () => {
  	const { user,tipo } = useContext(AuthContext);
    const [uid, setuid] = useState();
	const [info, setData] = useState({
		nombre:'Ordenes por Clientes',
		loading:true,
	});
    const [datauser, setDatauser] = useState([]);
    const [cliente, setCliente] = useState();
    const [loading,setloding] = useState(true)
  // const [items, setItems] = useState(usersData)

  
  useEffect(
    () => {
      	const fetch = async () => {
				const datas = await buscar(cliente);
				setData({
					nombre:'Ordenes por Clientes',
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
    setuid(uids);
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
              await   fire.firestore().collection("ordenes")
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
              await   fire.firestore().collection("ordenes").where("cliente","==",cliente)
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

              await   fire.firestore().collection("ordenes").where("cliente", "==", uids)
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

            
    //termina
    setloding(false)
  return newdata
    
  }

  const daychange = async (cliente) => {
      	const datas = await buscar(cliente);
	  	setData({
			nombre:'Ordenes por Clientes',
			loading:false,
			data:datas
		})
  }


  if (loading) {
    return <></>
    
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
      <CCol  md="6" lg="4">
          <CCard>
        
              <CCardBody>
                  <CCol col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                  <CSelect required custom name="select" id="select" onChange={(e) => daychange(e.target.value) }>
                                <option value='' >Todos</option>
                                {clientes}
                          
                        
                            </CSelect>
                  </CCol>
              </CCardBody>
          </CCard>
      </CCol >
    </CRow>
    <TablaOrdenes data={info} />
    </>
  )
}

export default Tables;