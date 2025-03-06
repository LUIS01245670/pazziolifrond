export class DatosPeticion {
    datos:any={
      sistema: 'DASHBOARD',
      tipoConsulta: 'POS',
      canalPos: String,
      canalUsuario: String,
      metodo: 'CONSULTAR',
      consulta: String,
      condicion: String,
      datoCondicion: String
    }
  
    constructor(canalPos: String,consulta: String,condicion: String,datoCondicion: String,canalUsuario:String){
      this.datos.canalPos = canalPos;
      this.datos.canalUsuario = canalUsuario;
      this.datos.consulta = consulta;
      this.datos.condicion = condicion;
      this.datos.datoCondicion = datoCondicion;
    }
  }