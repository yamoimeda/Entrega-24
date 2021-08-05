import React, { useEffect, useState ,useContext} from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AuthContext } from "../Auth";
import { useHistory } from "react-router";
import logo from '../assets/icons/user.png';

const TheHeaderDropdown = () => {
  const { user,photo,tipo,logout } = useContext(AuthContext);
  

  
  
  const history = useHistory();

  const salir = () => {

    logout();
    history.push({
      pathname:  "/login"
   });
  };

  const users = () => {

    
    history.push({
      pathname:  "/dash/control/salir"
   });
  };

  return (

  
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          <CImg
            src={logo}
            className="c-avatar-img"
            alt='user'
          />
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
       
        
       
     
        <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
          <strong>Ajustes</strong>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-user" className="mfe-2" />Perfil
        </CDropdownItem>
        {tipo === 0 && <CDropdownItem onClick ={users}>
          <CIcon name="cil-people" className="mfe-2" />
          usuarios
        </CDropdownItem>   }
        <CDropdownItem>
          <CIcon name="cil-settings" className="mfe-2" />
          Ajustes
        </CDropdownItem>
        
        <CDropdownItem divider />
        <CDropdownItem onClick={salir} >
          <CIcon  name="cil-lock-locked" className="mfe-2" />
          Salir
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
