import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatosAlerta } from './alerta';
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
        <virtual-scroller
          #scroll_productosMostrar
          [items]="data"
          style="width: 100%; height:100%"
        >
          <mat-card-content style="width:100%; height:100%">
            <mat-list style="width: 100%; height:100%">
              <table style="width:100%;">
                <thead>
                  <tr>
                    <th>Codigo</th>
                    <th>Descripcion</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    *ngFor="
                      let _producto of scroll_productosMostrar.viewPortItems
                    "
                  >
                    <td>{{ _producto.codigo }}</td>
                    <td>{{ _producto.nombre }}</td>
                    <td>{{ _producto.cantidad }}</td>
                    <td>$ {{ _producto.precio.toLocaleString('de-DE') }}</td>
                    <td>$ {{ _producto.total.toLocaleString('de-DE') }}</td>
                  </tr>
                </tbody>
              </table>
            </mat-list>
            <mat-card-footer style="text-align:end;">
              <!--totalPagar.toLocaleString("de-DE") convierte un número a una cadena de texto con formato local, en este caso usando el formato alemán ("de-DE").-->
              <strong>Total venta:</strong><b>$</b>
              <span style="font-weight:bold;font-size:1rem">{{
                total_venta_general.toLocaleString('de-DE')
              }}</span>
            </mat-card-footer>
          </mat-card-content>
        </virtual-scroller>
      </mat-card>
    </div>
  `,
  styles: [
    `
      button[pedido_con] {
        max-width: 200px;
        font-color: #0000;
        font-size: 1rem;
        background: #eaeded;
      }

      .hiden {
        display: none;
      }

      td,
      th {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
      }

      tr {
        display: flex;
        border-bottom: 1px solid #000;
        column-gap: 10px;
      }
    `,
  ],
})
export class Detallespedido {
  id: string = '';
  total_venta_general: number = 0;
  constructor(
    public dialogRef: MatDialogRef<Detallespedido>,
    @Inject(MAT_DIALOG_DATA) public data: Array<any>
  ) {
    this.total_venta_general = data.reduce((i, item) => (i += item.total), 0);
  }
}
