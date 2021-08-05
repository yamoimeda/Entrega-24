import React from 'react';

const Control = React.lazy(() => import('./views/control/control'));
const Pedidos_cliente = React.lazy(() => import('./views/control/pedidos_cliente'));
const Pedidos_dia = React.lazy(() => import('./views/control/pedidos_dia'));
const Pedidos_status = React.lazy(() => import('./views/control/pedidos_status'));
const Pedidos = React.lazy(() => import('./views/control/pedidos'));
const Importar = React.lazy(() => import('./views/control/importar'));
const Salir = React.lazy(() => import('./views/control/Salir'));
const Registrar = React.lazy(() => import('./views/control/registrar'));
const Ordenes = React.lazy(() => import('./views/control/ordenes/ordenes'));
const Ordenes_dia = React.lazy(() => import('./views/control/ordenes/ordenes_dia'));
const Ordenes_cliente = React.lazy(() => import('./views/control/ordenes/ordenes_cliente'));
const Ordenes_status = React.lazy(() => import('./views/control/ordenes/ordenes_status'));

const Pedidos_orden = React.lazy(() => import('./views/control/pedidos_orden'));
const Subir_betrack = React.lazy(() => import('./views/control/subir_beetrack'));
const Camiones = React.lazy(() => import('./views/control/camiones'));

const routes = [
  { path: '/dash/control/home', name: 'Control', component: Control },
  { path: '/dash/control/pedidos-cliente', name: 'Pedidos por clinete', component: Pedidos_cliente },
  { path: '/dash/control/pedidos-dia', name: 'Pedido por dia', component: Pedidos_dia },
  { path: '/dash/control/pedidos-status', name: 'Pedidos por status', component: Pedidos_status},
  { path: '/dash/control/pedidos', name: 'Pedidos', component: Pedidos },
  { path: '/dash/control/importar', name: 'Importar', component: Importar },
  { path: '/dash/control/salir', name: 'Salir', component: Salir },
  { path: '/dash/control/registrar', name: 'Registrar', component: Registrar },
  { path: '/dash/control/ordenes', name: 'Ordenes', component: Ordenes },
  { path: '/dash/control/ordenes-dia', name: 'Ordenes por dia', component: Ordenes_dia },
  { path: '/dash/control/ordenes-cliente', name: 'oredenes por cliente', component: Ordenes_cliente },
  { path: '/dash/control/ordenes-status', name: 'oredenes por status', component: Ordenes_status },
  { path: '/dash/control/subir_beetrack', name: 'subir a beetrack', component: Subir_betrack },
  { path: '/dash/control/Pedidos-orden', name: 'Pedidios de orden', component: Pedidos_orden },
  { path: '/dash/control/camiones', name: 'Camiones', component: Camiones },

];

export default routes;
