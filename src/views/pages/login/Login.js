import React from 'react'
import { useHistory } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import logo from '../../../assets/icons/Logoentrega24.png';
import fire from '../../../firebase';
import Cookies from "js-cookie";

class Login extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      usuario:undefined,
      correo:'',
      contrasena:'',
      errorcontrasena:'',
      errorcorreo:'',
      tienecuenta:false,
      loading: false

      
    }
    
    
  }

  limpiarinputs = async () =>{
    await this.setState({correo:'',contrasena:''})
  }

  limpiarerror = async () =>{
    await this.setState({errorcorreo:'',errorcontrasena:''})
  }

 
  
  handlelogin =  () => {
    
    this.limpiarerror();
    fire
      .auth()
      .signInWithEmailAndPassword(this.state.correo,this.state.contrasena)
      .then(()=>{
       this.redirigir();
        
    
      })
      .catch((err) => {
        switch ( err.code) {
          case 'auth/invalid-email':
          case 'auth/user-disable':
          case 'auth/user-not-found':
            this.setState({errorcorreo:err.message,correo:''});
            break;
          case 'auth/wrong-password':
            this.setState({errorcontrasena:err.messege,contrasena:'' });
            
            break;
          default:  return;
          
        }
        return;
      })
     

  }

  handleregistro = async () => {
    
    this.limpiarerror();
    fire
      .auth()
      .createUserWithEmailAndPassword(this.state.correo,this.state.contrasena)
      .catch((err) => {
        switch ( err.code) {
          case 'auth/email-already-in-use':
          case 'auth/ivalid-email':
            this.setState({errorcorreo:err.messege});
            break;
          case 'auth/weak-password':
            this.setState({errorcontrasena:err.messege});
            break;
        }
      })
      
      

  }

  redirigir = () =>{
    this.setState({loading:true})
    var isauth = Cookies.get("isauth")
    console.log(isauth);
    if( isauth !==  'true') {

      setTimeout(this.redirigir, 2000);
      return;
  }
    this.props.history.push("/dash");
    this.setState({loading:false})

  
     
    
  


    }
   
    
    
  
  

  handelsigout  = async () => {
    fire.auth().signOut();
    
    }
  
  ingresar   = () =>  {
    this.handlelogin();

  };


  render() {

    if (this.state.loading) {

      return  <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse">
      
      </div>
    </div>
    }
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
    <CContainer>
      <CRow className="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard className="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p className="text-muted">Inicia sesión con tus credenciales</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="Usuario" autoComplete="username" 
                    autoFocus 
                    required 
                    value={this.state.correo}
                    onChange={(e) => this.setState({correo:e.target.value}) } 
                     />
                     
                  </CInputGroup>
                  
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Contraseña" autoComplete="current-password"  
                    autoFocus 
                    required 
                    value={this.state.contrasena}
                    onChange={(e) => this.setState({contrasena:e.target.value}) }
                    />
                    
                  </CInputGroup>
                  
                  <CRow>
                    <CCol xs="6">
                      <CButton onClick={this.handlelogin}  color="dark" className="px-4">Ingresar</CButton>
                    </CCol>
                   
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard className="text-white py-5 d-md-down-none" style={{ backgroundColor: '#04101e' }}>
              <CCardBody  className="text-center">
                <img   style={{ inlineSize: '90%'}} className= "logodelogin"  src={logo} />
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
  );
  }


}


export default Login
