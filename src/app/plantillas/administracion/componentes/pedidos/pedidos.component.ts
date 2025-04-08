import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogData, DialogSedes } from '../tienda/tienda.component';
import { serviciodb } from 'src/services/serviciosdbs/serviciodb.service';
import { Router } from '@angular/router';
import { Socket_producto } from 'src/services/socket/socket.producto.service.ts.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  public pedido:[]=[]
displayedColumns: string[] = [ 'documentovendedor', 'estadopedido','nombre_cliente','razonsocial_clientes',
  'acciones'
];

  constructor(private dialog:MatDialog,private sedeselect:serviciodb,private router:Router ,private productser:Socket_producto) {
    this.sedeselect.tienesedeselccionada().subscribe(
      data=>{
        if(!data.respose){
            this.router.navigateByUrl('admin/tienda')
        }else{
          this.productser.obtenerpedidos_realizados().subscribe(
            data=> this.pedido=data.pedidos
          )
        }
      }
    )
   }

  ngOnInit(): void {
  }
  verdetalles(){
    const dialogref=this.dialog.open(Dialogdetalles,{
      data:this.pedido,
      disableClose: true,
      width:'100%',
      
    })

    dialogref.afterClosed().subscribe(
      datos=>{
        console.log("cerrado")
      }
    )

  }



}


@Component({
	selector: 'dialog-detalles',
	templateUrl: 'dialogs/dialog-detalles.html',

})
@HostBinding('container')
export class Dialogdetalles{
  displayedColumns: string[] = ['nombre', 'codigobarra', 'estado'];
 constructor(public dialogRef: MatDialogRef<Dialogdetalles>, @Inject(MAT_DIALOG_DATA) public data:any) {
      
  }
}