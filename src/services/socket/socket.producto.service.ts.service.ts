import { Injectable } from '@angular/core';
import {io} from 'socket.io-client';
import { Observable, fromEvent, Subject, observable } from 'rxjs';
import { SocketService } from './socket.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
interface token{
  token:string

}
@Injectable({
  providedIn: 'root'
})

export class Socket_producto {
  public socket: any;
    public socketConexion!: Observable<any>;
    public socketEscucha: String = "DASHBOARD";  
   public almacen:string=''
   public socketiniciado=false
   constructor (private http:HttpClient){

   }
   public conectar() {
        
      // this.socket = io("http://52.86.140.114:3000");
      
      this.socket = io("http://localhost:3000",{ transports: ['websocket'] ,
        withCredentials: true});
      // this.socket = io("localhost:3000");
      this.socket.on("connect", () => {
        console.log("Conectado al servidor con I:", this.socket.id);
        this.socketiniciado=true
      });

      
      this.socket.on("connect_error", (err: any) => {
        console.error("❌ Error de conexión:", err);
      });
    
      this.socket.on("disconnect", () => {
        console.warn("⚠️ Desconectado del servidor");
      });

     
      
    }

    public obteneralmacen():Observable<any> {
      return new Observable((observable:any)=>{
         this.socket.emit('pazzioli-pos-3',{metodo:"traeralmacen"})
        this.socket.on("obteneralmacen",(datos:any)=>{
           console.log("socketactivado")
          this.almacen=datos.almacen
          observable.next(datos)
  
        }
  
        )
      
      })

    }
  
   
    public obtenerInfo(socket:String,canal:String,flujo:any): Observable<any> {
        
   
      
        return new Observable((observer: any) => {
             
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


      public obtenerpedidos_realizados():Observable<any>{
        return this.http.get(`${environment.api}/obtenerpedidos`,{withCredentials:true})

      }

      public obteneritemspedido(codigo:string):Observable<any>{
        return this.http.get(`${environment.api}/obteneritemspedido?codigo=${codigo}`,{withCredentials:true})
      }

      reservarpedidos(pedido:any):Observable<any>{
        return this.http.post(`${environment.api}/reservarpedido`,pedido,{withCredentials:true})
      }



    verpedido():Observable<any>{
      return this.http.get(`${environment.api}/reservado`,{withCredentials:true})
    }

    actulizarpedido(id:string,data:any):Observable<any>{
      return this.http.put(`${environment.api}/actulizarreservado/${id}`,data)
    }
  
}


