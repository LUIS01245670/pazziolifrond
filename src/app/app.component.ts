import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CryptService } from 'src/services/crypt/crypt.service';
import { SocketService } from 'src/services/socket/socket.service';
import { DatosAlerta, DialogoAlerta } from './angular-material/alerta';
import { Socket_producto } from 'src/services/socket/socket.producto.service.ts.service';
import { AuthService } from 'src/services/auth/auth.service';
import { serviciodb } from 'src/services/serviciosdbs/serviciodb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Pedidos';
  showToolbar: boolean = true;
  public sedes: any;
  public terceroSeleccionado: any;
  private visibilityHandler = this.handleVisibilityChange.bind(this);
  data: any;
  constructor(
    private router: Router,
    private serviauth: AuthService,
    public dialog: MatDialog,
    private crypt: CryptService,
    private socketproduct: Socket_producto,
    private serviciodb: serviciodb
  ) {}
  ngOnInit(): void {
    this.serviciodb.tienesedeselccionada().subscribe((data) => {
      this.data = data;
    });

    document.addEventListener('visibilitychange', this.visibilityHandler);
  }
  ngOnDestroy(): void {
    document.removeEventListener('visibilitychange', this.visibilityHandler);
  }

  handleVisibilityChange() {
    this.serviauth.verificarvendedor().subscribe((data) => {
      if (!data?.response) {
        this.data = null;
        this.router.navigate(['auth/login']);
      } else {
        this.serviciodb.tienesedeselccionada().subscribe((data) => {
          this.data = data;
        });
      }
    });
  }
  salir() {
    this.serviauth.salir().subscribe((res) => {
      this.data = null;
      this.router.navigate(['auth/login']);
    });
  }
}
