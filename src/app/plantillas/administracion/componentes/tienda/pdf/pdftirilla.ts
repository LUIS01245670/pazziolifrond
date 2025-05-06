import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

//import { variable64 } from '../../assets/img';
//Esta línea asigna las fuentes cargadas a la instancia de pdfMake, necesario para que funcione correctamente.
console.log(pdfFonts);
(pdfMake as any).vfs = pdfFonts;

const generatePDFtirilla = async (data: any, nuevaVentana: any) => {
  console.log(data);
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
      `$${product.total.toLocaleString('de-DE')}`,
    ]),
  ];
  //Se calcula la suma total de todos los productos usando reduce.

  const totalGeneral = data.productos.reduce(
    (sum: any, product: any) => sum + product.total,
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
    stack: [{ text: `_________________________________`, style: 'header' }],
    alignment: 'left',
    width: '*',
  });
  content.push({ text: '\n' });

  content.push({
    //Usa columns para alinear dos bloques en paralelo (uno a la izquierda, otro a la derecha).
    //Asigna width: '*' a ambos para que se repartan el espacio.
    //Cada stack tiene su propio alignment para alinearse correctamente.

    stack: [
      {
        text: `Fecha: ${data.fecha_actual}  ${data.horaActual}`,
        style: 'subheader',
      },
      {
        text: `nombre: ${data.cliente.nombre}`,
        style: 'subheader',
      },
      {
        text: `Identificación: ${data.cliente.identificacion}`,
        style: 'subheader',
      },
      {
        text: `direccion: ${data.cliente.direccion}`,
        style: 'subheader',
      },

      {
        text: `telefonofijo: ${data.cliente.telefonoFijo}`,
        style: 'subheader',
      },
      {
        text: `Vendedor: ${data.vendedor}`,
        style: 'subheader',
      },
    ],
    alignment: 'left',
    width: '*',
  });
  content.push({ text: '\n' });
  content.push({
    stack: [{ text: `________________________________`, style: 'header' }],
    alignment: 'left',
    width: '*',
  });
  content.push({ text: '\n' });
  content.push({
    stack: [
      { text: `ref        descripción`, style: 'header' },
      { text: `cantidad   valor/uni   iva   total`, style: 'header' },
    ],
    alignment: 'left',
    width: '*',
  });

  content.push({ text: '\n' });
  content.push({
    stack: [{ text: `________________________________`, style: 'header' }],
    alignment: 'left',
    width: '*',
  });
  content.push({ text: '\n' });
  content.push({
    stack: [
      ...data?.productos.map((product: any) => {
        return {
          text: `${product.referencia}    ${product.nombre}\n  ${
            product.cantidad
          }    x     ${product.precio.toLocaleString('de-DE')}     ${
            product.tasaiva
          }%    ${product.total.toLocaleString('de-DE')}`,
          margin: [10, 0, 0, 0], // espacio entre productos
          style: 'header',
        };
      }),
    ],
    alignment: 'left',
    width: '*',
  });

  content.push({ text: '\n' });
  content.push({
    stack: [{ text: `________________________________`, style: 'header' }],
    alignment: 'left',
    width: '*',
  });
  content.push({ text: '\n' });

  content.push({
    stack: [{ text: `Total venta:${totalGeneral}`, style: 'header' }],
    alignment: 'right',
    width: '*',
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
    //para ajustar el ancho de la tirilla
    //pdfMake usa puntos:
    //1 pulgada = 72 puntos
    //1 mm ≈ 2.83 puntos
    //Si quieres un ancho típico de tirilla:
    //Para 80mm ➔ 80 * 2.83 ≈ 226 puntos
    pageSize: {
      width: 227, // 200 puntos ≈ 72 puntos = 1 pulgada  ➔ 200 puntos ≈ 70mm
      height: 'auto', // La altura se ajusta automáticamente según el contenido (tirilla larga)
    },
    pageMargins: [10, 10, 10, 10], // Márgenes pequeños para maximizar espacio
    content,
    styles,
  };
  //Genera el PDF y lo abre en una nueva pestaña del navegador.
  pdfMake.createPdf(docDefinition).getBlob((blob: Blob) => {
    const url = URL.createObjectURL(blob); // Crea un URL temporal para el PDF que generaste con pdfMake.
    //nuevaVentana = window.open('', '_blank');
    if (nuevaVentana) {
      const esMovil =
        /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
          navigator.userAgent
        );
      if (esMovil) {
        nuevaVentana.document.write(`
    <html>
      <head>
        <title>Visualizador PDF</title>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.min.js"></script>
        <style>
        @media print {
          #printBtn {
            visibility: hidden;
          }
        }
      </style>

      </head>
      <body style="margin:0; padding:0; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif;">
       
        <canvas id="pdfCanvas" style="width:100%; max-width:600px; display:none;"></canvas>
        <button id="printBtn"
          style="
            margin-top:20px;
            padding:10px 20px;
            font-size:16px;
            background:#007bff;
            color:#fff;
            border:none;
            border-radius:5px;
            box-shadow:0 2px 5px rgba(0,0,0,0.3);
            cursor:pointer;
            display:none;
          ">
          Imprimir
        </button>
       <script>

       window.addEventListener('load', () => {
        const canvas = document.getElementById('pdfCanvas');
        const context = canvas.getContext('2d');
        const printBtn = document.getElementById('printBtn');
        const loadingText = document.getElementById('loadingText');
        const bod = document.body;
        // Cargar PDF con pdf.js
        //Usa pdf.js para cargar el PDF (desde el URL temporal)
        //Y luego toma la página 1 para dibujarla.
         pdfjsLib.getDocument('${url}').promise.then((pdf) => {
          // Carga la primera página
          pdf.getPage(1).then((page) => {
            //Dibuja la página en el <canvas>
            const scale = 1.5;
            // Le dice a pdf.js: "Quiero ver la página 1 del PDF con un zoom //de 1.5x"
            //viewport contiene el tamaño real (ancho y alto) que tendrá la página cuando se dibuje.
            const viewport = page.getViewport({ scale });
            //Ajusta el tamaño del lienzo (<canvas>) para que coincida exactamente con el tamaño del PDF.
            //Si el PDF mide 900x1200 ➔ el canvas se ajusta a 900x1200.
            // Esto es importante, porque si el canvas es más pequeño o más grande, la imagen del PDF saldría borrosa o cortada.
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            //Aquí es donde pdf.js "dibuja" la página del PDF dentro del canvas.
            //canvasContext: el pincel que dibuja.
  
            // viewport: el tamaño y zoom que debe tener
            page.render({ canvasContext: context, viewport }).promise.then(() => {
              // ✅ Mostrar canvas y botón
              canvas.style.display = 'block';
              printBtn.style.display = 'block';
              loadingText.style.display = 'none';
              bod.style.display='block'
            });
          });
        });
  
        // Botón imprimir
        printBtn.addEventListener('click', () => {
          window.print();
        }); 
      });
       </script>
       
       
      </body>
    </html>
  `);
        nuevaVentana.document.close();
        // ✅ 3. Genera el PDF y escribe el contenido en la ventana ya abierta

        //Genera tu PDF con pdfMake, lo muestra dentro de un <canvas> en la nueva ventana usando pdf.js (en vez de abrir el PDF como archivo).
        //Y además, agrega un botón de Imprimir.

        //Un <canvas> donde se dibujará el PDF.
        //que es un canvas Es un área en la página web donde puedes dibujar cosas: imágenes, gráficos, o en este caso... un PDF.

        // 1️⃣ Escribe contenido inicial INMEDIATO
      } else {
        // ✅ Si es escritorio ➔ usa iframe (más estable)
        nuevaVentana.document.write(`
            <html>
              <head><title>Visualizador PDF</title></head>
              <body style="margin:0">
                <iframe src="${url}" type="application/pdf" width="100%" height="100%" style="border:none;"></iframe>
              </body>
            </html>
          `);
        nuevaVentana.document.close();
      }
    } else {
      alert('El navegador bloqueó la ventana emergente. Permite pop-ups.');
    }
  });
};

export default generatePDFtirilla;
