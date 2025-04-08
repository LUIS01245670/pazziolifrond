import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Socket_producto } from 'src/services/socket/socket.producto.service.ts.service';

@Component({
  selector: 'app-itemspedido',
  templateUrl: './itemspedido.component.html',
  styleUrls: ['./itemspedido.component.scss']
})
export class ItemspedidoComponent implements OnInit {
 public data:[]=[]
 public total:number=0
 displayedColumns: string[] = ['nombre','codigoBarra','cantidad','precio'];

  constructor(private router:Router,private route:ActivatedRoute,private servipro:Socket_producto ) { }

  ngOnInit(): void {
    this.mostrarid()
    
  }

  async mostrarid(){
   
    this.servipro.obteneritemspedido(this.route.snapshot.params['codigo']).subscribe(
      datos=>{
        console.log(datos)
        this.data=datos
       this.total=datos[0].total
      }
    )

  }   

}
