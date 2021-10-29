import React, { useEffect, useState ,useContext} from "react";
import fire from '../../../firebase';
import Cookies from "js-cookie";
import { AuthContext } from "../../../Auth";
import TablaOrdenes from "src/funciones/TablaOrdedenes";

const Tables = () => {
  	const { tipo } = useContext(AuthContext);
    const [data, setData] = useState([]);
	const [info, setInfo] = useState({
		nombre:'Ordenes',
		loading:true,
	});
  // const [items, setItems] = useState(usersData)
  
useEffect(
    () => {
		const newdata= []
        const newdatauser= {}
		const uids=Cookies.get('uid');
		fire
			.firestore()
			.collection("ordenes")
			.onSnapshot((snapshot) => {
				snapshot.docChanges().forEach((change) => {
					let odata= data
					if (change.type === "modified") {
						console.log(odata);
					}
					if (change.type === "removed") {
						const newTodos = data.filter((t) => t.uid !==  change.doc.data().uid);
						/* setData(newTodos) */
					}
				});
			});
      
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
						.collection("ordenes")
						.get()
						.then((querySnapshot) => {
							querySnapshot.forEach((doc) => {
								var dd = {
									cliente_nombre: newdatauser[doc.data().cliente].nombre,
									...doc.data()
								}
								newdata.push( dd)
							});
							setInfo({
								nombre:'Ordenes',
								loading:false,
								data:newdata
							})
						})
					.catch((error) => {
					console.log("Error getting documents: ", error);
					});
				}else {

					fire.
						firestore()
						.collection("ordenes")
						.where("cliente", "==", uids)
						.get()
						.then((querySnapshot) => {
							querySnapshot.forEach((doc) => {
								// doc.data() is never undefined for query doc snapshots
								newdata.push( doc.data())
							});
							setInfo({
								nombre:'Ordenes',
								loading:false,
								data:newdata
							})
						})
						.catch((error) => {
							console.log("Error getting documents: ", error);
						});
				}
				
	//termina
			})
			.catch((error) => {
				console.log("Error getting documents: ", error);
			});
    },[]);


  return (
	<TablaOrdenes data={info} />
  )
}

export default Tables;