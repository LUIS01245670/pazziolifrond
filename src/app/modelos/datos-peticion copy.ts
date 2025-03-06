export class DatosPedido {
    datos:any={
      codigoVendedor:0,
      codigoTercero: Number,
      fechaCreacion: String,
      horaCreacion: String,
      codigoFactura:0,
      codigoUsuarioAnulo:0,
      fechaAnulo:null,
      estado:'PENDIENTE',
      ubicacion:'WEB',
      codigoUsuario:Number,
      descuento:0,
      totalPedido:Number,
      tipoFactura:'POS',
      observacion:'PRUEBA'
    }
  
    constructor(codigoTercero: Number,fechaCreacion: String,horaCreacion: String,codigoUsuario: Number,totalPedido:Number){
      this.datos.codigoTercero = codigoTercero;
      this.datos.fechaCreacion = fechaCreacion;
      this.datos.horaCreacion = horaCreacion;
      this.datos.codigoUsuario = codigoUsuario;
      this.datos.totalPedido = totalPedido;
    }
  }