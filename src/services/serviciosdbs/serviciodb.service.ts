import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
interface arrayempresas{
    response:any[]
}
@Injectable({
  providedIn: 'root'
})

export class serviciodb{

    constructor(private http:HttpClient){

    }

    obtenerdbfiltradas():Observable<any>{
      return this.http.get(`${environment.api}/obtenerdbfiltradas`,{withCredentials:true})
    }

    tienesedeselccionada():Observable<arrayempresas>{
        return this.http.get<arrayempresas>(`${environment.api}/selectempresa`,{withCredentials:true})
    }

}