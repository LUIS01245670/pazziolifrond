import { Routes } from '@angular/router';
import { TiendaComponent } from './componentes/tienda/tienda.component';

export const AdminRoutes: Routes = [
  {
    path: '',
  },
  {
    // URL QUE QUIERO PARA EL COMPONENTE
    path: 'tienda',
    // IMPORTACION DEL COMPONENTE
    component: TiendaComponent,
    // INFO EXTRA QUE LE PUEDO ENVIAR CON EL ROUTING
    data: { title: 'Tienda' },
  },
];
