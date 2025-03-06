import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracionModule } from './plantillas/administracion/administracion.module';
import { AutenticacionModule } from './plantillas/autenticacion/autenticacion.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    loadChildren: () => AdministracionModule,
  },
  {
    path: 'auth',
    loadChildren: () => AutenticacionModule,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
