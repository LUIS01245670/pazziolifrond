import { Routes } from '@angular/router';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';

export const AuthRoutes: Routes = [

  {
    // URL QUE QUIERO PARA EL COMPONENTE
    path: 'login',
    // IMPORTACION DEL COMPONENTE
    component: InicioSesionComponent,
    // INFO EXTRA QUE LE PUEDO ENVIAR CON EL ROUTING
    data: { title: 'Iniciar sesión' },
  },
];
