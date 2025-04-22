import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
interface token {
  token: string;
}
interface mensaje {
  message: string;
}
interface respon {
  response: boolean;
  almacen?: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  login(user: any): Observable<any> {
    return this.http.post(`${environment.api}/login`, user, {
      withCredentials: true,
    });
  }
  creartoken(token: token) {
    this.cookieService.set(environment.vendedor, token.token, 1, '/');
    // this.router.navigateByUrl('/admin/tienda')
  }

  gettoken(): token | null {
    if (
      this.cookieService.get(environment.vendedor) &&
      this.cookieService.get(environment.vendedor) != ''
    ) {
      return { token: this.cookieService.get(environment.vendedor) };
    } else {
      return null;
    }
  }

  verificarvendedor(): Observable<respon | undefined | null> {
    return this.http.get<respon | undefined | null>(
      `${environment.api}/verify`,
      { withCredentials: true }
    );
  }

  private getHeaders(clave: string) {
    return new HttpHeaders({
      Authorization: clave ? `Bearer ${clave}` : '',
    });
  }

  salir(): Observable<mensaje> {
    return this.http.get<mensaje>(`${environment.api}/logout`, {
      withCredentials: true,
    });
  }
  traerempresa(): Observable<any> {
    return this.http.get(`${environment.api}/traerempresas`);
  }
}
