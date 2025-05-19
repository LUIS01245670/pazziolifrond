import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Platform } from '@ionic/angular';
import { FormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { SocketService } from 'src/services/socket/socket.service';
import { DatosAlerta, DialogoAlerta } from 'src/app/angular-material/alerta';
import { DatosPedido } from 'src/app/modelos/datos-peticion copy';
import { Socket_producto } from 'src/services/socket/socket.producto.service.ts.service';
import { io } from 'socket.io-client';
import { debounceTime, filter, take } from 'rxjs/operators';

import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

export interface DialogData {
  identificacion: string;
  base_datos: string;
}

export interface PRODUCTO {
  numero: number;
  id: string;
  nombre: string;
  codigo: string;
  codigoContable: string;
  referencia: string;
  cantidad: number;
  precio: number;
  total: number;
  producto: any;
  codigobarra: string;
  tasaiva: string;
  presentacion: string;
  cantidaddisponible: number;
  [key: string]: any;
}
@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrls: ['./tienda.component.scss'],
})
export class TiendaComponent implements OnInit {
  id_cliente_store: string = '';
  shoping_card1: boolean = false;
  shoping_card2: boolean = false;
  ventana: any = null;
  cantidadproducto: string = '';
  nombrevendedor: String = '';
  identificacion: String = '';
  numeropedido: number = 0;
  id_select: string = '';
  sedeSeleccionada: any;
  terceroConsultado: any = null;
  codigoitemseled: number = 0;
  @ViewChild('inCodigo') inCodigo!: ElementRef;
  @ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger })
  inDescripcion!: MatAutocompleteTrigger;
  fechahora: string = '';
  @ViewChild('inCantidad') inCantidad!: ElementRef;
  @ViewChild('inPrecio') inPrecio!: ElementRef;

  clientes: any[] = [];
  clientesIniciales: any[] = [];
  productinico: PRODUCTO[] = [];
  productos: PRODUCTO[] = [
    /*{
			cantidad: 13,
			codigo: "005",
			codigoContable: "00",
			id: "001",
			nombre: "PROD PRUEBA",
			numero: 0,
			precio: 5000,
			referencia: "REF 000",
			total: 500000,
			producto: {}
		},

	 {
			cantidad: 13,
			codigo: "005",
			codigoContable: "00",
	    	id: "001",
			nombre: "PROD PRUEBA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0",
		   	numero: 0,
		 	precio: 5000,
			referencia: "REF 000",
		 	total: 500000,
		 	producto: {}
		 },
		 {
		 	cantidad: 13,
		 	codigo: "005",
		 	codigoContable: "00",
		 	id: "001",
		 	nombre: "PROD PRUEBA",
		 	numero: 0,
		 	precio: 5000,
		 	referencia: "REF 000",
		 	total: 500000,
		    	producto: {}
		    },

	      {
	 	cantidad: 13,
	 	codigo: "005",
	 	codigoContable: "00",
		id: "001",
	 	nombre: "PROD PRUEBA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0",
	 	numero: 0,
	 	precio: 5000,
	 	referencia: "REF 000",
	 	total: 500000,
	 	producto: {}
	 },*/
  ];

  productosMostrar: PRODUCTO[] = [];

  buscarDescripcion = new UntypedFormControl('');

  buscarCliente: string = '';
  opcionesFiltradas: any[] = [];
  clienteSeleccionado = {
    nombre: 'Seleccione un cliente',
    identificacion: '',
    email: '',
    celulares: '',
    direccion: '',
    telefonoFijo: '',
    codigo: 0,
    imagen: null,
    ciudad: '',
  };
  sede: string = '';

  productoActual: PRODUCTO = {
    numero: 0,
    id: '_vacio',
    nombre: 'Nombre del producto',
    codigo: '000',
    codigoContable: '000',
    referencia: '000',
    codigobarra: '0000',
    cantidad: 0,
    precio: 0,
    total: 0,
    producto: {},
    tasaiva: '',
    presentacion: '',
    cantidaddisponible: 0,
  };
  cantidadactual: number = 0;
  cantidad: number = 0;
  precio: number = 0;
  codigo: String = '';
  referencia: String = '';
  totalPagar: number = 0;

  suscripcionSocket!: Subscription;

  loader: boolean = true;

  pdf: any;
  enterPrecio: any = 0;
  subscri: any;
  almacen: string = '';
  basedatosactual: string = '';
  configuracion!: any;

  constructor(
    private _snackBar: MatSnackBar,
    private socketServices: SocketService,
    private app: AppComponent,
    public dialog: MatDialog,
    private socketservidbs: serviciodb,
    private socketproduct: Socket_producto,
    private router: Router
  ) {
      }

  ngOnInit(): void {
    this.seleccionardb();
  }

  seleccionardb() {
    this.socketservidbs.tienesedeselccionada().subscribe((datos) => {
            if (datos.response) {
        this.loader = true;
                //take para obtener un unico valor del observable y no mantener la suscribcion activa
        this.iniciarprograma();
        this.socketproduct
          .obteneralmacen()
          .pipe(take(1))
          .subscribe((datos) => {
                        this.almacen = datos.almacen;
            this.configuracion = datos.config;
            this.identificacion = datos.identificacion;
            this.nombrevendedor = datos.nombre;
          });
      } else {
              }
    });
  }

  crearinstanciadb(pruebas: string) {
    this.socketservidbs.crearinstanciadb(pruebas).subscribe((datos) => {
      if (datos.response) {
        window.location.reload();
      }
    });
  }

  iniciarprograma() {
        if (
      !localStorage.getItem('pedido') ||
      localStorage.getItem('pedido') === null
    ) {
      this.socketServices.escucha = this.socketproduct.obtenerInfo(
        'aws',
        'pazzioli-pos-3',
        {
          metodo: 'CONSULTAR',
          condicion: '',
          consulta: 'productos',
          sede: localStorage.getItem('sede'),
        }
      );
      //this.socketServices.consultarTercero(this.sedeSeleccionada.po.canalsocket, '', '', this.sedeSeleccionada.usuario.usuario);
      this.socketServices.escucha.subscribe((info: any) => {
                this.loader = false;
        this.totalPagar = 0;
        this.productosMostrar.forEach((producto) => {
          this.totalPagar += producto.total;
        });
        info = JSON.parse(info);
        switch (info.tipoConsulta) {
          case 'PRODUCTO':
            if (info.estadoPeticion === 'SUCCESS') {
                            this.respuestaProductos(info, true);
            } else {
                            this.respuestaProductos(info, false);
            }
            break;
          case 'TERCERO':
            if (info.estadoPeticion === 'SUCCESS') {
              this.respuestaTerceros(info);
            }
            break;
          case 'PEDIDO':
            if (info.estadoPeticion === 'SUCCESS') {
              this.respuestaPedidos(info);
            }
            break;
          default:
            break;
        }
      });
    } else {
      this.productosMostrar = JSON.parse(
        localStorage.getItem('pedido') || '{nombre:""}'
      );

      this.socketServices.escucha = this.socketproduct.obtenerInfo(
        'aws',
        'pazzioli-pos-3',
        {
          metodo: 'CONSULTAR',
          condicion: '',
          consulta: 'productos',
          sede: localStorage.getItem('sede'),
        }
      );

      //this.socketServices.consultarTercero(this.sedeSeleccionada.po.canalsocket, '', '', this.sedeSeleccionada.usuario.usuario);
      this.socketServices.escucha.subscribe((info: any) => {
        this.totalPagar = 0;

        this.productosMostrar.forEach((producto) => {
          this.totalPagar += producto.total;
        });
        info = JSON.parse(info);
        switch (info.tipoConsulta) {
          case 'PRODUCTO':
            if (info.estadoPeticion === 'SUCCESS') {
              this.respuestaProductos(info, true);
            } else {
              this.respuestaProductos(info, false);
            }
            break;
          case 'TERCERO':
            if (info.estadoPeticion === 'SUCCESS') {
              this.respuestaTerceros(info);
            }
            break;
          case 'PEDIDO':
            if (info.estadoPeticion === 'SUCCESS') {
              this.respuestaPedidos(info);
            }
            break;
          default:
            break;
        }
      });
    }
  }

  seleccionaritem(_producto: PRODUCTO) {
    this.shoping_card2 = true;
    this.shoping_card1 = false;
        const indexproduct = this.productinico.findIndex(
      (product) => product.codigo === _producto.codigo
    );
        this.cantidadactual = this.productinico[indexproduct]?.cantidaddisponible;
    this.codigoitemseled = Number(_producto.codigo);
    this.productoActual = _producto;
    this.precio = this.productoActual.precio;
    this.cantidad = _producto.cantidad;

    this.productoActual.id = '_vacio';
    document.getElementById('p_actual')?.classList.add('active');
  }

  buscarProductos(key: any, campo: String) {
            if (this.productinico.length > 0) {
            let val = '';
            if (this.buscarDescripcion.value) {
        val = this.buscarDescripcion.value.toString().toLowerCase();

        this.opcionesFiltradas = [];
                this.productos.forEach((_prod) => {
          if (
            _prod.nombre.toString().toLowerCase().includes(val) ||
            _prod.referencia.toString().toLowerCase().includes(val) ||
            _prod.codigobarra.toString().toLowerCase().includes(val)
          ) {
            this.opcionesFiltradas.push(_prod);
          }
        });
      } else {
        val = this.referencia.toString().toLowerCase();
        this.opcionesFiltradas = [];
        this.productos.forEach((_prod) => {
          if (_prod.referencia.toString().toLowerCase().includes(val)) {
            this.opcionesFiltradas.push(_prod);
          }
        });
      }

      if (key.keyCode == 13) {
                this.elegirCantidad(this.buscarDescripcion.value);
      }
    } else {
      this.eventoEnter(key, campo);
    }
  }

  displayFn(_prod: PRODUCTO): string {
    return _prod && _prod.nombre ? _prod.nombre : '';
  }

  reiniciar() {
    document.getElementById('p_actual')?.classList.remove('active');
    this.shoping_card1 = false;
    this.shoping_card2 = false;
    this.productoActual = {
      numero: 0,
      id: '_vacio',
      nombre: 'Nombre del producto',
      codigo: '000',
      codigoContable: '000',
      referencia: '000',
      codigobarra: '0000',
      cantidad: 0,
      precio: 0,
      total: 0,
      producto: {},
      tasaiva: '',
      presentacion: '',
      cantidaddisponible: 0,
    };
    this.codigo = '';
    this.referencia = '';
    this.cantidad = 0;
    this.precio = 0;
    this.buscarDescripcion.patchValue('');

    //document.getElementById('descripcion')?.focus();
    document.getElementById('p_actual')?.classList.remove('active');
    this.codigoitemseled = 0;
    this.enumerarProductos();
  }

  enumerarProductos() {
    this.productosMostrar.forEach((__prod, index) => {
      __prod.numero = index + 1;
    });
  }
  verpedidos() {
    this.socketServices.buscarclientes().subscribe((datos) => {});
    this.socketproduct.verpedido().subscribe((data) => {
      const dialogref = this.dialog.open(Pedidoguardado, {
        width: '100%',
        height: '80%',
        data: data.pedido,
      });

      dialogref.afterClosed().subscribe((data) => {
        this.clienteSeleccionado = data.cliente;
        let clienteguardar = data.cliente;
        this.productosMostrar = data.productos_pedido;
        localStorage.setItem('pedido', JSON.stringify(data.productos_pedido));
        delete clienteguardar._id;
        this.socketServices.guardarcliente(clienteguardar);

        this.totalPagar = this.productosMostrar.reduce(
          (i, item) => (i += item.total),
          0
        );
        this.socketServices.buscarclientes().subscribe((data) => {
          this.id_cliente_store = data.datos._id;
          this.socketServices
            .guardarcliente({
              identificacion: clienteguardar.identificacion,
              razonSocial: clienteguardar.nombre,
              telefonoFijo: clienteguardar.telefonoFijo,
              email: clienteguardar.email,
              celulares: clienteguardar.celulares,
              direccion: clienteguardar.direccion,
              codigo: clienteguardar.codigo,
            })
            .subscribe((data) => {});
        });
      });
    });
  }

  reservarpedido() {
        const datospedido = {
      cliente: this.clienteSeleccionado,
      productos_pedido: this.productosMostrar,
    };
    if (this.clienteSeleccionado.codigo === 0) {
      this.openDialogAlerta({
        boton: 'Ok',
        mensaje: 'Selecciona un cliente primero',
        tipo: 'error',
      });
    } else {
      if (this.productosMostrar.length <= 0) {
        this.openDialogAlerta({
          boton: 'Ok',
          mensaje: 'No has agregado ningun producto',
          tipo: 'error',
        });
      } else {
        const dialogRef = this.dialog.open(DialogoAlerta, {
          data: {
            titulo: 'CORRECTO',
            mensaje: 'Desea continuar?',
            boton: 'Confirmar',
            tipo: 'question',
            boton1: 'Cancelar',
            input: false,
          },
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe((data) => {
          if (data) {
            if (this.id_select !== '') {
              this.socketproduct
                .actulizarpedido(this.id_select, datospedido)
                .subscribe((data) => {
                                    this.openDialogAlerta({
                    mensaje: data.message,
                    tipo: 'done',
                    boton: 'Ok',
                  });
                });

              return;
            }
            this.socketproduct
              .reservarpedidos(datospedido)
              .subscribe((data) => {
                this.openDialogAlerta({
                  mensaje: data.message,
                  tipo: 'done',
                  boton: 'Ok',
                });
              });
          }
        });
      }
    }

    /**/
  }

  eliminarproductoreservado() {
    const dialogref = this.dialog.open(DialogoAlerta, {
      data: {
        tipo: 'warning',
        boton: 'Confirmar',
        boton1: 'Cancelar',
        mensaje: 'Seguro desea eliminar este pedido reservado?',
      },
    });
    dialogref.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.socketproduct.aliminarpedidoreservado(this.id_select).subscribe(
          (data) => {
            this.id_select = '';
            if (data.repuesta) {
              this.deleteAll();
            }
          },
          (error) => {}
        );
      }
    });
  }

  elegirCantidad(_prod: any) {
    if (typeof _prod == 'object') {
      if (this.buscarDescripcion.value) {
                this.shoping_card1 = true;
        this.productoActual = { numero: null, ..._prod };
        this.precio = this.productoActual.precio;
        document.getElementById('p_actual')?.classList.add('active');
        this.cantidad = 1;
        this.codigo = this.productoActual.codigo;
        this.referencia = this.productoActual.referencia;
                this.cantidadactual =
          this.productoActual['producto'][this.cantidadproducto];
                        document.getElementById('cantidad')?.focus();
      } else if (this.productos.length > 0) {
                this.productoActual = this.productos[0];
        this.precio = this.productoActual.precio;
        document.getElementById('p_actual')?.classList.add('active');
        this.cantidad = 1;
        document.getElementById('cantidad')?.focus();
      } else {
                this.inCodigo.nativeElement.focus();
      }
    }
  }
  displayrefer(_prod: PRODUCTO) {
    return _prod && _prod.referencia ? _prod.referencia : '';
  }
  elegirreferencia(_prod: any) {
    this.productoActual = { numero: null, ..._prod };
    this.precio = this.productoActual.precio;
    document.getElementById('p_actual')?.classList.add('active');
    this.cantidad = 1;
    this.referencia = this.productoActual.referencia;
    this.codigo = this.productoActual.codigo;
    this.buscarDescripcion.setValue(this.productoActual);
  }

  confirmDeleteAll() {
    const data: DatosAlerta = {
      titulo: 'ATENCIÓN',
      mensaje: '¿Desea reiniciar la venta?',
      boton: 'SI',
      tipo: 'question',
      boton1: 'NO',
      input: false,
    };
    const dialogRef = this.dialog.open(DialogoAlerta, {
      data: data,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((resultado) => {
            if (resultado == true) {
        this.deleteAll();
      }
      this.loader = false;
    });
  }

  deleteAll() {
        this.id_select = '';
    this.productosMostrar = [];
    this.totalPagar = 0;
    this.productosMostrar.forEach((producto) => {
      this.totalPagar += producto.total;
    });
    this.clienteSeleccionado = {
      nombre: 'Seleccione un cliente',
      identificacion: '',
      email: '',
      celulares: '',
      direccion: '',
      telefonoFijo: '',
      codigo: 0,
      imagen: null,
      ciudad: '',
    };
    localStorage.removeItem('pedido');
    this.reiniciar();

    this.socketServices
      .eliminarproducto(this.id_cliente_store)
      .subscribe((datos) => {
                        this.id_cliente_store = '';
      });
  }

  async elegirPrecio(event: any) {
    await this.calcularProductoActual();
    if (event.keyCode == 13) {
      document.getElementById('precio')?.focus();
    }
  }
  abrirpanel() {
    if (this.opcionesFiltradas.length > 0) {
      this.codigoitemseled = 0;
      this.inDescripcion.openPanel();
    }
  }

  async agregarProducto() {
    if (Number(this.cantidad) > 0) {
      this.opcionesFiltradas = [];
            await this.calcularProductoActual();
      this.productoActual.precio = Number(this.precio);
      this.productoActual.cantidad = Number(this.cantidad);

      let index = this.productosMostrar.findIndex((item) => {
        return item.codigo == this.productoActual.codigo;
      });
      if (index != -1) {
        let _cantidad = this.productosMostrar[index].cantidad + this.cantidad;
        let _precio_total = Number(_cantidad) * Number(this.precio);

        this.productosMostrar[index].cantidad = _cantidad;
        this.productosMostrar[index].precio = this.precio;
        this.productosMostrar[index].total = _precio_total;
                localStorage.setItem('pedido', JSON.stringify(this.productosMostrar));
      } else {
        let options = this.productinico.findIndex((option) => {
          return option.codigo === this.productoActual.codigo;
        });

        if (this.productinico[options].cantidaddisponible <= 0) {
          /* console.log(
            this.opcionesFiltradas[options]['producto'][
              `cantidad${(Number(this.almacen.slice(-1)) - 1).toString()}`
            ]
          );*/
          this.cantidadproducto;
          this.openSnackBar('Este producto esta agotado');
        } else {
                    if (
            this.productinico[options].cantidaddisponible <
            this.productoActual.cantidad
          ) {
            this.openSnackBar('Cantidad no disponible');
          } else {
            if (this.productinico[options].precio <= 0) {
              this._snackBar.open('producto sin precio', 'ok', {
                duration: 3000,
                verticalPosition: 'top', // ⬆️ aparece arriba
                horizontalPosition: 'center', // ⬅️ puede ser 'start' | 'center' | 'end' | 'left' | 'right'
              });
            } else {
              delete this.productoActual.producto;

              let products = [...this.productosMostrar, this.productoActual];
              this.productosMostrar = products;
                            localStorage.setItem('pedido', JSON.stringify(products));
            }
          }
        }
      }
      this.totalPagar = 0;
      this.productosMostrar.forEach((producto) => {
        this.totalPagar += producto.total;
      });
      this.reiniciar();
    } else {
      if (this.enterPrecio % 2 == 0) {
        const data: DatosAlerta = {
          titulo: 'ERROR',
          mensaje:
            'La cantidad del producto no puede ser menor o igual a cero.',
          boton: 'OK',
          tipo: 'error',
          input: false,
        };
        this.openDialogAlerta(data);
        this.enterPrecio += 1;
      } else {
        this.enterPrecio += 1;
      }
    }
  }
  actulizaritems(e: any, product: PRODUCTO) {
    e.stopPropagation();

    if (this.codigoitemseled > 0) {
      if (this.codigoitemseled === Number(product.codigo)) {
        let index = this.productosMostrar.findIndex(
          (pro) => Number(pro.codigo) === this.codigoitemseled
        );
        let options = this.productos.findIndex(
          (pro) => Number(pro.codigo) === this.codigoitemseled
        );
                if (this.productos[options].cantidaddisponible < this.cantidad) {
          this.openSnackBar('Cantidad no disponible');
        } else {
          this.productosMostrar[index].cantidad = this.cantidad;
          this.productosMostrar[index].total =
            Number(this.cantidad) * Number(this.precio);
          document.getElementById('p_actual')?.classList.remove('active');
          this.shoping_card2 = false;
          this.codigoitemseled = 0;
          this.totalPagar = 0;
          this.productosMostrar.forEach((producto) => {
            this.totalPagar += producto.total;
          });
        }
      }
    }
  }
  eliminarProducto(e: any, id: string) {
    e.stopPropagation();

        document.getElementById('p_' + id)?.classList.add('deleted');

    let filteredItems = this.productosMostrar.filter(
      (item) => id !== item.codigo
    );
    this.productosMostrar = [...filteredItems];
    this.totalPagar = 0;
    this.productosMostrar.forEach((producto) => {
      this.totalPagar += producto.total;
    });
        this.enumerarProductos();
  }

  calcularProductoActual(): Promise<number> {
    return new Promise((resolve, err) => {
      let _precio_total = Number(this.cantidad) * Number(this.precio);
      this.productoActual.total = _precio_total;
      resolve(_precio_total);
    });
  }

  async eventoEnter(e: any, input: String) {
    this.shoping_card1 = false;
    await this.calcularProductoActual();
    if (e.keyCode == 13) {
      switch (input) {
        case 'codigo':
          this.buscarProducto(this.codigo, 'CODIGO-EQUAL');
          break;
        case 'referencia':
          this.buscarProducto(this.referencia, 'CODIGO-EQUAL');
          break;
        case 'descripcion':
          this.buscarProducto(this.buscarDescripcion.value, 'DESCRIPCION');
          break;
        case 'cantidad':
          this.inPrecio.nativeElement.focus();
          break;
        case 'precio':
          if (this.productoActual.id != '_vacio') {
            this.agregarProducto();
          } else {
            const data: DatosAlerta = {
              titulo: 'ERROR',
              mensaje: 'Por favor ingrese un producto valido',
              boton: 'OK',
              tipo: 'error',
              input: false,
            };
            this.openDialogAlerta(data);
          }
          break;
        default:
          break;
      }
    }
  }

  seleccionarCliente(cliente: any) {
    this.socketServices.buscarclientes().subscribe((data) => {
      if (data.datos && data.datos._id) {
        this.id_cliente_store = data.datos._id;
        this.clienteSeleccionado.nombre = cliente.razonSocial;
        this.clienteSeleccionado.identificacion = cliente.identificacion;
        this.clienteSeleccionado.email = cliente.email;
        this.clienteSeleccionado.celulares = cliente.celulares;
        this.clienteSeleccionado.direccion = cliente.direccion;
        this.clienteSeleccionado.telefonoFijo = cliente.telefonoFijo;
        this.clienteSeleccionado.codigo = cliente.codigo;
        this.clienteSeleccionado.imagen = cliente.imagen || null;
        this.clienteSeleccionado.ciudad = cliente.municipio;
        this.buscarCliente = '';
        this.clientes = [];
        this.socketServices.guardarcliente(cliente).subscribe();
      } else {
        this.clienteSeleccionado.nombre = cliente.razonSocial;
        this.clienteSeleccionado.identificacion = cliente.identificacion;
        this.clienteSeleccionado.email = cliente.email;
        this.clienteSeleccionado.celulares = cliente.celulares;
        this.clienteSeleccionado.direccion = cliente.direccion;
        this.clienteSeleccionado.telefonoFijo = cliente.telefonoFijo;
        this.clienteSeleccionado.codigo = cliente.codigo;
        this.clienteSeleccionado.imagen = cliente.imagen || null;
        this.clienteSeleccionado.ciudad = cliente.municipio;
        this.buscarCliente = '';
        this.clientes = [];
        this.socketServices.guardarcliente(cliente).subscribe();
      }
    });
  }
  async buscarProducto(valor: String, tipo: String) {
    this.loader = true;
    this.productos = [];
    try {
      this.socketServices.consultarProducto(
        this.sedeSeleccionada.po.canalsocket,
        tipo,
        valor,
        this.sedeSeleccionada.usuario.usuario
      );
    } catch (error) {
          } finally {
      setTimeout(() => {
        if (tipo != 'DESCRIPCION') {
          this.elegirCantidad(null);
        }
      }, 1000);
    }
  }

  respuestaProductos(info: any, estado: Boolean) {
        this.socketServices.buscarclientes().subscribe((datos) => {
      if (datos.datos && datos.datos.razonSocial) {
        this.id_cliente_store = datos.datos._id;
        this.clienteSeleccionado.nombre = datos.datos.razonSocial;
        this.clienteSeleccionado.identificacion = datos.datos.identificacion;
        this.clienteSeleccionado.email = datos.datos.email;
        this.clienteSeleccionado.celulares = datos.datos.celulares;
        this.clienteSeleccionado.direccion = datos.datos.direccion;
        this.clienteSeleccionado.telefonoFijo = datos.datos.telefonoFijo;
        this.clienteSeleccionado.codigo = datos.datos.codigo;
        this.clienteSeleccionado.imagen = datos.datos.imagen || null;
        this.clienteSeleccionado.ciudad = datos.datos.municipio;
      }
    });
    if (estado) {
            this.productos = info.mensajePeticion.map((producto: any) => {
        return <PRODUCTO>{
          id: producto.codigo,
          nombre: producto.descripcion,
          codigo: producto.codigo,
          codigoContable: producto.codigoContable,
          referencia: producto.referencia,
          precio: producto.precio1,
          codigobarra: producto.codigoBarra,
          total: 0,
          producto: producto,
          tasaiva: producto.tasaIva,
          presentacion: producto.presentacion,
          cantidaddisponible: producto.cantidad,
        };
      });
      this.productinico = this.productos;
      if (this.almacen === 'BODEGA') {
        this.cantidadproducto = 'cantidad';
      } else {
        this.cantidadproducto = `cantidad${(
          Number(this.almacen.slice(-1)) + 1
        ).toString()}`;
      }
      this.opcionesFiltradas = this.productos;

      //this.inDescripcion.openPanel();
    } else {
      const data: DatosAlerta = {
        titulo: 'ERROR',
        mensaje: 'No se encontraron productos',
        boton: 'OK',
        tipo: 'error',
        input: false,
      };
      this.openDialogAlerta(data);
      this.loader = false;
    }
    this.loader = false;
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 2000,
    });
  }
  autocompletarinputclient(valor: string) {
    if (valor === '') {
      this.clientes = [];
    } else {
      this.socketproduct
        .obtenerInfo('terceros', 'pazzioli-pos-3', {
          metodo: 'CONSULTAR',
          condicion: 'nombres',
          consulta: 'TERCEROS',
          canalserver: 'terceros',
          datoCondicion: valor,
        })
        .subscribe((dato) => {
                              if (JSON.parse(dato).estadoPeticion === 'SUCCESS') {
            console.log(JSON.parse(dato).mensajePeticion);
            this.clientes = JSON.parse(dato).mensajePeticion;
          }
        });
    }
  }
  buscarClientes() {
    this.clientes = [];
    this.clientesIniciales.forEach((cliente) => {
      if (
        cliente.razonSocial
          .toLowerCase()
          .includes(this.buscarCliente.toLowerCase()) ||
        cliente.identificacion
          .toLowerCase()
          .includes(this.buscarCliente.toLowerCase())
      ) {
        this.clientes.push(cliente);
      }
    });
  }
  crearPedido() {
    if (this.productosMostrar.length <= 0) {
      const data: DatosAlerta = {
        titulo: 'ERROR',
        mensaje: 'Primero debe ingresar un producto.',
        boton: 'OK',
        tipo: 'error',
        input: false,
      };
      this.openDialogAlerta(data);
      return;
    } else if (this.clienteSeleccionado.codigo <= 0) {
      const data: DatosAlerta = {
        titulo: 'ERROR',
        mensaje: 'Seleccione un cliente primero.',
        boton: 'OK',
        tipo: 'error',
        input: false,
      };
      this.openDialogAlerta(data);
      return;
    } else if (this.clienteSeleccionado.email == '') {
      const data: DatosAlerta = {
        titulo: 'VERIFICAR',
        mensaje: 'Ingrese un correo para enviar el pedido al cliente.',
        boton: 'ENVIAR',
        boton1: 'CANCELAR',
        tipo: 'info',
        input: true,
        inputIcon: 'alternate_email',
        inputText: 'Correo',
        type: 'email',
      };
      this.openDialogAlerta(data);
      return;
    } else {
      /*const respon: DatosAlerta = {
				titulo: 'realizado',
				mensaje: 'pedido creado ',
				boton: "OK",
				tipo: "info",
				input: false
			}
			this.openDialogAlerta(respon);*/
      const dialogref = this.dialog.open(DialogoAlerta, {
        data: {
          boton: 'Confirmar',
          boton1: 'Cancelar',
          tipo: 'question',
          mensaje: 'Confirma realizar este pedido?',
        },
        disableClose: true,
      });
      dialogref.afterClosed().subscribe((datos) => {
        if (datos) {
          this.enviarPedido();
        }
      });
    }
  }

  enviarPedido() {
    try {
      this.loader = true;
      this.totalPagar = 0;
      let fechaActual = this.obtenerFechaHora();
      this.fechahora = `${fechaActual.diaActual} ${fechaActual.horaActual}`;
      let itemsPedidos = this.productosMostrar.map((producto) => {
                this.totalPagar += producto.total;
        return {
          codigoProducto: producto.codigo,
          valor: producto.precio,
          cantidad: producto.cantidad,
          nombre: producto.nombre,
          precio: producto.precio,
          total: producto.total,
          tasaiva: producto.tasaiva,
          referencia: producto.referencia,
          codigoUsuario: this.clienteSeleccionado.codigo,
        };
      });
      let pedido = new DatosPedido(
        this.clienteSeleccionado.codigo,
        fechaActual.diaActual,
        fechaActual.horaActual,
        this.clienteSeleccionado.codigo,
        this.totalPagar,
        this.id_select
      );
            this.socketproduct
        .crearpedido('pedido', 'pazzioli-pos-3', {
          metodo: 'CREAR',
          condicion: 'nombres',
          consulta: 'PEDIDO',
          canalserver: 'pedido',
          datos: {
            pedido: pedido.datos,
            itemsPedido: itemsPedidos,
            cliente: this.clienteSeleccionado,
            pdf: this.pdf,
            modificaInventario: this.clienteSeleccionado.email,
            //aqui iria la variable de modificacion de inventario
          },
          sede: localStorage.getItem('sede'),
        })
        .subscribe((inf) => {
                    if (inf.estadoPeticion === 'SUCCESS') {
            this.openDialogFactura();
          }
        });
    } catch (error) {
            let elementos = document.getElementsByClassName(
        'cdk-overlay-container'
      ) as HTMLCollectionOf<HTMLElement>;
      elementos[0].style.zIndex = '1000';
      const data: DatosAlerta = {
        titulo: 'ERROR',
        mensaje: 'Error al intentar crear pedido',
        boton: 'OK',
        boton1: 'CANCELAR',
        tipo: 'error',
        input: false,
      };
      this.openDialogAlerta(data);
    }
  }

  respuestaPedidos(info: any) {
    let elementos = document.getElementsByClassName(
      'cdk-overlay-container'
    ) as HTMLCollectionOf<HTMLElement>;
    elementos[0].style.zIndex = '1000';
    if (info.estadoPeticion === 'SUCCESS' && info.tipoConsulta === 'PEDIDO') {
      this.deleteAll();
      const data: DatosAlerta = {
        titulo: 'CORRECTO',
        mensaje: 'Pedido creado exitosamente',
        boton: 'OK',
        tipo: 'done',
        input: false,
      };
      this.openDialogAlerta(data);
    }
  }

  obtenerFechaHora() {
    let fechaActual = new Date();
    //.padStart(2, '0')Le dice: "haz que el string tenga al menos 2 caracteres. Si le falta, agrega '0' al inicio".

    const pad = (n: number) => n.toString().padStart(2, '0');

    let diaActual =
      fechaActual.getFullYear() +
      '-' +
      pad(fechaActual.getMonth() + 1) +
      '-' +
      pad(fechaActual.getDate());
    let horaActual =
      pad(fechaActual.getHours()) +
      ':' +
      pad(fechaActual.getMinutes()) +
      ':' +
      pad(fechaActual.getSeconds());
    return { diaActual, horaActual };
  }

  respuestaTerceros(info: any) {
    this.clientes = info.mensajePeticion;
    this.clientesIniciales = info.mensajePeticion;
    this.loader = false;
  }

  openDialogAlerta(data: any) {
    const dialogRef = this.dialog.open(DialogoAlerta, {
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((resultado) => {
            if (resultado != false && data.tipo == 'info') {
        this.clienteSeleccionado.email = resultado == true ? null : resultado;
        //this.openDialogFactura();
      }

      if (data.tipo == 'done') {
                this.deleteAll();
      }
      this.loader = false;
    });
  }

  async openDialogFactura() {
    let numerofactura: number = 0;
    const { diaActual, horaActual } = this.obtenerFechaHora();
    this.loader = true;
    const obtenerpedido: Promise<number> = new Promise((resolve, reject) => {
      this.socketproduct.obtenernumeropedido().subscribe(async (datos) => {
                resolve(datos.codigo.codigo);
      });
    });

    numerofactura = await obtenerpedido;

    const pdf = await generatePDF({
      productos: this.productosMostrar,
      cliente: this.clienteSeleccionado,
      total: this.totalPagar,
      infoEmpresa: this.clienteSeleccionado,
      fecha_actual: diaActual,
      horaActual: Horaforma(horaActual),
      config: this.configuracion,
      numero: numerofactura,
      nombre: this.nombrevendedor,
      identificacion: this.identificacion,
    });
    this.pdf = pdf;
    this.socketproduct
      .enviaremail({
        idpedido: numerofactura,
        itemspedido: this.productosMostrar,
        cliente: this.clienteSeleccionado,
        pdf: this.pdf,
        fecha: this.fechahora,
      })
      .subscribe((datos) => {
        if (datos.estadoPeticion === 'Done') {
          this.deleteAll();
          this.socketproduct
            .obtenerInfo('aws', 'pazzioli-pos-3', {
              metodo: 'CONSULTAR',
              condicion: '',
              consulta: 'productos',
              sede: localStorage.getItem('sede'),
            })
            .subscribe((data) => {
              let info = JSON.parse(data);
              if (info.estadoPeticion === 'SUCCESS') {
                                this.respuestaProductos(info, true);
              }
            });
        }
      });
    /*const dialogRef = this.dialog.open(DialogFactura, {
      data: {
        productos: this.productosMostrar,
        cliente: this.clienteSeleccionado,
        total: this.totalPagar,
        infoEmpresa: this.clienteSeleccionado,
        fecha_actual: diaActual,
        horaActual: Horaforma(horaActual),
        config: this.configuracion,
        numero: numerofactura,
        vendedor: this.nombrevendedor,
        identificacion: this.identificacion,
      },

      disableClose: false,
      maxWidth: '100vw',
    });

    let elementos = document.getElementsByClassName(
      'cdk-overlay-container'
    ) as HTMLCollectionOf<HTMLElement>;
        );
    //elementos[0].style.zIndex = "0";
    dialogRef.afterClosed().subscribe(async (resultado) => {
      // PDF CONVERTIDO A BASE64

      /* const dialoref = this.dialog.open(DialogoAlerta, {
        data: {
          boton: 'Generar',
          boton1: 'cancelar',
          mensaje: 'Quisieras generar pdf ',
          tipo: 'warning',
        },
      });*/
    /*dialoref.afterClosed().subscribe(async (datos) => {
            });*/
  }
}

/*-----------------------clases_componentes_dialogs------------------------------------------------------------  */

//html2canvas me convierte cualquier pante del don a una imagen
import html2canvas from 'html2canvas';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { MatButtonModule } from '@angular/material/button';
import { Console, error } from 'console';
import { serviciodb } from 'src/services/serviciosdbs/serviciodb.service';
import { rejects } from 'assert';
import { NavigationEnd, Route, Router } from '@angular/router';
import { Pedidoguardado } from 'src/app/angular-material/pedidoguardos';
import generatePDF from './pdf/pdfpedido';
import { Horaforma } from 'src/app/utils/formatearhora';
import generatePDFtirilla from './pdf/pdftirilla';
import { generatePDFemail } from './pdf/pdf';

@Component({
  selector: 'dialog-factura',
  templateUrl: 'dialogs/dialog-factura.html',
  styles: [
    `
      .row > div > span {
        font-size: 10px;
      }
      tr {
        display: flex;
      }
      tr > th {
        flex: 1;
        display: flex;
        justify-content: center;
        font-size: 10px;
      }

      .trsuperior > :nth-child(1) {
        flex: 1;
        justify-content: start;
        margin-left: 8px;
      }
      .trsuperior > :nth-child(2) {
        flex: 2;
        justify-content: start;
        margin-left: 10px;
      }
      .tdchild {
        font-size: 8px;
      }

      ::ng-deep .mat-dialog-container {
        padding: 0 !important;
        max-height: 80vw !important; /* para limitar altura */
        overflow: auto !important; /* activa scroll cuando sea necesario */
      }

      .bodyinferior > td {
        font-size: 10px;
        flex: 1;
      }
    `,
  ],
})
export class DialogFactura {
  dataSource: any[] = [];
  clienteSeleccionado: any = {};
  total: number = 0;
  total_items: number = 0;
  showBtn: boolean = true;
  archivoBase64: any = null;
  infoEmpresa: any = {};
  horaactual!: string;
  fechaactul!: string;
  @ViewChild('tirilla') tirillaRef!: ElementRef;
  htmlRenderizado: string = '';
  constructor(
    public dialogRef: MatDialogRef<DialogFactura>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private servisocket: Socket_producto,
    private platform: Platform,
    private route: Router
  ) {
    this.dataSource = data.productos;
    this.clienteSeleccionado = data.cliente;
    this.total = data.total;
    this.infoEmpresa = data.infoEmpresa;

        /*setTimeout(() => {
      let doc = new jsPDF('p', 'px', 'letter'); // A4 TAMAÑO
      if (this.infoEmpresa.logo) {
        doc.addImage(this.infoEmpresa.logo, 'PNG', 30, 30, 60, 60);
      }

      autoTable(doc, {
        html: '#rsTb',
        startY: 30,
        margin: { top: 0, bottom: 0, left: 110 },
        theme: 'plain',
        styles: { fillColor: [255, 255, 255], fontSize: 20 },
      });

      let finalY = (doc as any).lastAutoTable.finalY;
      autoTable(doc, {
        html: '#empresaTb',
        startY: finalY + 5,
        theme: 'plain',
        margin: { top: 0, bottom: 0, left: 110 },
        styles: { fillColor: [255, 255, 255], textColor: [80, 80, 80] },
        headStyles: {
          fontSize: 10,
          lineWidth: 1,
          lineColor: [200, 200, 200],
        },
        bodyStyles: {
          fontSize: 9,
          lineWidth: 1,
          textColor: [80, 80, 80],
          lineColor: [200, 200, 200],
        },
      });

      let finalY0 = (doc as any).lastAutoTable.finalY;
      autoTable(doc, {
        html: '#clienteTb',
        startY: finalY0 + 20,
        theme: 'plain',
        styles: { fillColor: [255, 255, 255], textColor: [80, 80, 80] },
        headStyles: {
          fontSize: 10,
          lineWidth: 1,
          lineColor: [200, 200, 200],
        },
        bodyStyles: {
          fontSize: 9,
          lineWidth: 1,
          textColor: [80, 80, 80],
          lineColor: [200, 200, 200],
        },
      });

      let finalY1 = (doc as any).lastAutoTable.finalY;
      autoTable(doc, {
        html: '#productosTb',
        startY: finalY1 + 20,
        theme: 'plain',
        styles: { fillColor: [255, 255, 255], textColor: [80, 80, 80] },
        headStyles: {
          fontSize: 10,
          lineWidth: 1,
          lineColor: [200, 200, 200],
        },
        bodyStyles: {
          fontSize: 9,
          lineWidth: 1,
          textColor: [80, 80, 80],
          lineColor: [200, 200, 200],
        },
      });

      let finalY2 = (doc as any).lastAutoTable.finalY;
      autoTable(doc, {
        theme: 'plain',
        startY: finalY2 + 5,
        styles: { fillColor: [255, 255, 255], textColor: [80, 80, 80] },
        headStyles: {
          fontSize: 15,
          halign: 'left',
        },
        bodyStyles: {
          fontSize: 15,
          halign: 'left',
        },
        body: [['TOTAL']],
      });

      autoTable(doc, {
        theme: 'plain',
        startY: finalY2 + 5,
        margin: { top: 0, bottom: 0, left: 110 },
        styles: { fillColor: [255, 255, 255], textColor: [80, 80, 80] },
        headStyles: {
          fontSize: 15,
          halign: 'right',
        },
        bodyStyles: {
          fontSize: 15,
          halign: 'right',
        },
        body: [['$' + this.total.toLocaleString('de-DE')]],
      });

      //doc.save('MYPdf.pdf'); // PDF GENERADO
      this.archivoBase64 = doc.output('datauristring');
      this.dialogRef.close(this.archivoBase64);
    }, 100000);*/
    this.total = data.productos.reduce(
      (sum: any, datos: any) => sum + datos.total,
      0
    );
    this.total_items = data.productos.reduce(
      (sum: any, datos: any) => sum + datos.cantidad,
      0
    );
      }

  onNoClick(e: any): void {
    this.dialogRef.close();
  }

  ngAfterViewInit() {
    // Aquí capturas TODO el HTML del componente ya interpretado/renderizado
    /* this.htmlRenderizado = this.tirillaRef.nativeElement.outerHTML;
    console.log(this.htmlRenderizado); // Esto ya es un string con todo el contenido*/

    setTimeout(() => {
      this.dialogRef.close(null);
    }, 1000);
  }
  imprimir() {
    const contenido = this.tirillaRef.nativeElement.innerHTML;

    const ventana = window.open('', '_blank', 'width=300,height=600');
    ventana!.document.open();
    ventana!.document.write(`
        <html>
          <head>
            <style>
              body { font-family: monospace; font-size: 12px; width:58mm; padding: 10px; }
              h3, p { margin: 0; text-align: center; }
              hr { border: none; border-top: 1px dashed #000; margin: 4px 0; }

              .row > div > span {
                font-size: 10px;
              }
              @media print {
                body {
                  font-family: monospace;
                  font-size: 12px;
                }
              }
              tr {
                display: flex;
              }
              tr > th {
                flex: 1;
                display: flex;
                justify-content: center;
                font-size: 10px;
              }
        
              .trsuperior > :nth-child(1) {
                flex: 1;
                justify-content: start;
                margin-left: 8px;
              }
              .trsuperior > :nth-child(2) {
                flex: 2;
                justify-content: start;
                margin-left: 10px;
              }
              .tdchild {
                font-size: 8px;
              }
        
              ::ng-deep .mat-dialog-container {
                padding: 0 !important;
                max-height: 80vw !important; /* para limitar altura */
                overflow: auto !important; /* activa scroll cuando sea necesario */
              }
        
              .bodyinferior > td {
                font-size: 10px;
                flex: 1;
              }


            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${contenido}
          </body>
        </html>
      `);
    ventana!.document.close();
    // Espera 100ms para que el DOM termine de renderizar}
    /* generarImagenTirilla() {
    html2canvas(this.tirillaRef.nativeElement, {
      scale: 2, // mejor calidad
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png'); // aquí tienes la imagen
      // this.enviarImagenAlServidor(imgData);
    });
  }*/

    /* enviarImagenAlServidor(base64Imagen: string) {
    this.servisocket.enviarImagenAlServidor(base64Imagen);
  }*/
  }

  imprimirmovil() {}
}
