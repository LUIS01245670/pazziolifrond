import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { RouterModule } from '@angular/router';
import { AuthRoutes } from './autenticacion-routing.module';
import { MaterialModule } from 'src/app/angular-material/angular-material.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [InicioSesionComponent],
  imports: [CommonModule, RouterModule.forChild(AuthRoutes), MaterialModule],
})
export class AutenticacionModule {}
