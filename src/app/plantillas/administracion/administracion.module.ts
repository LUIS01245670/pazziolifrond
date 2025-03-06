import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiendaComponent } from './componentes/tienda/tienda.component';
import { RouterModule } from '@angular/router';
import { AdminRoutes } from './administracion-routing.module';
import { MaterialModule } from 'src/app/angular-material/angular-material.module';

@NgModule({
  declarations: [TiendaComponent],
  imports: [CommonModule, RouterModule.forChild(AdminRoutes), MaterialModule],
})
export class AdministracionModule {}
