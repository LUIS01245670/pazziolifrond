import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracionModule } from './plantillas/administracion/administracion.module';
import { AutenticacionModule } from './plantillas/autenticacion/autenticacion.module';
import { AuthGuard, Publicguards } from './guards/auth.guard';
import { NotFoundComponentComponent } from './not-found-component/not-found-component.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./plantillas/administracion/administracion.module').then(
        (m) => m.AdministracionModule
      ),
  },
  {
    path: 'auth',
    canActivate: [Publicguards],
    loadChildren: () =>
      import('./plantillas/autenticacion/autenticacion.module').then(
        (m) => m.AutenticacionModule
      ),
  },
  {
    path: '**',
    component: NotFoundComponentComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
