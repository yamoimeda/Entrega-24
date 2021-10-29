import React, { useEffect, useState ,useContext} from "react";
import fire from '../../../firebase';
import Cookies from "js-cookie";
import { AuthContext } from "../../../Auth";
import TablaPedidos from "src/funciones/TablaPedidos";
import { useLocation } from "react-router-dom";

const Tables = () => {
	const location = useLocation();
    const [uid, setuid] = useState();
    const [info, setData] = useState({
		nombre:'Pedidos de ' + location.parametro,
		loading:true,
	  });
    const [datauser, setDatauser] = useState(false);

    

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
                      setData({
						nombre:'Pedidos de '+ location.parametro,
						loading:false,
						data:newdata
					})
                    
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

 
  return (
    <>
    	<TablaPedidos data={info} />
    </>
  )
}

export default Tables;