import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';;
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
  constructor() { }

  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  callComponentMethod() {
    this.componentMethodCallSource.next({algo:'por aqui paso algo'});
  }
  public conectar() {
    // this.socket = io("http://52.86.140.114:3000");
    this.socket = io("13.59.77.203:3000");
    // this.socket = io("localhost:3000");
    if (this.socket !== undefined) {
      this.socketConexion = new Observable((observer: any) => {
        this.socket.on(this.socketEscucha, (dato: any) => {
          observer.next(dato);
          console.log(dato);
        });
      });
      console.log('Conectado al socket...');

    }
  }

  public enviarInfo(data: any) {
    console.log(data);
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
