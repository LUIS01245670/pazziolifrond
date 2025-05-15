import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { DatosAlerta } from './alerta';
import { Detallespedido } from './detallespedido';
import { Socket_producto } from 'src/services/socket/socket.producto.service.ts.service';
interface clientes {
  elulares: string;

  codigo: number;

  direccion: string;

  email: string;

  identificacion: string;

  nombre: string;

  telefonoFijo: string;
}
interface datapedido {
  cliente: clientes;
  productos_pedido: producto[];

  _id: string;
}

interface producto {
  cantidad: number;
  codigo: number;

  codigobarra: string;

  _id: number;

  nombre: string;

  numero: null;
  precio: number;

  referencia: string;

  total: number;
}

@Component({
  selector: 'pedidodialogo-alerta',
  template: `
    <div class="contenedor-alert" style="width:100%; height:100%">
      <mat-card style="width:100%; height:100%">
        <mat-card-content style="width:100%; height:100%">
          <mat-card-title style="text-align:center"
            >Pedidos por confirmar</mat-card-title
          >
          <virtual-scroller
            #scroll_productosMostrar
            [items]="data"
            style="width: 100%; height:100%"
          >
            <mat-list style="width: 100%; height:100%">
              <mat-form-field appearance="fill" class="google-search-input">
                <input
                  matInput
                  (keyup)="buscarcliente()"
                  [(ngModel)]="terminobusqueda"
                />
                <button mat-icon-button matSuffix>
                  <mat-icon>search</mat-icon>
                </button>
              </mat-form-field>

              <div
                *ngFor="let _producto of scroll_productosMostrar.viewPortItems"
                [id]="'p_' + _producto._id"
                class="row"
              >
                <div style="width: 100%; " class="col-12">
                  <mat-card style="width:100%;">
                    <mat-card-content (click)="elegirpedido(_producto._id)">
                      <div style="width: 100%; overflow-x: auto !important;">
                        <table style="width:100%;">
                          <thead>
                            <tr>
                              <th>Identificacion</th>
                              <th>Nombre cliente</th>
                              <th>Fecha reserva</th>
                              <th>Hora reserva</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr>
                              <td>{{ _producto.cliente.identificacion }}</td>
                              <td>{{ _producto.cliente.nombre }}</td>
                              <td>{{ formatearfecha(_producto.createdAt) }}</td>
                              <td>{{ formaterahora(_producto.createdAt) }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <mat-card-actions [class.hiden]="id !== _producto._id">
                        <div class="row">
                          <div
                            class="col-md-6 col-sm-12 py-0"
                            style="flex:1;text-align:center;"
                          >
                            <button
                              mat-flat-button
                              color="primary"
                              full-button
                              pedido_con
                              style="box-shadow:4px 4px 10px rgba(0, 0, 0, 0.2) !important;"
                              [mat-dialog-close]="_producto"
                            >
                              Retomar pedido
                            </button>
                          </div>
                          <div
                            class="col-md-6 col-sm-12 py-0"
                            style="flex:1; text-align:center;"
                          >
                            <button
                              mat-flat-button
                              color="primary"
                              full-button
                              pedido_con
                              style="box-shadow:4px 4px 10px rgba(0, 0, 0, 0.2) !important;"
                              (click)="verdetalles(_producto.productos_pedido)"
                            >
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      </mat-card-actions>
                    </mat-card-content>
                  </mat-card>
                </div>
              </div>
            </mat-list>
          </virtual-scroller>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      button[pedido_con] {
        max-width: 150px;
        height: 50px;
        color: #fff !important;
        font-size: 1rem;
        background: #2874a6 !important;
        padding: 0;
      }
      button[pedido_con_D] {
        max-width: 150px;
        height: 50px;
        color: #fff !important;
        font-size: 1rem;
        background: #e74c3c !important;
        padding: 0;
        flex: 1;
      }
      @media (max-width: 650px) {
        button[pedido_con] {
          margin-top: 10px;
        }

        button[pedido_con_D] {
          margin-top: 10px;
        }
      }

      .hiden {
        display: none;
      }
      td,
      th {
        display: flex;
        justy-content: center;
        align-items: center;
        flex: 1;
      }

      tr {
        display: flex;
        column-gap: 10px;
      }
    `,
  ],
})
export class Pedidoguardado {
  terminobusqueda: string = '';
  id: string = '';
  datatemporal: any;

  constructor(
    public dialogRef: MatDialogRef<Pedidoguardado>,
    @Inject(MAT_DIALOG_DATA) public data: Array<datapedido>,
    private dialog: MatDialog,
    private serviproduct: Socket_producto
  ) {
    this.data = this.data.sort();
    this.datatemporal = this.data;
    console.log(data);
  }

  elegirpedido(id: string) {
    this.id = id;
  }

  formatearfecha(timestap: any) {
    let fechaActual = new Date(timestap);

    let diaActual =
      fechaActual.getFullYear() +
      '-' +
      (fechaActual.getMonth() + 1) +
      '-' +
      fechaActual.getDate();

    return diaActual;
  }

  formaterahora(timestap: any) {
    //Para agregar si es AM o PM a tu función formatearfecha, puedes obtener la hora y luego determinar si está antes o después del mediodía.
    let fechaActual = new Date(timestap);
    const pad = (n: number) => n.toString().padStart(2, '0');

    // Determinar AM o PM
    let ampm = fechaActual.getHours() >= 12 ? 'PM' : 'AM';
    // Convertir a formato 12 horas
    let horas = fechaActual.getHours() % 12;
    horas = horas ? horas : 12; // el 0 se convierte en 12
    let horaActual =
      pad(horas) +
      ':' +
      pad(fechaActual.getMinutes()) +
      ':' +
      pad(fechaActual.getSeconds()) +
      ampm;

    return horaActual;
  }

  verdetalles(items: []) {
    const dialogref = this.dialog.open(Detallespedido, {
      width: '80%',
      height: '50%',
      data: items,
    });
  }

  eliminarproductoreservado(id: string) {
    this.serviproduct.aliminarpedidoreservado(id).subscribe(
      (data) => {
        if (data.repuesta) {
          this.serviproduct.verpedido().subscribe((data) => {
            console.log(data.pedido);
            this.data = data.pedido;
          });
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  buscarcliente() {
    if (this.terminobusqueda == '') {
      this.data = this.datatemporal;
      console.log(this.datatemporal);
    } else {
      this.data = this.datatemporal.filter(
        (item: any) =>
          item.cliente.nombre.includes(this.terminobusqueda.toUpperCase()) ||
          item.cliente.identificacion.includes(this.terminobusqueda)
      );
    }
  }
}
