import { Injectable } from '@angular/core';
import {io} from 'socket.io-client';
import { Observable, fromEvent, Subject, observable } from 'rxjs';
import { SocketService } from './socket.service';
@Injectable({
  providedIn: 'root'
})
export class Socket_producto {
  public socket: any;
    public socketConexion!: Observable<any>;
    public socketEscucha: String = "DASHBOARD";  
   
   
   public conectar(token:any) {

      // this.socket = io("http://52.86.140.114:3000");
      this.socket = io("http://localhost:3000",{ transports: ['websocket'], auth: { token }});
      // this.socket = io("localhost:3000");
      this.socket.on("connect", () => {
        console.log("Conectado al servidor con I:", this.socket.id);
      });
    
      this.socket.on("connect_error", (err: any) => {
        console.error("❌ Error de conexión:", err);
      });
    
      this.socket.on("disconnect", () => {
        console.warn("⚠️ Desconectado del servidor");
      });

     
      
    }
  
   
    public obtenerInfo(socket:String,canal:String,flujo:any): Observable<any> {
        
   
      
        return new Observable((observer: any) => {
             console.log("entro al subcribe")
            if(socket){
              this.socket.emit(canal,flujo)
              this.socket.on(socket, (dato: any) => {
                 
                if (!dato) {
                 console.log("entro al subcribe error")
                  observer.next(JSON.stringify({Error: "Datos vacíos o nulos"}));
                 } else {
                 observer.next(dato);
                }
              });
              
                  }else{
                    observer.next("socket no disponidle");
                  }
          
           
            

        });
      }

      public crearpedido (socket:String,canal:String,flujo:any):Observable<any>{
            console.log(flujo)
            return new Observable((observer:any)=>{
                this.obtenerInfo(socket,canal,flujo).subscribe(
                  data=> observer.next(data)
                )
            } )
      }
  
}
