import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatosAlerta, DialogoAlerta } from 'src/app/angular-material/alerta';
import { AppComponent } from 'src/app/app.component';
import { AuthService } from 'src/services/auth/auth.service';
import { CryptService } from 'src/services/crypt/crypt.service';
import { Socket_producto } from 'src/services/socket/socket.producto.service.ts.service';
import { SocketService } from 'src/services/socket/socket.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss'],
})
export class InicioSesionComponent implements OnInit {
  title: String = '';
  inputUsuario: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
  ]);
  inputpassword: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
  ]);
  inputdocumento: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
  ]);
  selectSedes: UntypedFormControl = new UntypedFormControl('', [
    Validators.required,
  ]);
  loader: boolean = false;
  data: any;
  @ViewChild('inUsuario') inUsuario!: ElementRef;
  @ViewChild('inContrasena') inContrasena!: ElementRef;
  mensaje: string = '';
  suscripcionSocket!: Subscription;
  botoncierresesion: boolean | undefined = false;
  campovisible: boolean = true;
  mensajedone: string = '';
  constructor(
    private socketprodu: Socket_producto,
    private router: Router,
    private socketServices: SocketService,
    private app: AppComponent,
    private dialog: MatDialog,
    private crypt: CryptService,
    private serviauth: AuthService,
    private cookieservices: CookieService
  ) {
    this.inputUsuario.disable();
    this.inputpassword.disable();
    this.selectSedes.disable();
  }
  traerempresas() {
    this.serviauth
      .traerempresa(this.inputdocumento.value)
      .subscribe((datos) => {
        if (datos.data.length > 0) {
          this.data = datos.data;
          this.inputUsuario.enable();
          this.inputpassword.enable();
          this.selectSedes.enable();

          this.campovisible = false;
          this.mensajedone = 'Identificación verificada';
        } else {
          this.mensaje = 'Identificación no registrada';
          this.inputUsuario.disable();
          this.inputpassword.disable();
          this.selectSedes.disable();
          this.campovisible = true;
          setTimeout(() => {
            this.mensaje = '';
          }, 4000);
        }
      });
  }
  limpiarimputs() {
    this.inputUsuario.setValue('');
    this.inputpassword.setValue('');
    this.selectSedes.setValue('');
  }
  cancelar() {
    this.botoncierresesion = false;
    this.mensaje = '';
    this.limpiarimputs();
  }
  cerrarsesionuser() {
    this.serviauth.salir().subscribe(
      (res) => {
        this.botoncierresesion = false;
        this.mensaje = '';
        this.login();
      },
      (error) => {}
    );
  }
  login() {
    this.serviauth
      .login({
        user: this.inputUsuario.value,
        documento: this.inputdocumento.value,
        password: this.inputpassword.value,
        db: this.selectSedes.value,
      })
      .subscribe(
        (autenticado) => {
          if (autenticado.autenticado) {
            this.socketprodu.conectar();
            //console.log(!this.cookieservices.get("connect.sid"))
            window.location.reload();

            // this.router.navigateByUrl('admin/tienda');
          }
        },

        (error) => {
          if (error.error.opcion) {
            this.mensaje = error.error.mensaje;
            this.botoncierresesion = error.error.opcion;
          } else {
            this.mensaje = error.error.mensaje;
            this.limpiarimputs();
            setTimeout(() => {
              this.mensaje = '';
            }, 4000);
          }
        }
      );
  }
  ngOnInit(): void {}
}
