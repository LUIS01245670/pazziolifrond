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
  title: String = "";
  inputUsuario: UntypedFormControl;
  inputdocumento: UntypedFormControl;
  loader: boolean = false;

  @ViewChild('inUsuario') inUsuario!: ElementRef;
  @ViewChild('inContrasena') inContrasena!: ElementRef;

  suscripcionSocket!: Subscription;

  constructor(private socketprodu:Socket_producto,private router: Router, private socketServices: SocketService, private app: AppComponent, private dialog: MatDialog, private crypt: CryptService,private serviauth:AuthService
    , private cookieservices:CookieService
  ) {
    this.inputUsuario = new UntypedFormControl('', [
      Validators.required
    ]);
    this.inputdocumento = new UntypedFormControl('', [
      Validators.required
    ]);

   

 
  

  }

  login(){
    console.log(this.inputUsuario.value)
    this.serviauth.login({ user:this.inputUsuario.value,documento:this.inputdocumento.value}).subscribe(
      autenticado=>{
       
        this.socketprodu.conectar() 
        console.log(autenticado.atenticado)
      if(autenticado.atenticado){
        const verifiacacookie =()=>{
          if(this.cookieservices.get('connect.sid')){
            this.router.navigateByUrl('/admin/tienda');
          }else{
            verifiacacookie()
          }
         
      }
     verifiacacookie()
    
         
    }
        
      }

      ,
      error=>console.log(error)
    );
  }
  ngOnInit(): void {
   console.log("entro al login");
  }
}
 
