export const Horaforma = (formato: string): string => {
  //Para agregar si es AM o PM a tu función formatearfecha, puedes obtener la hora y luego determinar si está antes o después del mediodía.
  console.log(formato);
  const formaarray: string[] = formato.split(':');

  const pad = (n: number) => n.toString().padStart(2, '0');

  // Determinar AM o PM
  let ampm = +formaarray[0] >= 12 ? 'PM' : 'AM';
  // Convertir a formato 12 horas
  let horas = +formaarray[0] % 12;
  horas = horas ? horas : 12; // el 0 se convierte en 12
  let horaActual =
    pad(horas) + ':' + pad(+formaarray[1]) + ':' + pad(+formaarray[2]) + ampm;

  return horaActual;
};
