import React, { useEffect, useState ,useContext} from "react";
import { useSelector, useDispatch } from 'react-redux'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
  CButton
} from '@coreui/react';
import { useHistory } from "react-router";
import CIcon from '@coreui/icons-react'
import { AuthContext } from "../Auth";
// routes config
import routes from '../routes'

import { 
  TheHeaderDropdown,
  TheHeaderDropdownNotif,
}  from './index'

const TheHeader = () => {

  const { user,tipo } = useContext(AuthContext);
  const history = useHistory();

  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const subir = () => {
    
     
    history.push({
      pathname:  "/dash/control/subir_beetrack"
   });
  };

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />

      <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >
          <CHeaderNavLink to="/dash/control/home">Control</CHeaderNavLink>
        </CHeaderNavItem>
        
      </CHeaderNav>

      {tipo === 0 && <CButton onClick={()=> {subir()}} className="px-3" size="sm" color="success" className="ml-1">
                        Subir a beetrack
                    </CButton>}

      <CHeaderNav className="px-3">
        <TheHeaderDropdownNotif/>
        <TheHeaderDropdown/>
      </CHeaderNav>

      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter 
          className="border-0 c-subheader-nav m-0 px-0 px-md-3" 
          routes={routes} 
        />
      </CSubheader>
    </CHeader>
  )
}

export default TheHeader
