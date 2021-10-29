const getBadge = status => {

    switch (status) {
        case 0: return 'warning'
        case 1: return 'warning'
        case 2: return 'warning'
        case 3: return 'success'
        case 4: return 'success'
        case 5: return 'danger'
        case 6: return 'danger'
        case 7: return 'danger'
        case 8: return 'warning'
        case 9: return 'success'
        default: return 'primary'
    }
}

const getStatus = status => {

   return(
        status === 0 ? 'Por recoger':
        status === 1 ? 'En transito':  
        status === 3 ? 'Entregados':
        status === 4 ? 'Aceptados':
        status === 5 ? 'Rechazados':
        status === 6 ? 'Devuelto':
        status === 7 ? 'No entregado':
        status === 8 ? 'En espera':'subido a fitter'
   )
}


export { getBadge, getStatus }