import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
interface arrayempresas{
    opcionesdb:any[]
}
interface respuesta{
    response:boolean
}
@Injectable({
  providedIn: 'root'
})

export class serviciodb{

    constructor(private http:HttpClient){

    }

    obtenerdbfiltradas():Observable<arrayempresas>{
      return this.http.get<arrayempresas>(`${environment.api}/obtenerdbfiltradas`,{withCredentials:true})
    }

    tienesedeselccionada():Observable<any>{
        return this.http.get(`${environment.api}/selectempresa`,{withCredentials:true})
    }

    crearinstanciadb(db:string):Observable<respuesta>{
        return this.http.post<respuesta>(`${environment.api}/crearinstanciadb`,{db:db},{withCredentials:true})
    }


    }

