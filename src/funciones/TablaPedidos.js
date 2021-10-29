import React, { useEffect, useState ,useContext} from "react";
import {
    CBadge,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CDataTable,
    CRow,
    CButton,
    CCollapse,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CModalBody,
    CFormGroup,
    CSelect,
    CLabel,
    CAlert,
    CForm,
    CInputGroup,
    CInputGroupPrepend,
    CInputGroupText,
    CInput,
    CSpinner
  
  } from '@coreui/react'
import fire from '../firebase';
import CIcon from '@coreui/icons-react'
import 'react-day-picker/lib/style.css';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {imprimir} from 'src/funciones/imprimir';
import {onDeviceSelected} from 'src/funciones/zebrasetuo';
import { AuthContext } from "../Auth";
import { getBadge, getStatus } from "src/funciones/Funciones";


const fields = [
	{ key:"uid" ,label: 'Código'},
    { key:"NOMBRE PROD" ,label: 'Nombre Prod', _style: { width: '15%'} },
    { key:"cliente_nombre" ,label: 'Cliente'},
    { key:"DIRECCION" ,label: 'Dirección', _style: { width: '20%'}},
    { key:"TELEFONO" , label: 'Telefono', _style: { width: '10%'} },
    { key:"CORREO" ,label: 'Correo', _style: { width: '20%'} },
    { key:"NOMBRE CONTACTO",label: 'Nombre contacto', _style: { width: '10%'} },
    { key: "FECHA MIN ENTREGA",label: 'Fecha de Entrega', _style: { width: '10%'} },
    { key:"status",label: 'status', _style: { width: '10%'} },
    {
      key: 'show_details',
      label: '',
      _style: { width: '1%' },
      sorter: false,
      filter: false
    }
  ]


  const fields2 = [
	{ key:"uid" ,label: 'Código'},
    { key:"NOMBRE PROD" ,label: 'Nombre Prod', _style: { width: '15%'} },
    { key:"cliente_nombre" ,label: 'Cliente'},
	{ key:"DIRECCION" ,label: 'Dirección', _style: { width: '20%'}},
    { key:"TELEFONO" , label: 'Telefono', _style: { width: '10%'} },
    { key:"CORREO" ,label: 'Correo', _style: { width: '20%'} },
    { key:"NOMBRE CONTACTO",label: 'Nombre contacto', _style: { width: '10%'} },
    { key: "FECHA MIN ENTREGA",label: 'Fecha de Entrega', _style: { width: '10%'} },
    { key:"status",label: 'status', _style: { width: '10%'} }
   
  ]


