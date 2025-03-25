import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CryptService } from 'src/services/crypt/crypt.service';
import { SocketService } from 'src/services/socket/socket.service';
import { DatosAlerta, DialogoAlerta } from './angular-material/alerta';
import { Socket_producto } from 'src/services/socket/socket.producto.service.ts.service';
import { AuthService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Pedidos';
  showToolbar: boolean = true;
  public sedes: any;
  public terceroSeleccionado: any;

  constructor(private router: Router, private serviauth:AuthService, public dialog: MatDialog, private crypt: CryptService,private socketproduct:Socket_producto) {
   
  }

  salir() {
   this.serviauth.salir().subscribe(
    res=>{
     
      console.log(res)
      this.router.navigate(['auth/login']);

    }

   )
  }
}