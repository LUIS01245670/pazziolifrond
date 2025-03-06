import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Subscription } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { SocketService } from 'src/services/socket/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatosAlerta, DialogoAlerta } from 'src/app/angular-material/alerta';
import { DatosPedido } from 'src/app/modelos/datos-peticion copy';


export interface DialogData {
	po: any;
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
}
@Component({
	selector: 'app-tienda',
	templateUrl: './tienda.component.html',
	styleUrls: ['./tienda.component.scss'],
})
export class TiendaComponent implements OnInit {

	sedeSeleccionada: any;
	terceroConsultado: any = null;

	@ViewChild('inCodigo') inCodigo!: ElementRef;
	@ViewChild(MatAutocompleteTrigger, { read: MatAutocompleteTrigger }) inDescripcion!: MatAutocompleteTrigger;

	@ViewChild('inCantidad') inCantidad!: ElementRef;
	@ViewChild('inPrecio') inPrecio!: ElementRef;

	clientes: any[] = [];
	clientesIniciales: any[] = [];

	productos: PRODUCTO[] = [];

	productosMostrar: PRODUCTO[] = [
		// {
		// 	cantidad: 13,
		// 	codigo: "005",
		// 	codigoContable: "00",
		// 	id: "001",
		// 	nombre: "PROD PRUEBA",
		// 	numero: 0,
		// 	precio: 5000,
		// 	referencia: "REF 000",
		// 	total: 500000,
		// 	producto: {}
		// },

		// {
		// 	cantidad: 13,
		// 	codigo: "005",
		// 	codigoContable: "00",
		// 	id: "001",
		// 	nombre: "PROD PRUEBA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0",
		// 	numero: 0,
		// 	precio: 5000,
		// 	referencia: "REF 000",
		// 	total: 500000,
		// 	producto: {}
		// },
		// {
		// 	cantidad: 13,
		// 	codigo: "005",
		// 	codigoContable: "00",
		// 	id: "001",
		// 	nombre: "PROD PRUEBA",
		// 	numero: 0,
		// 	precio: 5000,
		// 	referencia: "REF 000",
		// 	total: 500000,
		// 	producto: {}
		// },

		// {
		// 	cantidad: 13,
		// 	codigo: "005",
		// 	codigoContable: "00",
		// 	id: "001",
		// 	nombre: "PROD PRUEBA AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0",
		// 	numero: 0,
		// 	precio: 5000,
		// 	referencia: "REF 000",
		// 	total: 500000,
		// 	producto: {}
		// },
	];

	buscarDescripcion = new FormControl('');
	buscarCliente: string = ''
	opcionesFiltradas: any[] = [];
	clienteSeleccionado = {
		nombre: "Seleccione un cliente",
		identificacion: "",
		email: "",
		celulares: "",
		direccion: "",
		telefonoFijo: "",
		codigo: 0
	}

	productoActual: PRODUCTO = {
		numero: 0,
		id: '_vacio',
		nombre: 'Nombre del producto',
		codigo: '000',
		codigoContable: '000',
		referencia: '000',
		cantidad: 0,
		precio: 0,
		total: 0,
		producto: {},
	};

	cantidad: number = 0;
	precio: number = 0;
	codigo: String = "";
	referencia: String = "";
	totalPagar: number = 0;

	suscripcionSocket!: Subscription;

	loader: boolean = false;

	pdf: any;
	enterPrecio: any = 0;
	constructor(
		private _snackBar: MatSnackBar,
		private socketServices: SocketService,
		private app: AppComponent,
		public dialog: MatDialog
	) { }

	ngOnInit(): void {
		this.loader = true;
		this.opcionesFiltradas = this.productos;
		this.openDialogSedes();
	}

