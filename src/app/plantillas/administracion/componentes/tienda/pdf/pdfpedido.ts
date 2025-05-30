import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

//import { variable64 } from '../../assets/img';
//Esta línea asigna las fuentes cargadas a la instancia de pdfMake, necesario para que funcione correctamente.
(pdfMake as any).vfs = pdfFonts;

const generatePDF = async (data: any) => {
  const nuevaVentana = window.open('', '_blank');
  if (!nuevaVentana) {
    alert('El navegador bloqueó la ventana emergente. Permite pop-ups.');
    return null;
  }
  //Se crea el contenido de la tabla, con:
  //Una fila de encabezado (títulos).
  //Una fila por cada producto en el array recibido.

  const tableBody = [
    [
      { text: 'Codigo', style: 'tableHeader' },
      { text: 'Descripción', style: 'tableHeader' },
      { text: 'Referencia', style: 'tableHeader' },
      { text: 'Presentación', style: 'tableHeader' },
      { text: 'Cant.', style: 'tableHeader' },
      { text: 'Precio', style: 'tableHeader' },
      { text: 'Total', style: 'tableHeader' },
    ],
    ...data?.productos.map((product: any) => [
      product.codigo,
      product.nombre,
      product.referencia,
      `${product.presentacion === undefined ? '' : product.presentacion}`,
      product.cantidad.toString(),
      ` $${product.precio.toLocaleString('de-DE')}`,
      `$${(product.cantidad * product.precio).toLocaleString('de-DE')}`,
    ]),
  ];
  //Se calcula la suma total de todos los productos usando reduce.

  const totalGeneral = data.productos.reduce(
    (sum: any, product: any) => sum + product.cantidad * product.precio,
    0
  );
  //Aquí se va construyendo todo el contenido que aparecerá en el PDF, paso a paso:
  const content: any[] = [];
  //Aquí se va construyendo todo el contenido que aparecerá en el PDF, paso a paso:
  //Se muestra una imagen a la izquierda (el logo) y el recibo con fecha a la derecha.
  content.push({
    stack: [
      { text: `${data.config.RAZON_SOCIAL}`, style: 'header' },
      {
        text: `${data.config.NIT}`,
        style: 'subheader',
      },
    ],
    alignment: 'center',
  });

  content.push({
    //Usa columns para alinear dos bloques en paralelo (uno a la izquierda, otro a la derecha).
    //Asigna width: '*' a ambos para que se repartan el espacio.
    //Cada stack tiene su propio alignment para alinearse correctamente.
    columns: [
      {
        stack: [
          { text: `Cliente: ${data.cliente.nombre}`, style: 'header' },
          {
            text: `Identificación: ${data.cliente.identificacion}`,
            style: 'subheader',
          },
          {
            text: `Email: ${data.cliente.email}`,
            style: 'subheader',
          },
          {
            text: `Telefono: ${data.cliente.telefonoFijo}`,
            style: 'subheader',
          },
        ],
        alignment: 'left',
        width: '*',
      },
      {
        stack: [
          { text: `Pedido No. ${data.numero}`, style: 'header' },
          {
            text: `Fecha de creacion: ${data.fecha_actual}`,
            style: 'subheader',
          },
          {
            text: `Hora de creacion: ${data.horaActual}`,
            style: 'subheader',
          },
          {
            text: `Vendedor: ${data.nombre}`,
            style: 'subheader',
          },
        ],
        alignment: 'right',
        width: '*',
      },
    ],
  });

  content.push({ text: '\n' });
  //Muestra la tabla de productos con sus cantidades y totales.
  //layout: 'lightHorizontalLines' agrega líneas horizontales ligeras para separar filas.
  content.push({
    table: {
      headerRows: 1,
      widths: [40, 90, 60, 60, 20, 80, 80],
      body: tableBody,
    },
    layout: 'lightHorizontalLines',
    margin: [0, 10, 0, 10],
  });
  //Muestra el total de la compra alineado a la derecha.

  content.push({
    columns: [
      { text: '', width: '*' },
      {
        text: `Total: $ ${totalGeneral.toLocaleString('de-DE')}`,
        style: 'total',
        alignment: 'right',
        margin: [0, 10, 0, 10],
      },
    ],
  });
  //Define estilos reutilizables usados en el contenido: encabezados, subencabezados, etc.
  const styles = {
    header: {
      fontSize: 14,
      bold: true,
    },
    subheader: {
      fontSize: 12,
      margin: [0, 5, 0, 5],
    },
    tableHeader: {
      bold: true,
      fontSize: 12,
      color: 'black',
    },
    total: {
      fontSize: 12,
      bold: true,
    },
  };
  //docDefinition es el objeto completo que define el PDF a generar.

  const docDefinition: any = {
    content,
    styles,
  };
  //Genera el PDF y lo abre en una nueva pestaña del navegador.

  // ✅ 3. Genera el PDF y escribe el contenido en la ventana ya abierta
  pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    nuevaVentana.location.href = url;
  });
  function getPdfBase64(docDefinition: any): Promise<string> {
    return new Promise((resolve) => {
      pdfMake.createPdf(docDefinition).getBase64((base64: string) => {
        resolve(base64);
      });
    });
  }
  return await getPdfBase64(docDefinition);
};

export default generatePDF;
