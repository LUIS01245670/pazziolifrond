
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/services/auth/auth.service';
import { map } from 'rxjs/operators'; 
import { Socket_producto } from 'src/services/socket/socket.producto.service.ts.service';
interface token{
  token:string

}

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
 
  constructor(private serviauth:AuthService ,private  router:Router,private socketproduct:Socket_producto){

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
     
    
    
     return this.serviauth.verificarvendedor().pipe(
        
        map(respon=> {
          const toke:token | null= this.serviauth.gettoken()
          if (respon?.response) {
            console.log("nohay token")
             this.socketproduct.conectar()
            return true; 
          } else {
            this.router.navigateByUrl('auth/login')
            return false; // Redirige si la verificación falla
          }
        })
      );
        
      
      
    
    
  

  
}


}

@Injectable({
  providedIn: 'root'
})
export class Publicguards implements CanActivate {
  constructor(private serviauth:AuthService ,private  router:Router,private socketproduct:Socket_producto){
       
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.serviauth.verificarvendedor().pipe(
        
      map(respon=> {
       
        if (!respon?.response) {
          console.log("no hay toquen")
          return true; // Redirige si la verificación falla
         
          
        } else {
          this.router.navigateByUrl('admin/tienda')
          return false
         
          
        }
      })
    );
  }

}

