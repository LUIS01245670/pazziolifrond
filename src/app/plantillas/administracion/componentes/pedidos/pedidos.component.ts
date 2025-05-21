import { Component, HostBinding, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogData } from '../tienda/tienda.component';
import { serviciodb } from 'src/services/serviciosdbs/serviciodb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket_producto } from 'src/services/socket/socket.producto.service.ts.service';
import generarpdf from '../tienda/pdf/pdfpedido';
import { Horaforma } from 'src/app/utils/formatearhora';
import { generatePDFemail } from '../tienda/pdf/pdf';
import { DialogoAlerta } from 'src/app/angular-material/alerta';
import { take } from 'rxjs/operators';
import { error } from 'protractor';
@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss'],
})
export class PedidosComponent implements OnInit {
  public pedido: [] = [];
  public numero: number = 0;
  public otrocorreo: string = '';
  public total_registros = 0;
  public registros_max = 15;
  public pagina: number = 0;
  public descripcio: string = '';
  public esta: string = '';
  public estado = ['PENDIENTE', 'FACTURADO', 'ANULADO', 'TODO'];
  public estado2: string = '';
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
    private productser: Socket_producto,
    private route: ActivatedRoute
  ) {
    this.obtenerregistros();
  }

  obtenerregistros(busqueda: string = '', estado: string = '') {
    this.productser.obtenernregistros(busqueda, estado).subscribe((data) => {
      if (!data.response) {
        window.location.reload();
      } else {
        this.total_registros = data.nregistros.nregistros;
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const pagina = Number(params['pagina']) || 0;
      this.pagina = pagina;
      if (this.pagina <= 0) {
        this.pagina = 1;
      }
      if (this.pagina > this.total_registros) {
        if (this.total_registros === 0) {
          this.pagina = 1;
        } else {
          this.pagina = this.total_registros;
        }
      }

      this.cargarPedidos(); // función que obtiene los datos según la página
    });
  }
  comensarbusqueda() {
    this.router.navigateByUrl(`admin/pedido?pagina=1`);
  }
  selecionaritem(item: string) {
    this.estado2 = item;
    this.pagina = 1;
    this.buscarpedido();
  }
  cargarPedidos() {
    if (this.descripcio === '') {
      this.productser
        .obtenerpedidos_realizados(this.pagina, this.descripcio, this.estado2)
        .subscribe((data) => {
          console.log(data.pedidos);
          this.pedido = data.pedidos;
          this.obtenerregistros(this.descripcio, this.estado2);
        });
    } else {
      this.productser
        .obtenerpedidos_realizados(this.pagina, this.descripcio, this.estado2)
        .subscribe((data) => {
          this.pedido = data.pedidos;
          this.obtenerregistros(this.descripcio, this.estado2);
        });
    }
  }

  buscarpedido() {
    this.pagina = 1;

    this.productser
      .obtenerpedidos_realizados(this.pagina, this.descripcio, this.estado2)
      .subscribe((data) => {
        this.pedido = data.pedidos;
        this.obtenerregistros(this.descripcio, this.estado2);
      });
  }
  verdetalles() {
    const dialogref = this.dialog.open(Dialogdetalles, {
      data: this.pedido,
      disableClose: true,
      width: '100%',
    });

    dialogref.afterClosed().subscribe((datos) => {});
  }
  pdf(pedido: any) {
    this.productser
      .obteneritemspedido(pedido.codigo_pedido)
      .subscribe((datos) => {
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
        type: 'email',
        inputIcon: 'mail',
        inputText: 'Ingrese correo',
        tipo: 'info',
      },
      disableClose: true,
    });
    dialogref.afterClosed().subscribe((data) => {
      if (data) {
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
                  email: data,
                  fecha: horfecha,
                })
                .pipe(take(1))
                .subscribe((datos) => {
                  const dialogref = this.dialog.open(DialogoAlerta, {
                    data: {
                      boton: 'OK',
                      tipo: 'done',
                      mensaje: 'Correo enviado',
                    },
                    disableClose: true,
                  });
                  dialogref.afterClosed().subscribe((datos) => {});
                });
            }
          });
      }
    });
  }
  eliminar_pedido(element: any) {
    let dialogref;
    if (element.estadopedido === 'PENDIENTE') {
      dialogref = this.dialog.open(DialogoAlerta, {
        data: {
          boton: 'Si',
          boton1: 'No',
          mensaje: 'Desea anular  este pedido?',
          tipo: 'question',
        },
      });

      dialogref.afterClosed().subscribe((dato) => {
        if (dato) {
          console.log(element);
          this.productser
            .anularpedido(
              'ANULADO',
              element.codigo_pedido,
              element.codigousuario
            )
            .subscribe(
              (data) => {
                dialogref = this.dialog.open(DialogoAlerta, {
                  data: {
                    boton: 'Ok',
                    mensaje: data.mensaje,
                    tipo: 'done',
                  },
                });

                dialogref.afterClosed().subscribe((datos) => {
                  this.pagina = 1;
                  this.cargarPedidos();
                });
              },
              (error) => {
                dialogref = this.dialog.open(DialogoAlerta, {
                  data: {
                    boton: 'Ok',
                    mensaje: error.error.mensaje,
                    tipo: 'error',
                  },
                });
              }
            );
        }
      });
    } else {
      dialogref = this.dialog.open(DialogoAlerta, {
        data: {
          icon: 'error',
          boton1: 'Ok',
          mensaje: 'Este pedido no puede ser eliminado ',
          tipo: 'error',
        },
      });
    }
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
