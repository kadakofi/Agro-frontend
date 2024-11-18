import * as React from 'react';
import axios from '../axiosConfig';
import MessageSnackBar from '../MessageSnackBar';
import FormProductoPresentacion from '../producto_presentacion/FormProductoPresentacion';
import GridProductoPresentacion from '../producto_presentacion/GridProductoPresentacion';
import { SiteProps } from '../dashboard/SiteProps';

export default function ProductoPresentacion() {
  const row = {
    id: 0,
    nombre: "",
    PresentacionCategoriaId: 0,
    descripcion: "",
    estado: 0,
  };

  const [selectedRow, setSelectedRow] = React.useState(row);
  const messageData = {
    open: false,
    severity: "success",
    text: "",
  };

  const [message, setMessage] = React.useState(messageData);
  const [Presentacion, setPresentacion] = React.useState([]);

  // Función para recargar los datos
  const reloadData = () => {
    axios.get(`${SiteProps.urlbasev1}/producto-presentaciones`)
      .then((response) => {
        // Verificar si la respuesta tiene una propiedad 'data' que contiene un array
        if (response.data && Array.isArray(response.data.data)) {
          setPresentacion(response.data.data); // Ajustar para acceder al array de Presentacion dentro de 'data'
        } else if (Array.isArray(response.data)) {
          setPresentacion(response.data); // Si la respuesta ya es un array directamente
        } else {
          console.error('La respuesta no es un array:', response.data);
          setMessage({
            open: true,
            severity: 'error',
            text: 'Error al cargar Presentacion: respuesta no válida'
          });
        }
      })
      .catch((error) => {
        console.error('Error al cargar Presentacion:', error);
        setMessage({
          open: true,
          severity: 'error',
          text: 'Error al cargar Presentacion'
        });
      });
  };  
  React.useEffect(() => {
    reloadData();  // Llama al cargar el componente
  }, []);
  
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MessageSnackBar message={message} setMessage={setMessage} />
      <FormProductoPresentacion
        setMessage={setMessage}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}  // Pasa reloadData como prop a FormProductoPresentacion
        Presentacion={Presentacion}
      />
      <GridProductoPresentacion
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        Presentacion={Presentacion}
      />
    </div>
  );
}