const Tables = ({data}) => {
        const { user,tipo,clientes,devices } = useContext(AuthContext);
        const [details, setDetails] = useState([])
        const [uidborrar, setUidborrar] = useState();
        const [uidedit, setUidedit] = useState('');
        const [alert, setAlert] = useState(false);
        const [status, setEstatus] = useState('');
        const [modal, setModal] = useState(false);
        const [modalerr, setModalerr] = useState(false);
        const [modaledit, setModaledit] = useState(false)
		const [modaleditar, setModaleditart] = useState(false);
        const [modaladd, setmodaladd] =useState(false)
        const [modalsuss, setmodalsuss] =useState(false)
        const [nombre, setNombre] = useState('');
        const [direccion, setDireccion] = useState('');
        const [catidad, setCantidad] = useState('');
        const [fechamin, setFechamin] = useState('');
        const [fechamax, setFechamax] = useState('');
        const [contacto, setContacto] = useState('');
        const [telefono, setTelefono] = useState('');
        const [correo, setCorreo] = useState('');
		const [latitud, setLatitud] = useState('');
        const [longitud, setLongitud] = useState('');
        const [client, setCliente] = useState('');
		const [tamano, setTamano] = useState('');
        const [alert_mensaje, setAlertmensaje] = useState('');
  // const [items, setItems] = useState(usersData)

    const borrar = (uidds) => {
        fire.firestore().collection("pedidos").doc(uidds).delete().then(() => {
            setModal(false)
        }).catch((error) => {
            setModalerr(true)
        });
  
    }

  const editar = (uid,status) => {
		
        if (status.length <= 0){
            setAlert(true);
        }else{
            var edit=fire.firestore().collection("pedidos").doc(uid);
    
            edit.update({
            status: parseInt(status)
            })
            .then(() => {
                setModaledit(false)
            })
            .catch((error) => {
                setModaledit(false)
                setModalerr(true)
                console.log(error)
            });
        
            setModaledit(false)
			setUidedit('')
        }
  }


  const toggleDetails = (index) => {
    const position = details.indexOf(index)
    let newDetails = details.slice()
    if (position !== -1) {
      newDetails.splice(position, 1)
    } else {
      newDetails = [...details, index]
    }
    setDetails(newDetails)
  }

  const Cerrar = () => {
	setNombre('')
	setDireccion('')
	setCantidad('')
	setFechamin('')
	setContacto('')
	setTelefono('')
	setCorreo('')
	setLatitud('')
	setLongitud('')
	setTamano('')
	setModaledit(false)
	setModaleditart(false)
  }
  const editarpeddata = (item) => {
		setNombre(item['NOMBRE PROD'])
		setDireccion(item['DIRECCION'])
		setCantidad(item.CANTIDAD)
		setFechamin(item['FECHA MIN ENTREGA'])
		setContacto(item['NOMBRE CONTACTO'])
		setTelefono(item.TELEFONO)
		setCorreo(item.CORREO)
		setLatitud(item.LATITUD)
		setLongitud(item.LONGITUD)
		setUidedit(item.uid)
		setTamano(item.tamano)
		setModaleditart(true)

  }
  const editarped = (uid) => {
	if (client =='' || nombre =='' ||direccion =='' ||catidad =='' ||fechamin =='' 
	||correo =='' ||contacto =='' || telefono =='' ||tamano =='' ) {
		return
	}
		var db = fire.firestore();
		var data = db.collection("pedidos").doc(uid)
		data.update({
		"DIRECCION": direccion,
		"NOMBRE PROD": nombre,
		"CANTIDAD": catidad,
		"FECHA MIN ENTREGA":fechamin,
		"NOMBRE CONTACTO":contacto,
		"TELEFONO":telefono,
		"CORREO":correo,
		"LATITUD": latitud,
		"LONGITUD": longitud
	})
	.then(() => {
		Cerrar()
		setmodalsuss(true)
		setUidedit('')
	})
	.catch((error) => {
		Cerrar()
	setModalerr(true)
		setUidedit('')
	});
  }

  const agregarped = () => {
	if (client =='' || nombre =='' ||direccion =='' ||catidad =='' ||fechamin =='' 
	||correo =='' ||contacto =='' || telefono =='' ||tamano =='' ) {
		return
	}
    var db = fire.firestore();
    var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = dd + '-' + mm + '-' + yyyy;

            var now     = new Date(); 
            var hour    = now.getHours();
            var minute  = now.getMinutes();
            var second  = now.getSeconds(); 
            if(hour.toString().length === 1) {
              hour = '0'+hour;
            }
            if(minute.toString().length === 1) {
                  minute = '0'+minute;
            }
            if(second.toString().length === 1) {
                  second = '0'+second;
            }   
            var hora = hour+':'+minute+':'+second;

    var data = db.collection("pedidos").doc()
    data.set({
      uid: data.id,
      cliente: client,
      ct_origen:'central',
      identificador_contacto: user,
      min_horario: '06:00',
      max_horario: '20:00',
      status:0,
      fecha_import: today,
      hora_import:hora,
      orden_uid:'sinOrden',
      "DIRECCION": direccion,
      "NOMBRE PROD": nombre,
      "CANTIDAD": catidad,
      "FECHA MIN ENTREGA":fechamin,
      "FECHA MAX ENTREGA":fechamax,
      "NOMBRE CONTACTO":contacto,
      "TELEFONO":telefono,
      "CORREO":correo,
	  tamano:tamano

      
  })
  .then(() => {
	Cerrar()
    setmodaladd(false)
    setmodalsuss(true)
  })
  .catch((error) => {
	Cerrar()
    setmodaladd(false)
   setModalerr(true)
      console.error("Error writing document: ", error);
  });

  }

  const daychange = (day,tipo) => {

    var dd = String(day.getDate()).padStart(2, '0');
    var mm = String(day.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = day.getFullYear();

    var today = dd + '-' + mm + '-' + yyyy;
    

    if (tipo === 0) {
      setFechamin(today)
      
    }else{
      setFechamax(today)
    }
  }


  if (data.loading) {
    return( 
		<>
		<div className="d-flex justify-content-center align-items-center" style={{height:"200px"}}>
			<CRow>
				<CCol>
					<CSpinner variant="grow"/>
				</CCol>
			</CRow>
		</div>	
		</>
	)
    
  }
  let clien = clientes.length > 0
  && clientes.map((item, i) => {
  return (
    <option key={i} value={item.uid}>{item.nombre}</option>
  )
}, this);
  return (
    <>
    {tipo === 0 && <CRow>
            <CCol  md="6" lg="4">
                <CCard>
                
                    <CCardBody>
                        <CCol col="6" sm="6" md="12" xl className="mb-3 mb-xl-0">
                            <CButton onClick={()=> setmodaladd(true)} block color="primary">Agregar pedido</CButton>
                        </CCol>
                    </CCardBody>
                </CCard>
            </CCol >
            <CCol  md="6" lg="4">
            <CCard>
        
                <CCardBody>
                
                    <CCol col="6" sm="6" md="12" xl className="mb-3 mb-xl-0">
                        <CSelect required custom name="select" id="selected_device" onChange={(e) => onDeviceSelected(e.target)}>
                                        <option value='' >Seleccione impresora</option>
                                        {devices.length > 0
                                        && devices.map((item, i) => {
                                        return (
                                        <option key={i} value={item.uid}>{item.name}</option>
                                        )
                                        }, this)}
                                
                    
                                    </CSelect>
                        </CCol>
                    
                </CCardBody>
            </CCard>
        </CCol >
    </CRow>
    }
      <CRow>
          <CCol >
            <CCard>
              	<CCardHeader>
                  	{data.nombre}
				</CCardHeader>
				<CCardBody>
					<CDataTable
						items={data.data}
						fields={tipo === 0 ? fields : fields2}
						columnFilter
						tableFilter
						footer
						outlined
						itemsPerPageSelect
						itemsPerPage={50}
						sorter
						pagination
						scopedSlots = {{
							'status': (item) => (
								<td>
									<CBadge color={getBadge(item.status)}>
											{getStatus(item.status)}
									</CBadge>
								</td>
							),
							'show_details': (item, index) => {
								return (
									<td className="py-2">
										<CButton
											color="primary"
											variant="outline"
											shape="square"
											size="sm"
											onClick={()=>{toggleDetails(index)}}
										>
											{details.includes(index) ? 'Cerrar' : 'Opciones'}
										</CButton>
									</td>
								)
							},
                            'details':
                                (item, index)=>{
                                return (
                                <CCollapse show={details.includes(index)}>
                                    <CCardBody>
										<p className="text-muted">Código del paguete: {item.uid}</p>
										<p className="text-muted">Nombre de cliente: {item.cliente_nombre}</p>
										<p className="text-muted">Pedido ingresado el: {item.fecha_import}</p>
										<CButton onClick={()=> {setUidedit(item.uid);  setModaledit(true);}} size="sm" color="info">
											Cambiar Estado
										</CButton> 
										{tipo === 0 && <CButton onClick={()=> {setUidborrar(item.uid);  setModal(true);}} size="sm" color="danger" className="ml-1">
											Borrar
										</CButton> }
										<CButton onClick={()=> {imprimir(item.uid)}} size="sm" color="success" className="ml-1">
											Imprimir
										</CButton>
										<CButton onClick={()=> { editarpeddata(item)}} size="sm" color="warning" className="ml-1">
											Editar
										</CButton>
                                    </CCardBody>
                                </CCollapse>
                                )
                            }
                        }}
                        />
                            </CCardBody>
                            </CCard>
                            </CCol>
                        </CRow>
                
                        <CModal 
                              show={modal} 
                              onClose={() => setModal(false)}
                              color="warning"
                            >
                              <CModalHeader closeButton>
                                <CModalTitle>Cuidado</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                               ¿Estas seguro de Borrar este pedido pedido?
                              </CModalBody>
                              <CModalFooter>
                                <CButton color="danger" onClick={() => setModal(false)}>Cancelar</CButton>
                                <CButton color="primary" onClick={() => borrar(uidborrar)}>Si</CButton>
                              </CModalFooter>
                            </CModal>
                
                            <CModal 
                              show={modalsuss} 
                              onClose={() => setmodalsuss(false)}
                              color="success"
                            >
                              <CModalHeader closeButton>
                                <CModalTitle>Éxito</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                              pedidos ingresados correctamente
                              </CModalBody>
                              <CModalFooter>
                                <CButton color="success" onClick={() => setmodalsuss(false)}>Listo</CButton>
                              </CModalFooter>
                            </CModal>
                
                            <CModal 
                              show={modalerr} 
                              onClose={() => setModal(false)}
                              color="danger"
                            >
                              <CModalHeader closeButton>
                                <CModalTitle>Lo sentimos</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                              No se pudo completar la operación. Intente de nuevo
                              </CModalBody>
                              <CModalFooter>
                                <CButton color="danger" onClick={() => setModalerr(false)}>ok</CButton>
                              </CModalFooter>
                            </CModal>
                    
                            <CModal 
                              show={modaledit} 
                              onClose={() => setModal(false)}
                              color="primary"
                            >
                              <CModalHeader closeButton>
                                <CModalTitle>Editar</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                              {alert === true && <CAlert color="danger">
                                Seleccione una opción
                              </CAlert>}
                                  <CFormGroup row>
                                        <CCol md="3">
                                            <CLabel htmlFor="select">Estado</CLabel>
                                        </CCol>
                                        <CCol xs="12" md="9">
                                            <CSelect required custom name="select" id="select" onChange={(e) => setEstatus(e.target.value) }>
                                            <option value='' >Please select</option>
                                                <option value={4}>Aceptados</option>
                                                <option value={5}>Rechazados</option>
                                                <option value={8}>En espera</option>
                                                <option value={6}>Devuelto</option>
                                                <option value={3}>Entregados</option>
                                                <option value={0}>Por recoger</option>
                                                <option value={1}>En transito</option>
                                                <option value={7}>No entregado</option>
                                                 <option value={9}>Subido a fitter</option>
                                        
                                            </CSelect>
                                        </CCol>
                                    </CFormGroup>
                              </CModalBody>
                              <CModalFooter>
                              <CButton color="danger" onClick={() => setModaledit(false)}>Cancelar</CButton>
                                <CButton color="primary" onClick={() => editar(uidedit,status)}>Cambiar</CButton>
                              </CModalFooter>
                            </CModal>
                
                            
                            <CModal 
                              show={modaladd} 
                              onClose={() => setModal(false)}
                              color="primary"
                              size ="lg"
                            >
                              <CModalHeader closeButton>
                                <CModalTitle>Agregar</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                <CRow className="justify-content-center">
                                  <CCol md="9" lg="12" xl="12">
                                      {alert === true && <CAlert color="danger">
                                      {alert_mensaje}
                                    </CAlert>}
                
                                    <CCard className="mx-4">
                                      <CCardBody className="p-4">
                                        <CForm>
                                          <h1>Agregar</h1>
                
                                      
                
                                          <CInputGroup className="mb-3">
                                          <CInputGroupPrepend>
                                              <CInputGroupText>
                                                <CIcon name="cil-user" />
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CSelect required custom name="select" id="select" onChange={(e) => setCliente(e.target.value) }>
                                                <option value='' >Cliente</option>
                                                {clien}
                                          
                                        
                                            </CSelect>
                                          </CInputGroup>
                                          <CInputGroup className="mb-3">
                                          <CInputGroupPrepend>
                                              <CInputGroupText>
                                                <CIcon name="cil-user" />
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                
                                            <CInput type="text" placeholder="Nombre de producto"  required 
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value) }/>
                                          </CInputGroup>
                
                                          <CInputGroup className="mb-3">
                                          <CInputGroupPrepend>
                                              <CInputGroupText>
                                                <CIcon name="cil-user" />
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                
                                            <CInput type="text" placeholder="Dirección"  required 
                                            value={direccion}
                                            onChange={(e) => setDireccion(e.target.value) }/>
                                          </CInputGroup>
                
                                         
                
                                          
                                          <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                              <CInputGroupText>
                                                <CIcon name="cil-user" />
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                
                                            <CInput type="text" placeholder="Catidad"  required 
                                            value={catidad}
                                            onChange={(e) => setCantidad(e.target.value) }/>
                                          </CInputGroup>
                
                                          
                
                                          <CInputGroup className="mb-3">
                                          <CInputGroupPrepend>
                                              <CInputGroupText>
                                              Fecha manima de entrega. 
                                                <CIcon name="cil-calendar" />
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                                                <DayPickerInput onDayChange={day => daychange(day,0)} />
                                            
                                          
                                            
                                          </CInputGroup>
                
                
                                          <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                              <CInputGroupText>
                                                <CIcon name="cil-lock-locked" />
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="text" placeholder="Nombre del contacto"  required 
                                            value={contacto}
                                            onChange={(e) => setContacto(e.target.value) } />
                                          </CInputGroup>
                
                                          <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                              <CInputGroupText>
                                                <CIcon name="cil-lock-locked" />
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="text" placeholder="Telefono"  required 
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value) } />
                                          </CInputGroup>

										  <CInputGroup className="mb-3">
                                          <CInputGroupPrepend>
                                              <CInputGroupText>
                                              		Tamaño
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                                                <CSelect required custom name="select" id="select" onChange={(e) => setTamano(e.target.value) }>
													<option value='' >Sin definir</option>
														<option value={'1'}>SM</option>
														<option value={'2'}>M</option>
														<option value={'3'}>L</option>
														<option value={'4'}>XL</option>
												
													</CSelect>
                                          </CInputGroup>
                                          <CInputGroup className="mb-3">
                
                                            <CInputGroupPrepend>
                                              <CInputGroupText>@</CInputGroupText>
                                            </CInputGroupPrepend>
                
                                            <CInput type="text" placeholder="Correo de cliente" autoFocus  required 
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value) }/>
                                          </CInputGroup>
                                         
                                        </CForm>
                                      </CCardBody>
                                  
                                    </CCard>
                            </CCol>
                          </CRow>
                              </CModalBody>
                              <CModalFooter>
                              <CButton color="danger" onClick={() => {setmodaladd(false); Cerrar();}}>Cancelar</CButton>
                                <CButton color="primary" onClick={agregarped}>Agregar</CButton>
                              </CModalFooter>
                            </CModal>




							<CModal 
                              show={modaleditar} 
                              onClose={() => Cerrar()}
                              color="primary"
                              size ="lg"
                            >
                              <CModalHeader closeButton>
                                <CModalTitle>Editar pedido</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                <CRow className="justify-content-center">
                                  <CCol md="9" lg="12" xl="12">
                                      {alert === true && <CAlert color="danger">
                                      {alert_mensaje}
                                    </CAlert>}
                
                                    <CCard className="mx-4">
                                      <CCardBody className="p-4">
                                        <CForm>
                                          <h1>Editar pedido</h1>
                
                                          <CInputGroup className="mb-3">
                                          <CInputGroupPrepend>
                                              <CInputGroupText>
												  Nombre de producto
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                
                                            <CInput type="text" placeholder="Nombre de producto"  required 
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value) }/>
                                          </CInputGroup>
                
                                          <CInputGroup className="mb-3">
                                          <CInputGroupPrepend>
                                              <CInputGroupText>
											  Dirección
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                
                                            <CInput type="text" placeholder="Dirección"  required 
                                            value={direccion}
                                            onChange={(e) => setDireccion(e.target.value) }/>
                                          </CInputGroup>
                
                                         
                
                                          
                                          <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                              <CInputGroupText>
											  Cantidad
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                
                                            <CInput type="text" placeholder="Cantidad"  required 
                                            value={catidad}
                                            onChange={(e) => setCantidad(e.target.value) }/>
                                          </CInputGroup>
                
                                          
                
                                          <CInputGroup className="mb-3">
                                          <CInputGroupPrepend>
                                              <CInputGroupText>
                                              Fecha manima de entrega. 
                                                <CIcon name="cil-calendar" />
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                                                <DayPickerInput value={fechamin} onDayChange={day => daychange(day,0)} />
                                            
                                          
                                            
                                          </CInputGroup>
                
                                          <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                              <CInputGroupText>
											  Nombre del contacto
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="text" placeholder="Nombre del contacto"  required 
                                            value={contacto}
                                            onChange={(e) => setContacto(e.target.value) } />
                                          </CInputGroup>
                
                                          <CInputGroup className="mb-3">
                                            <CInputGroupPrepend>
                                              <CInputGroupText>
												  Telefono
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                                            <CInput type="text" placeholder="Telefono"  required 
                                            value={telefono}
                                            onChange={(e) => setTelefono(e.target.value) } />
                                          </CInputGroup>

										  <CInputGroup className="mb-3">
                
                                            <CInputGroupPrepend>
                                              <CInputGroupText>
											  Latitud
											  </CInputGroupText>
                                            </CInputGroupPrepend>
                
                                            <CInput type="text" placeholder="Latitud" autoFocus  required 
                                            value={latitud}
                                            onChange={(e) => setLatitud(e.target.value) }/>
                                          </CInputGroup>

										  <CInputGroup className="mb-3">
                
                                            <CInputGroupPrepend>
                                              <CInputGroupText>
											  Longitud
												  </CInputGroupText>
                                            </CInputGroupPrepend>
                
                                            <CInput type="text" placeholder="Longitud" autoFocus  required 
                                            value={longitud}
                                            onChange={(e) => setLongitud(e.target.value) }/>
                                          </CInputGroup>

										  

											<CInputGroup className="mb-3">
                                          <CInputGroupPrepend>
                                              <CInputGroupText>
                                              		Tamaño
                                              </CInputGroupText>
                                            </CInputGroupPrepend>
                                                <CSelect required custom name="select" id="select" onChange={(e) => setTamano(e.target.value) }>
													<option value='' >Sin definir</option>
														<option value={'1'}>SM</option>
														<option value={'2'}>M</option>
														<option value={'3'}>L</option>
														<option value={'4'}>XL</option>
												
													</CSelect>
                                          </CInputGroup>
                
                                          <CInputGroup className="mb-3">
                
                                            <CInputGroupPrepend>
                                              <CInputGroupText>Correo</CInputGroupText>
                                            </CInputGroupPrepend>
                
                                            <CInput type="text" placeholder="Correo de cliente" autoFocus  required 
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value) }/>
                                          </CInputGroup>
                                         
                                        </CForm>
                                      </CCardBody>
                                  
                                    </CCard>
                            </CCol>
                          </CRow>
                              </CModalBody>
                              <CModalFooter>
                              <CButton color="danger" onClick={() => Cerrar()}>Cancelar</CButton>
                                <CButton color="primary" onClick={() =>editarped(uidedit)}>Guardar</CButton>
                              </CModalFooter>
                            </CModal>
                      
                    </>
  )
}

export default Tables;