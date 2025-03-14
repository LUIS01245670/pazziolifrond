import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CryptService } from 'src/services/crypt/crypt.service';
import { SocketService } from 'src/services/socket/socket.service';
import { DatosAlerta, DialogoAlerta } from './angular-material/alerta';
import { Socket_producto } from 'src/services/socket/socket.producto.service.ts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Pedidos';
  showToolbar: boolean = false;
  public sedes: any;
  public terceroSeleccionado: any;

  constructor(private router: Router, private socketService: SocketService, public dialog: MatDialog, private crypt: CryptService,private socketproduct:Socket_producto) {
    router.events.subscribe((value) => {
      // console.log('current route: ', router.url.toString());
      if (router.url.toString().includes('admin')) {
        this.showToolbar = true;
      } else {
        this.showToolbar = false;
      }
    });
    this.socketService.conectar();
    this.socketproduct.conectar();
    this.router.navigate(['auth/login']);
  }

  salir() {
    const data: DatosAlerta = {
      titulo: 'ATENCIÓN',
      mensaje: '¿Desea salir?',
      boton: "SI",
      tipo: "question",
      boton1: "NO",
      input: false,
    }
    const dialogRef = this.dialog.open(DialogoAlerta, {
      data: data,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(resultado => {
      console.log(resultado);
      if (resultado == true) {
        localStorage.clear();
        this.router.navigate(['']);
        this.crypt.resetPassword();
        window.location.reload();
      }
    });
  }
}