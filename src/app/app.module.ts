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
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Dialogdetalles } from './plantillas/administracion/componentes/pedidos/pedidos.component';
import { MatTableModule } from '@angular/material/table';
import { Pedidoguardado } from './angular-material/pedidoguardos';
import { Detallespedido } from './angular-material/detallespedido';

@NgModule({
    declarations: [
        AppComponent,
        DialogSedes,
        DialogoAlerta,
        DialogFactura,
        Dialogdetalles,
        Pedidoguardado,
        Detallespedido
    ],
    exports: [
        MatAutocompleteModule,
        HttpClientModule
    ],
    imports: [
        MatTableModule,
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        MatAutocompleteModule,
        MatDialogModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
