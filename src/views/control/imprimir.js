
import fire from '../../firebase';

import {writeToSelectedPrinter,onDeviceSelected} from './zebrasetuo';

export async function   imprimir (uids)  {
  var newdata= {}
  var newdatauser= {}
       await fire.firestore().collection("usuarios")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                
                newdatauser[doc.data().user_uid] = { nombre: doc.data().nombre}
            });

            
            
        }).then( ()=>{
          
            fire.firestore().collection("pedidos").where("uid", "==", uids)
             .get()
             .then((querySnapshot) => {
               querySnapshot.forEach((doc) => {
                 
                   var dd = {
                     cliente_nombre: newdatauser[doc.data().cliente].nombre,
                     ...doc.data()
                   }
                   
                   newdata =  dd
                  
               });
               writeToSelectedPrinter(newdata)
             })
            
   }
    
 )
 
}