import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CAlert,
  CFormGroup,
  CSelect,
  CLabel,
  CModal,
  CModalHeader,
  CModalFooter,
  CModalBody,
  CModalTitle
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import fire from '../../firebase';


class Register extends React.Component {
  
    constructor(props) {
      super(props);
      this.state = {
        usuario:undefined,
        correo:'',
        contrasena:'',
        rcontrasena:'',
        errorcorreo:'',
        tipo:'',
        tienecuenta:false,
        loading: false,
        alert:false,
        alert_mensaje:'',
        modal:false,
        nombre:''
  
        
      } 
    }

    limpiarinputs = async () =>{
        await this.setState({correo:'',contrasena:'',rcontrasena:'',tipo:'',nombre:''})
      }

    registrar=()=>{
        
        if (this.state.correo.length <= 0 || this.state.contrasena.length <= 0 || this.state.rcontrasena.length <= 0 || this.state.tipo.length <= 0 || this.state.tipo === '' || this.state.nombre.length <= 0   ) {
           
            return
       
    }
    if (this.state.contrasena === this.state.rcontrasena ){
        this.handleregistro()
    }else{
        this.setState({alert:true, alert_mensaje:'Contraseñas no coiciden'});
    }
    
}

    regresar=()=>{
        this.props.history.push("/dash/control/salir");
    }

    handleregistro = () => {
        var db = fire.firestore();
        var data = db.collection("usuarios").doc()
        fire
          .auth()
          .createUserWithEmailAndPassword(this.state.correo,this.state.contrasena)
          .then(
            (user_data) => {
                data.set({
                    uid: data.id,
                    tipo:parseInt(this.state.tipo),
                    user_uid: user_data.user.uid,
                    correo: user_data.user.email,
                    nombre: this.state.nombre,
                    photo:'none'
                
                })
                this.setState({modal:true})
                this.limpiarinputs();

              }
           
            
          )
          .catch((error) => {
           
              console.error("Error writing document: ", error);
          })
          .catch((err) => {
            switch ( err.code) {
              case 'auth/email-already-in-use':
              case 'auth/ivalid-email':
                this.setState({alert:true, alert_mensaje:'correo inválido o ya esta en uso'});
                break;
              case 'auth/weak-password':
                this.setState({alert:true, alert_mensaje:'Contraseña débil '});
                break;
            }
          })
          
          
    
      }
render(){
  return (
    <div className="">
         <CCol xs="4" md="4" lg="2">
         <CButton onClick={this.regresar} color="primary" block>Regresar</CButton>
         </CCol>
      <CContainer>
          
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            {this.state.alert === true && <CAlert color="danger">
                {this.state.alert_mensaje}
              </CAlert>}
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Registrar</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-user" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="Nombre" autoComplete="username" required 
                    value={this.state.nombre}
                    onChange={(e) => this.setState({nombre:e.target.value}) }/>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>@</CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="text" placeholder="Correo" autoComplete="email"  autoFocus  required 
                    value={this.state.correo}
                    onChange={(e) => this.setState({correo:e.target.value}) }/>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Contraseña" autoComplete="new-password" required 
                    value={this.state.contrasena}
                    onChange={(e) => this.setState({contrasena:e.target.value}) } />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupPrepend>
                      <CInputGroupText>
                        <CIcon name="cil-lock-locked" />
                      </CInputGroupText>
                    </CInputGroupPrepend>
                    <CInput type="password" placeholder="Repita Contraseña" autoComplete="new-password" required 
                    value={this.state.rcontrasena}
                    onChange={(e) => this.setState({rcontrasena:e.target.value}) } />
                  </CInputGroup>
                  <CFormGroup row>
                    <CCol md="3">
                        <CLabel htmlFor="select">Role</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                        <CSelect required custom name="select" id="select" onChange={(e) => this.setState({tipo:e.target.value}) }>
                            <option value='' >Please select</option>
                            <option value={0}>Administrador</option>
                            <option value={1}>Cliente</option>
                    
                        </CSelect>
                    </CCol>
                </CFormGroup>
                  <CButton onClick={this.registrar} color="success" block>Crear Cuenta</CButton>
                </CForm>
              </CCardBody>
          
            </CCard>
          </CCol>
        </CRow>
        
      </CContainer>
      <CModal 
              show={this.state.modal} 
              onClose={() => this.setState({modal:false})}
              color="success"
            >
              <CModalHeader closeButton>
                <CModalTitle>Modal title</CModalTitle>
              </CModalHeader>
              <CModalBody>
                Usuario creado correctamente
              </CModalBody>
              <CModalFooter>
                <CButton color="success" onClick={() => this.setState({modal:false})}>Listo</CButton>
              </CModalFooter>
            </CModal>
    </div>
  )
}
}

export default Register
