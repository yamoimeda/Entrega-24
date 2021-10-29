import React, { useEffect, useState ,useContext} from "react";
import fire from '../../../firebase';
import Cookies from "js-cookie";
import { AuthContext } from "../../../Auth";
import TablaPedidos from "src/funciones/TablaPedidos";
const Tables = () => {
 	const { tipo} = useContext(AuthContext);
    const [info, setData] = useState({
		nombre:'Pedidos',
		loading:true,
	});
  // const [items, setItems] = useState(usersData)
useEffect(
    () => {
        const uids=Cookies.get('uid');
        var newdata= []
        var newdatauser= {}
        fire
			.firestore()
			.collection("usuarios")
        	.get()
        	.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					
					newdatauser[doc.data().user_uid] = { nombre: doc.data().nombre}
				});
            
        	})
			.then( ()=>{
          
               //inicia
                if (tipo === 0  ){
                	fire
						.firestore()
						.collection("pedidos")
                  		.get()
                  		.then((querySnapshot) => {
							querySnapshot.forEach((doc) => {
								var dd = {
								  cliente_nombre: newdatauser[doc.data().cliente].nombre,
								  ...doc.data()
								}
								newdata.push( dd)
							});
							setData({
								nombre:'Pedidos',
								loading:false,
								data:newdata
							})
                  		})
					.catch((error) => {
						console.log("Error getting documents: ", error);
					});
                }else{

                  fire.firestore().collection("pedidos").where("cliente", "==", uids)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // doc.data() is never undefined for query doc snapshots
                            newdata.push( doc.data())
                        });
						setData({
							nombre:'Pedidos',
							loading:false,
							data:newdata
						})
                    })
                    .catch((error) => {
                        console.log("Error getting documents: ", error);
                    });


                  }

        //termina
        }
         
      )
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    },
    []
  );

  return (
    <>
   
        <TablaPedidos data={info} />
    </>
  )
}

export default Tables;