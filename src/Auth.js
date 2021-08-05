import React, {createContext, useEffect, useState} from "react";
import Cookies from "js-cookie";
import fire from './firebase';
import { Redirect } from "react-router";
import {setup} from './views/control/zebrasetuo';
export const AuthContext = createContext({
  user: null, isAuth: null, login: () => {
  }, logout: () => {
  }
});

function AuthProvider({ children }) {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [photo, setphoto] = useState(null);
  const [clientes, setDatauser] = useState([]);
  const [devices, setdevices] = useState([]);
  const [setu, setSetu] = useState(false);
  useEffect(
    () => {

      if(!setu){
        var xebra = setup();
        setdevices(xebra.devices);
        setSetu(true)

      }
   
      var newdatauser= {}
      var newdatauserarray= []
    fire.firestore().collection("usuarios")
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

      fire.auth().onAuthStateChanged(user =>{
        const userCookie = Cookies.get('user');
        if (user){
          login(user.refreshToken,user.uid)
         
          setLoading(false);

          fire.firestore().collection("usuarios").where("user_uid", "==", user.uid)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                setphoto(doc.data().photo);
                setTipo(doc.data().tipo)
            });
            
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
       
    
          // sessionStorage.setItem('token', JSON.stringify(user.refreshToken));
          // sessionStorage.setItem('uid', JSON.stringify(user.uid));
         
          
          return ;
        } else{
         
          setLoading(false);
          setIsAuth(false);
        }
        
        
      })
      
     
    },
    [user,devices]
  );

  const login = (token, user) => {
    if(user) {
      setIsAuth(true);
      Cookies.set("isauth", true);
      Cookies.set("user", user);
      Cookies.set("uid", user);
      Cookies.set("access_token", token["access_token"]);
      Cookies.set("access_expiry", token["access_expiry"]);
      setUser(user);
      
    }
  };

  const logout = () => {
    Cookies.remove("isauth");
    Cookies.remove("user");
    Cookies.remove("uid");
    Cookies.remove("access_token");
    Cookies.remove("access_expiry");
    setUser(null);
    fire.auth().signOut();
  };

  if (loading) {
    return   <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse">
    
    </div>
  </div>
  ;
  }
  return (
    <AuthContext.Provider
      value={{
        user: Cookies.get("user"),
        isAuth: isAuth,
        login: login,
        logout: logout,
        photo: photo,
        tipo: tipo,
        clientes:clientes,
        devices: devices
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;