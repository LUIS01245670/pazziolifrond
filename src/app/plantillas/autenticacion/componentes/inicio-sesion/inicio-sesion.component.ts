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
  inputUsuario: UntypedFormControl;
  inputpassword: UntypedFormControl;
  inputdocumento: UntypedFormControl;
  selectSedes: UntypedFormControl;
  loader: boolean = true;
  data: any;
  @ViewChild('inUsuario') inUsuario!: ElementRef;
  @ViewChild('inContrasena') inContrasena!: ElementRef;

  suscripcionSocket!: Subscription;

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
    this.serviauth.traerempresa().subscribe((datos) => {
      this.data = datos.data;
      this.loader = false;
      console.log(datos.data);
    });
    this.inputdocumento = new UntypedFormControl('', [Validators.required]);
    this.inputUsuario = new UntypedFormControl('', [Validators.required]);
    this.inputpassword = new UntypedFormControl('', [Validators.required]);

    this.selectSedes = new UntypedFormControl('', [Validators.required]);
  }

  login() {
    console.log(this.inputUsuario.value);
    this.serviauth
      .login({
        user: this.inputUsuario.value,
        documento: this.inputdocumento.value,
        password: this.inputpassword.value,
        db: this.selectSedes.value,
      })
      .subscribe(
        (autenticado) => {
          console.log('si esta autenticado', autenticado.autenticado);

          if (autenticado.autenticado) {
            this.socketprodu.conectar();
            //console.log(!this.cookieservices.get("connect.sid"))
            window.location.reload();

            // this.router.navigateByUrl('admin/tienda');
          }
        },

        (error) => console.log(error)
      );
  }
  ngOnInit(): void {
    console.log('entro al login');
  }
}
