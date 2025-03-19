import { Injectable } from '@angular/core';
import {io} from 'socket.io-client';
import { Observable, fromEvent, Subject } from 'rxjs';
import { DatosPeticion } from 'src/app/modelos/datos-peticion';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket: any;
  public socketEscucha: String = "DASHBOARD";
  public escuchando: Boolean = false;
  public socketConexion!: Observable<any>;
  public escucha!: Observable<any>;
  private componentMethodCallSource = new Subject<any>();
  constructor() { 
    console.log("🟡 SocketService inicializado");  
  }

  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  callComponentMethod() {
    this.componentMethodCallSource.next({algo:'por aqui paso algo'});
  }
  public conectar(token:any) {
    // this.socket = io("http://52.86.140.114:3000");
    this.socket = io("http://localhost:3000", { transports: ['websocket'] , auth: { token }});
    // this.socket = io("localhost:3000");
    this.socket.on("connect", () => {
     console.log("✅ Conectado al servidor con ID:", this.socket.id);
    });
  
    this.socket.on("connect_error", (err: any) => {
      console.error("❌ Error de conexión:", err);
    });
  
    this.socket.on("disconnect", () => {
      console.warn("⚠️ Desconectado del servidor");
    });
    if (this.socket !== undefined) {
      this.socketConexion = new Observable((observer: any) => {
        this.socket.on(this.socketEscucha, (dato: any) => {
          console.log("Conectado al servidor con ID:", this.socket.id);

          observer.next(dato);
          console.log(dato);

        });
      });
     
      //console.log("Conectado al servidor con ID:", this.socket.id);
    }
  }

  public enviarInfo(data: any) {
    console.log("entro aqui 1")
    this.socket.emit('aws', data);
  }

  public obtenerInfo(socket: String): Observable<any> {
    return new Observable((observer: any) => {
      if (!this.escuchando)
        this.socket.on(socket, (dato: any) => {
          observer.next(dato);
          console.log(dato);
          this.escuchando = true;
        });
    });
  }

  public consultarTercero(canalPos: String, condicion: String, datoCondicion: String, canalUsuario: String) {
    let infoPeticion = new DatosPeticion(
      canalPos,
      'TERCEROS',
      condicion,
      datoCondicion,
      canalUsuario
    );
    this.enviarInfo(infoPeticion.datos);
  }

  public consultarProducto(canalPos: String, condicion: String, datoCondicion: String, canalUsuario: String) {
    let infoPeticion = new DatosPeticion(
      canalPos,
      'PRODUCTOS',
      condicion,
      datoCondicion,
      canalUsuario
    );
    this.enviarInfo(infoPeticion.datos);
  }

  public crearPedido(canalPos: String, canalUsuario: String, data: any) {
    let infoPeticion = {
      sistema: 'DASHBOARD',
      tipoConsulta: 'POS',
      canalPos: canalPos,
      canalUsuario: canalUsuario,
      metodo: 'CREAR',
      consulta: 'PEDIDO',
      crear: data
    }
    this.enviarInfo(infoPeticion);
  }
}
