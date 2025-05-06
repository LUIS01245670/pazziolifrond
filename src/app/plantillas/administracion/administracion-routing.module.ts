import { Routes } from '@angular/router';
import { TiendaComponent } from './componentes/tienda/tienda.component';
import { RedireccionComponent } from './componentes/redireccion/redireccion.component';
import { PedidosComponent } from './componentes/pedidos/pedidos.component';
import { ItemspedidoComponent } from './componentes/itemspedido/itemspedido.component';

//runGuardsAndResolvers esto me permitira que cada ves que navegue de nuevo aqui se vulva a ejecuta el oningt
export const AdminRoutes: Routes = [
  {
    path: '',
    component: RedireccionComponent,
  },
  {
    // URL QUE QUIERO PARA EL COMPONENTE
    path: 'tienda',
    // IMPORTACION DEL COMPONENTE
    component: TiendaComponent,
    // INFO EXTRA QUE LE PUEDO ENVIAR CON EL ROUTING
    data: { title: 'Tienda' },
  },
  {
    path: 'pedido',
    component: PedidosComponent,
  },

  {
    path: 'pedido/:codigo',
    component: ItemspedidoComponent,
  },
];
