import React , {useContext} from 'react'
import CIcon from '@coreui/icons-react';
import { cifAU } from '@coreui/icons';
import { BiImport } from "react-icons/bi";

import { AuthContext } from "../Auth";




const _nav =  [
  

  // paginas dash
    {
      _tag: 'CSidebarNavTitle',
      _children: ['Inicio']
    },
{
  _tag: 'CSidebarNavItem',
  name: 'Control',
  to: '/dash/control/home',
  icon: 'cil-home',
},
{
  _tag: 'CSidebarNavItem',
  name: 'Importar',
  to: '/dash/control/importar',
  icon: 'cil-inbox',
},{
  _tag: 'CSidebarNavItem',
  name: 'Suibir a beetrack',
  to: '/dash/control/subir_beetrack',
  icon: 'cil-inbox',
},{
  _tag: 'CSidebarNavItem',
  name: 'Camiones',
  to: '/dash/control/camiones',
  icon: 'cil-truck',
},
 
    {
      _tag: 'CSidebarNavDropdown',
      name: 'Ordenes',
      icon: 'cil-basket',
      _children: [
        {
          _tag: 'CSidebarNavItem',
          name: 'Todas las Ordenes',
          to: '/dash/control/ordenes',
        }, 
        {
          _tag: 'CSidebarNavItem',
          name: 'Ordenes diarias',
          to: '/dash/control/ordenes-dia',
        }, 
        {
          _tag: 'CSidebarNavItem',
          name: 'Ordenes por cliente',
          to: '/dash/control/ordenes-cliente',
        },
        {
          _tag: 'CSidebarNavItem',
          name: 'Ordenes por status',
          to: '/dash/control/ordenes-status',
        }
        
      ],
    },
    {
      _tag: 'CSidebarNavDropdown',
      name: 'Pedidos',
      route: '/dash/control/pedidos',
      icon: 'cil-basket',
      _children: [
        {
          _tag: 'CSidebarNavItem',
          name: 'Todos los Pedidos',
          to: '/dash/control/pedidos',
        },
        {
          _tag: 'CSidebarNavItem',
          name: 'Pedidos por dia',
          to: '/dash/control/pedidos-dia',
        }, 
        {
          _tag: 'CSidebarNavItem',
          name: 'Pedidos por cliente',
          to: '/dash/control/pedidos-cliente',
        },
        {
          _tag: 'CSidebarNavItem',
          name: 'Pedidos por status',
          to: '/dash/control/pedidos-status',
        }
      
      ],
    },

// hasta aqui
  
]

export default _nav