	buscarProductos(key: any, campo: String) {
		if (this.productos.length > 0) {
			let val = '';
			if (this.buscarDescripcion.value) {
				val = this.buscarDescripcion.value.toString().toLowerCase();
			}
			this.opcionesFiltradas = [];
			this.productos.forEach((_prod) => {
				if (_prod.nombre.toString().toLowerCase().includes(val)) {
					this.opcionesFiltradas.push(_prod);
				}
			});
			if (key.keyCode == 13) {
				this.elegirCantidad(this.buscarDescripcion.value)
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
		this.productoActual = {
			numero: 0,
			id: '_vacio',
			nombre: 'Nombre del producto',
			codigo: '000',
			codigoContable: '000',
			referencia: '000',
			cantidad: 0,
			precio: 0,
			total: 0,
			producto: {},
		};
		this.codigo = "";
		this.referencia = "";
		this.cantidad = 0;
		this.precio = 0;
		this.buscarDescripcion.patchValue('');
		document.getElementById('descripcion')?.focus();
		this.enumerarProductos();
	}

	enumerarProductos() {
		this.productosMostrar.forEach((__prod, index) => {
			__prod.numero = index + 1
		});
	}

	elegirCantidad(_prod: any) {

		if (typeof _prod == 'object') {
			if (this.buscarDescripcion.value) {
				this.productoActual = { numero: null, ..._prod };
				this.precio = this.productoActual.precio;
				document.getElementById('p_actual')?.classList.add('active');
				this.cantidad = 1;
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

	confirmDeleteAll() {
		const data: DatosAlerta = {
			titulo: 'ATENCIÓN',
			mensaje: '¿Desea reiniciar la venta?',
			boton: "SI",
			tipo: "question",
			boton1: "NO",
			input: false,
		}
		const dialogRef = this.dialog.open(DialogoAlerta, {
			data: data,
			disableClose: true
		});
		dialogRef.afterClosed().subscribe(resultado => {
			console.log(resultado);
			if (resultado == true) {
				this.deleteAll()
			}
			this.loader = false;
		});
	}

	deleteAll() {
		this.productosMostrar = [];
		this.totalPagar = 0;
		this.productosMostrar.forEach(producto => {
			this.totalPagar += producto.total;
		});
		this.clienteSeleccionado = {
			nombre: "Seleccione un cliente",
			identificacion: "",
			email: "",
			celulares: "",
			direccion: "",
			telefonoFijo: "",
			codigo: 0
		}
		this.reiniciar();
	}

	async elegirPrecio(event: any) {
		await this.calcularProductoActual();
		if (event.keyCode == 13) {
			document.getElementById('precio')?.focus();
		}
	}

	async agregarProducto() {

		if (Number(this.cantidad) > 0) {
			this.productos = [];
			this.opcionesFiltradas = [];
			await this.calcularProductoActual();
			this.productoActual.precio = Number(this.precio);
			this.productoActual.cantidad = Number(this.cantidad);
			let index = this.productosMostrar.findIndex((item) => {
				return item.id == this.productoActual.id;
			});
			if (index != -1) {
				let _cantidad = this.productosMostrar[index].cantidad + this.cantidad;
				let _precio_total = Number(_cantidad) * Number(this.precio);

				this.productosMostrar[index].cantidad = _cantidad;
				this.productosMostrar[index].precio = this.precio;
				this.productosMostrar[index].total = _precio_total;
			} else {
				this.productosMostrar.push(this.productoActual);
			}
			this.totalPagar = 0;
			this.productosMostrar.forEach(producto => {
				this.totalPagar += producto.total;
			});
			this.reiniciar();
		} else {
			if (this.enterPrecio % 2 == 0) {
				const data: DatosAlerta = {
					titulo: 'ERROR',
					mensaje: 'La cantidad del producto no puede ser menor o igual a cero.',
					boton: "OK",
					tipo: "error",
					input: false
				}
				this.openDialogAlerta(data);
				this.enterPrecio += 1;
			} else {
				this.enterPrecio += 1;
			}
		}
	}

	eliminarProducto(id: string) {
		document.getElementById('p_' + id)?.classList.add('deleted');
		setTimeout(() => {
			let filteredItems = this.productosMostrar.filter(function (item) {
				return item.id != id;
			});
			this.productosMostrar = filteredItems;
			this.totalPagar = 0;
			this.productosMostrar.forEach(producto => {
				this.totalPagar += producto.total;
			});
			this.enumerarProductos();
		}, 400);
	}

	calcularProductoActual() {
		let _precio_total = Number(this.cantidad) * Number(this.precio);
		this.productoActual.total = _precio_total;
	}

	async eventoEnter(e: any, input: String) {
		await this.calcularProductoActual()
		if (e.keyCode == 13) {
			switch (input) {
				case "codigo":
					this.buscarProducto(this.codigo, 'CODIGO-EQUAL')
					break;
				case "referencia":
					this.buscarProducto(this.referencia, 'CODIGO-EQUAL')
					break;
				case "descripcion":
					this.buscarProducto(this.buscarDescripcion.value, 'DESCRIPCION')
					break;
				case "cantidad":
					this.inPrecio.nativeElement.focus();
					break;
				case "precio":
					if (this.productoActual.id != '_vacio') {
						this.agregarProducto();
					} else {
						const data: DatosAlerta = {
							titulo: 'ERROR',
							mensaje: 'Por favor ingrese un producto valido',
							boton: "OK",
							tipo: "error",
							input: false
						}
						this.openDialogAlerta(data);
					}
					break;
				default:
					break;
			}
		}
	}

	seleccionarCliente(cliente: any) {
		this.clienteSeleccionado.nombre = cliente.razonSocial;
		this.clienteSeleccionado.identificacion = cliente.identificacion;
		this.clienteSeleccionado.email = cliente.email;
		this.clienteSeleccionado.celulares = cliente.celulares;
		this.clienteSeleccionado.direccion = cliente.direccion;
		this.clienteSeleccionado.telefonoFijo = cliente.telefonoFijo;
		this.clienteSeleccionado.codigo = cliente.codigo;
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
			console.log(error);
		} finally {
			setTimeout(() => {
				if (tipo != 'DESCRIPCION') {
					this.elegirCantidad(null);
				}
			}, 1000);
		}
	}

	respuestaProductos(info: any, estado: Boolean) {
		if (estado) {
			this.productos = info.mensajePeticion.map((producto: any) => {
				let totalCantidad = producto.cantidad + producto.cantidad2 + producto.cantidad3 + producto.cantidad4 + producto.cantidad5 + producto.cantidad6;
				return <PRODUCTO>{
					id: producto.codigo,
					nombre: producto.descripcion,
					codigo: producto.codigo,
					codigoContable: producto.codigoContable,
					referencia: producto.referencia,
					cantidad: totalCantidad,
					precio: producto.precio1,
					total: 0,
					producto: producto,
				}
			});
			this.inDescripcion.openPanel();
			this.opcionesFiltradas = this.productos
		} else {
			const data: DatosAlerta = {
				titulo: 'ERROR',
				mensaje: 'No se encontraron productos',
				boton: "OK",
				tipo: "error",
				input: false
			}
			this.openDialogAlerta(data);
			this.loader = false;
		}
		this.loader = false;
	}

	openSnackBar(message: string) {
		this._snackBar.open(message, "OK", {
			duration: 2000,
		});
	}

	buscarClientes() {
		this.clientes = [];
		this.clientesIniciales.forEach(cliente => {
			if (cliente.razonSocial.toLowerCase().includes(this.buscarCliente.toLowerCase()) || cliente.identificacion.toLowerCase().includes(this.buscarCliente.toLowerCase())) {
				this.clientes.push(cliente)
			}
		});
	}

	crearPedido() {
		console.log(this.clienteSeleccionado.codigo);
		if (this.productosMostrar.length <= 0) {
			const data: DatosAlerta = {
				titulo: 'ERROR',
				mensaje: 'Primero debe ingresar un producto.',
				boton: "OK",
				tipo: "error",
				input: false
			}
			this.openDialogAlerta(data);
			return;
		}
		else if (this.clienteSeleccionado.codigo <= 0) {
			const data: DatosAlerta = {
				titulo: 'ERROR',
				mensaje: 'Seleccione un cliente primero.',
				boton: "OK",
				tipo: "error",
				input: false
			}
			this.openDialogAlerta(data);
			return;
		}
		else if (this.clienteSeleccionado.email == "") {
			const data: DatosAlerta = {
				titulo: 'VERIFICAR',
				mensaje: 'Ingrese un correo para enviar el pedido al cliente.',
				boton: "ENVIAR",
				boton1: "CANCELAR",
				tipo: "info",
				input: true,
				inputIcon: 'alternate_email',
				inputText: 'Correo',
				type: 'email'
			}
			this.openDialogAlerta(data);
			return;
		} else {
			this.openDialogFactura();
		}
	}

	enviarPedido() {
		try {
			this.loader = true;
			let fechaActual = this.obtenerFechaHora();
			let itemsPedidos = this.productosMostrar.map((producto) => {
				return {
					codigoProducto: producto.codigo,
					valor: producto.precio,
					cantidad: producto.cantidad,
					codigoUsuario: this.sedeSeleccionada.usuario.codigo
				}
			})
			let pedido = new DatosPedido(
				this.clienteSeleccionado.codigo,
				fechaActual.diaActual,
				fechaActual.horaActual,
				this.sedeSeleccionada.usuario.codigo,
				this.totalPagar
			)
			this.socketServices.crearPedido(
				this.sedeSeleccionada.po.canalsocket,
				this.sedeSeleccionada.usuario.usuario,
				{
					pedido: pedido.datos,
					itemsPedido: itemsPedidos,
					cliente: this.clienteSeleccionado,
					pdf: this.pdf,
					modificaInventario: this.sedeSeleccionada.po.empresa_email_pos[0].empresa_email_config.modificaInventario
					//aqui iria la variable de modificacion de inventario
				}
			)
		} catch (error) {
			console.log(error);
			let elementos = document.getElementsByClassName('cdk-overlay-container') as HTMLCollectionOf<HTMLElement>;
			elementos[0].style.zIndex = "1000";
			const data: DatosAlerta = {
				titulo: 'ERROR',
				mensaje: 'Error al intentar crear pedido',
				boton: "OK",
				boton1: "CANCELAR",
				tipo: "error",
				input: false
			}
			this.openDialogAlerta(data);
		}
	}

	respuestaPedidos(info: any) {
		let elementos = document.getElementsByClassName('cdk-overlay-container') as HTMLCollectionOf<HTMLElement>;
		elementos[0].style.zIndex = "1000";
		if (info.estadoPeticion === 'SUCCESS' && info.tipoConsulta === 'PEDIDO') {
			this.deleteAll();
			const data: DatosAlerta = {
				titulo: 'CORRECTO',
				mensaje: 'Pedido creado exitosamente',
				boton: "OK",
				tipo: "done",
				input: false
			}
			this.openDialogAlerta(data);
		}
	}

	obtenerFechaHora() {
		let fechaActual = new Date();
		let diaActual = fechaActual.getFullYear() + '-' + (fechaActual.getMonth() + 1) + '-' + fechaActual.getDate();
		let horaActual = fechaActual.getHours() + ':' + fechaActual.getMinutes() + ':' + fechaActual.getSeconds();
		return { diaActual, horaActual }
	}

	openDialogSedes() {
		const dialogRef = this.dialog.open(DialogSedes, {
			data: this.app.sedes,
			disableClose: true
		});

		dialogRef.afterClosed().subscribe(result => {
			this.sedeSeleccionada = result;
			console.log(this.sedeSeleccionada);
			this.socketServices.escucha = this.socketServices.obtenerInfo(this.sedeSeleccionada.usuario.usuario);
			this.socketServices.consultarTercero(this.sedeSeleccionada.po.canalsocket, '', '', this.sedeSeleccionada.usuario.usuario);
			this.socketServices.escucha.subscribe(
				(info: any) => {
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
				}
			);
		});
	}

	respuestaTerceros(info: any) {
		this.clientes = info.mensajePeticion;
		this.clientesIniciales = info.mensajePeticion;
		this.loader = false;
	}

	openDialogAlerta(data: any) {
		const dialogRef = this.dialog.open(DialogoAlerta, {
			data: data,
			disableClose: true
		});
		console.log(data.tipo);
		
		dialogRef.afterClosed().subscribe(resultado => {
				console.log(resultado);
				if (resultado!= false && data.tipo=='info') {
				this.clienteSeleccionado.email = resultado==true?null:resultado;
				this.openDialogFactura();
				console.log(resultado);
			}
			this.loader = false;
		});
	}

	openDialogFactura() {
		this.loader = true;
		let elementos = document.getElementsByClassName('cdk-overlay-container') as HTMLCollectionOf<HTMLElement>;
		elementos[0].style.zIndex = "0";
		const dialogRef = this.dialog.open(DialogFactura, {
			data: {
				productos: this.productosMostrar,
				cliente: this.clienteSeleccionado,
				total: this.totalPagar,
				infoEmpresa: this.sedeSeleccionada.po.empresa_email_pos[0].empresa_email_config
			},
			disableClose: true,
			maxWidth: '100vw'
		});

		dialogRef.afterClosed().subscribe(resultado => {
			// PDF CONVERTIDO A BASE64
			this.pdf = resultado;
			this.enviarPedido();
			this.loader = false;
			this.deleteAll();
		});
	}
}

@Component({
	selector: 'dialog-sedes',
	templateUrl: 'dialogs/dialog-sedes.html',
})
export class DialogSedes {
	selectSedes: FormControl;

	constructor(public dialogRef: MatDialogRef<DialogSedes>, @Inject(MAT_DIALOG_DATA) public data: Array<DialogData>) {
		this.selectSedes = new FormControl('', [
			Validators.required
		]);
	}
	onNoClick(e: any): void {
		if (e.keyCode == 13 && this.selectSedes.valid) {
			this.dialogRef.close(this.selectSedes.value);
		}
	}
}

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'

@Component({
	selector: 'dialog-factura',
	templateUrl: 'dialogs/dialog-factura.html',
})

export class DialogFactura {

	dataSource: any[] = [];
	clienteSeleccionado: any = {};
	total: number = 0;
	showBtn: boolean = true;
	archivoBase64: any = null
	infoEmpresa: any = {}

	constructor(public dialogRef: MatDialogRef<DialogFactura>, @Inject(MAT_DIALOG_DATA) public data: any) {

		this.dataSource = data.productos;
		this.clienteSeleccionado = data.cliente;
		this.total = data.total;
		this.infoEmpresa = data.infoEmpresa;

		setTimeout(() => {

			let doc = new jsPDF('p', 'px', 'letter'); // A4 TAMAÑO
			if (this.infoEmpresa.logo) {
				doc.addImage(this.infoEmpresa.logo, 'PNG', 30, 30, 60, 60)
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
					lineColor: [200, 200, 200]
				},
				bodyStyles: {
					fontSize: 9,
					lineWidth: 1,
					textColor: [80, 80, 80],
					lineColor: [200, 200, 200]
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
					lineColor: [200, 200, 200]
				},
				bodyStyles: {
					fontSize: 9,
					lineWidth: 1,
					textColor: [80, 80, 80],
					lineColor: [200, 200, 200]
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
					lineColor: [200, 200, 200]
				},
				bodyStyles: {
					fontSize: 9,
					lineWidth: 1,
					textColor: [80, 80, 80],
					lineColor: [200, 200, 200]
				},
			})

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
				body: [
					['TOTAL'],
				]
			})


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
				body: [
					['$' + this.total.toLocaleString("de-DE")],
				]
			})

			//doc.save('MYPdf.pdf'); // PDF GENERADO
			this.archivoBase64 = doc.output('datauristring');
			this.dialogRef.close(this.archivoBase64);
		}, 50);
	}

	onNoClick(e: any): void {
		this.dialogRef.close();
	}
}