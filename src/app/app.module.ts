import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './angular-material/angular-material.module';
import { DialogSedes, DialogFactura } from './plantillas/administracion/componentes/tienda/tienda.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogoAlerta } from './angular-material/alerta';

@NgModule({
  declarations: [
    AppComponent,
    DialogSedes,
    DialogoAlerta,
    DialogFactura,
  ],
  exports:[
    MatAutocompleteModule,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    MatAutocompleteModule,
    MatDialogModule,
  ],
  providers: [],
  entryComponents: [
    DialogoAlerta,
    DialogFactura,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
