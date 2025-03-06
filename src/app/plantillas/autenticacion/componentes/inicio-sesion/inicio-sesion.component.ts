import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatosAlerta, DialogoAlerta } from 'src/app/angular-material/alerta';
import { AppComponent } from 'src/app/app.component';
import { CryptService } from 'src/services/crypt/crypt.service';
import { SocketService } from 'src/services/socket/socket.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss']
})
export class InicioSesionComponent implements OnInit {
  title: String = "";
  inputUsuario: FormControl;
  inputContrasena: FormControl;
  loader: boolean = false;

  @ViewChild('inUsuario') inUsuario!: ElementRef;
  @ViewChild('inContrasena') inContrasena!: ElementRef;

  suscripcionSocket!: Subscription;

  constructor(private router: Router, private socketServices: SocketService, private app: AppComponent, private dialog: MatDialog, private crypt: CryptService) {
    this.inputUsuario = new FormControl('', [
      Validators.required
    ]);
    this.inputContrasena = new FormControl('', [
      Validators.required
    ]);

    if (crypt.decrypt("eA21")) {
      let login = JSON.parse(crypt.decrypt("eA21").toString())
      this.inputUsuario.patchValue(login.usuario);
      this.inputContrasena.patchValue(login.password);
      this.iniciarSesion();
    }
  }

  eventoEnter(e: any, input: any) {
    if (e.keyCode == 13) {
      switch (input) {
        case 'usuario':
          this.inContrasena.nativeElement.focus();
          break;
        case 'pass':
          this.iniciarSesion();
          break;
        default:
          break;
      }
    }
  }

  iniciarSesion() {
    this.loader = true;
    this.socketServices.enviarInfo({
      sistema: 'DASHBOARD',
      tipoConsulta: 'LOGIN',
      info: {
        usuario: this.inputUsuario.value,
        password: this.inputContrasena.value
      }
    });
    this.suscripcionSocket = this.socketServices.socketConexion.subscribe((info) => {
      if (info) {
        if (info.estadoPeticion === 'SUCCESS' && info.tipoConsulta === 'LOGIN') {
          this.app.sedes = info.mensajePeticion;
          this.loader = false;
          this.router.navigate(['admin/tienda']);
          this.suscripcionSocket.unsubscribe();

          let EA21 = {
            usuario: this.inputUsuario.value,
            password: this.inputContrasena.value
          }

          this.crypt.encrypt(JSON.stringify(EA21), "eA21");

        } else {
          const data: DatosAlerta = {
            titulo: 'ERROR',
            mensaje: 'Nombre de usuario o contraseña incorrectos',
            boton: "OK",
            tipo: "error",
            input: false
          }
          this.openDialog(data);
          this.loader = false;
        }
      }
    });
  }

  ngAfterViewInit() {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.inUsuario.nativeElement.focus();
    });
  }

  openDialog(data: any): void {
    this.dialog.closeAll();

    const dialogRef = this.dialog.open(DialogoAlerta, {
      data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        dialogRef.close();
      } else {
        dialogRef.close();
      }
    });
  }

}
