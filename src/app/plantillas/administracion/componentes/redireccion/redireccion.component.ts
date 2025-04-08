import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redireccion',
  templateUrl: './redireccion.component.html',
  styleUrls: ['./redireccion.component.scss']
})
export class RedireccionComponent implements OnInit {

  constructor(router:Router) {
    router.navigateByUrl('admin/tienda')
   }

  ngOnInit(): void {
  }

}
