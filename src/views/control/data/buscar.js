import React, { useState, useEffect,useCallback }from 'react';

export async function getUsuarios(pagina){
    var newdatauser= {}
    const uids=Cookies.get('uid');
    setuid(uids);
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
                  
             await   fire.firestore().collection("ordenes").where("fecha_import","==",dia)
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

             await fire.firestore().collection("ordenes").where("cliente", "==", uids).where("fecha_import","==",dia)
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
    setbuscardata(false)
  return newdata
    

      return nueva;
  };
