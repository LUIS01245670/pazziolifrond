import { NgModule } from '@angular/core';
// PRIMERO IMPORTO LOS MODULOS QUE VOY A USAR DE ESTA MANERA
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  // LOS PONGO EN IMPORTS
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatChipsModule,
    MatSnackBarModule,
    ///////ANGULAR MATERIAL ///////
    FormsModule,
    ReactiveFormsModule,
    VirtualScrollerModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
  ],
  // LOS PONGO EN EXPORTS
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatChipsModule,
    MatSnackBarModule,
    ///////ANGULAR MATERIAL ///////
    FormsModule,
    ReactiveFormsModule,
    VirtualScrollerModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
  ],
  providers: [MatDatepickerModule],
})
// ESTA ES LA CLASE DE ANGULAR MATERIAL QUE VOY A USAR EN CADA PAGINA
// DEBO IMPORTARLA EN EL MODULO PADRE (APP) Y EN EL HIJO (ADMIN)
export class MaterialModule { }
