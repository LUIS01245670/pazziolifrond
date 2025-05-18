import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogData } from '../tienda/tienda.component';
import { serviciodb } from 'src/services/serviciosdbs/serviciodb.service';
import { Router } from '@angular/router';
import { Socket_producto } from 'src/services/socket/socket.producto.service.ts.service';
import generarpdf from '../tienda/pdf/pdfpedido';
import { Horaforma } from 'src/app/utils/formatearhora';
import { generatePDFemail } from '../tienda/pdf/pdf';
import { DialogoAlerta } from 'src/app/angular-material/alerta';
@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  public pedido: [] = [];
  public numero: number = 0;
  public otrocorreo: string = '';
  displayedColumns: string[] = [
    'codigo',
    'nombrevendedor',
    'estadopedido',
    'razonsocial_clientes',
    'fecha creacion',
    'totalpedido',
    'acciones',
  ];

  constructor(
    private dialog: MatDialog,
    private sedeselect: serviciodb,
    private router: Router,
    private productser: Socket_producto
  ) {
    this.sedeselect.tienesedeselccionada().subscribe((data) => {
      console.log(data.response);
      if (!data.response) {
        window.location.reload();
      } else {
        this.productser.obtenerpedidos_realizados().subscribe((data) => {
          console.log('datos', data);
          this.pedido = data.pedidos;
        });
      }
    });
  }

  ngOnInit(): void {}
  verdetalles() {
    const dialogref = this.dialog.open(Dialogdetalles, {
      data: this.pedido,
      disableClose: true,
      width: '100%',
    });

    dialogref.afterClosed().subscribe((datos) => {
      console.log('cerrado');
    });
  }
  pdf(pedido: any) {
    this.productser
      .obteneritemspedido(pedido.codigo_pedido)
      .subscribe((datos) => {
        console.log();
        generarpdf({
          cliente: {
            nombre: pedido.razonsocial_clientes,
            identificacion: pedido.identificacion,
            email: pedido.email,
            telefonoFijo: pedido.telefonoFijo,
          },
          numero: pedido.codigo_pedido,
          productos: datos.result,
          fecha_actual: pedido.fecha_creacion,
          horaActual: Horaforma(pedido.hora),
          config: datos.config,
          nombre: datos.vendedor,
        });
      });
  }
  enviarcorreo(pedido: any) {
    const horfecha = `${pedido.fecha_creacion} ${Horaforma(pedido.hora)}`;
    const dialogref = this.dialog.open(DialogoAlerta, {
      data: {
        boton: 'Continuar',
        input: true,
        boton1: 'Cancelar',
        mensaje: 'Digite otro correo si lo desea',
        type: 'text',
        inputIcon: 'mail',
        inputText: 'Ingresecorreo',
        tipo: 'info',
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((data) => {
      console.log(data);
      if (data) {
      }
      this.productser
        .obteneritemspedido(pedido.codigo_pedido)
        .subscribe(async (datos) => {
          if (datos) {
            const pdf = await generatePDFemail({
              cliente: {
                nombre: pedido.razonsocial_clientes,
                identificacion: pedido.identificacion,
                email: pedido.email,
                telefonoFijo: pedido.telefonoFijo,
              },
              numero: pedido.codigo_pedido,
              productos: datos.result,
              fecha_actual: pedido.fecha_creacion,
              horaActual: Horaforma(pedido.hora),
              config: datos.config,
              nombre: datos.vendedor,
            });

            this.productser
              .enviaremail({
                idpedido: pedido.codigo_pedido,
                itemspedido: datos.result,
                cliente: {
                  nombre: pedido.razonsocial_clientes,
                  identificacion: pedido.identificacion,
                  email: pedido.email,
                  telefonoFijo: pedido.telefonoFijo,
                  direccion: pedido.direccion,
                },
                pdf: pdf,
                email: datos,
                fecha: horfecha,
              })
              .subscribe((datos) => {
                const dialogref = this.dialog.open(DialogoAlerta, {
                  data: {
                    boton: 'OK',
                    tipo: 'done',
                    mensaje: 'Correo enviado',
                  },
                  disableClose: true,
                });
                dialogref.afterClosed().subscribe((datos) => {
                  console.log('correo enviado');
                });
              });
          }
        });
    });
  }
}

@Component({
  selector: 'dialog-detalles',
  templateUrl: 'dialogs/dialog-detalles.html',
})
@HostBinding('container')
export class Dialogdetalles {
  displayedColumns: string[] = ['nombre', 'codigobarra', 'estado'];
  constructor(
    public dialogRef: MatDialogRef<Dialogdetalles>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
