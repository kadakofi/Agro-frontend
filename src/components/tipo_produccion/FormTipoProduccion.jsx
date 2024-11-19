import * as React from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import StackButtons from "../StackButtons";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * El componente Formtipoproducciones gestiona el formulario para crear, actualizar y eliminar tipoproducciones.
 * 
 * @componente
 * @param {object} props - Propiedades pasadas al componente.
 * @param {function} props.setSelectedRow - Función para establecer la fila seleccionada.
 * @param {object} props.selectedRow - Datos de la tipoproducciones seleccionada.
 * @param {function} props.reloadData - Función para recargar los datos después de una operación.
 * @param {function} props.setMessage - Función para establecer un mensaje en el snackbar.
 * @returns {JSX.Element} El formulario de gestión de tipoproducciones.
 */
export default function FormTipoProduccion(props) {
  const [open, setOpen] = React.useState(false);
  const [methodName, setMethodName] = React.useState("");
  
  /**
   * Crea una nueva TipoProduccion y abre el diálogo de formulario.
   */
  const create = () => {
    const row = {
      id: 0,
      nombre: "",
      descripcion: "",
      estado: 0,
    };
    props.setSelectedRow(row);
    setMethodName("Add");
    setOpen(true);
    console.log("create() " + JSON.stringify(row));
  };

  /**
   * Actualiza la TipoProduccionseleccionada y abre el diálogo de formulario.
   */
  const update = () => {
    if (!props.selectedRow || props.selectedRow.id === 0) {
      const messageData = {
        open: true,
        severity: "error",
        text: "Select row!",
      };
      props.setMessage(messageData);
      return;
    }
    setMethodName("Update");
    setOpen(true);
    console.log("update() " + JSON.stringify(props.selectedRow));
  };

  /**
   * Elimina la TipoProduccion seleccionada.
   */
  const deleteRow = () => {
    if (props.selectedRow.id === 0) {
      const messageData = {
        open: true,
        severity: "error",
        text: "Select row!",
      };
      props.setMessage(messageData);
      return;
    }
    const id = props.selectedRow.id;
    const url = `${SiteProps.urlbase}/tipoproducciones/${id}`;
    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        props.setMessage({
          open: true,
          severity: "success",
          text: "TipoProduccion eliminada con éxito!",
        });
        props.reloadData();
      })
      .catch((error) => {
        const errorMessage = error.response
          ? error.response.data.message
          : error.message;
        props.setMessage({
          open: true,
          severity: "error",
          text: `Error al eliminar TipoProduccion! ${errorMessage}`,
        });
        console.error(
          "Error al eliminar TipoProduccion!",
          error.response || error.message
        );
      });
  };
  const methods = {
    create,
    update,
    deleteRow,
  };
  React.useEffect(() => {
    if (props.selectedRow !== undefined) {
      console.log("Selected Row ID: " + props.selectedRow.id);
    }
  }, [props.selectedRow]);
  const handleClose = () => {
    setOpen(false);
  };

   /**
   * Maneja el envío del formulario para crear o actualizar una TipoProduccion.
   * 
   * @param {Event} event - El evento de envío del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const id = props.selectedRow?.id || 0;
    const validatePayload = (data) => {
      if (
        !data.nombre ||
        !data.tipoIdentificacionId ||
        !data.identificacion ||
        !data.direccion
      ) {
        console.error("Invalid data:", data);
        props.setMessage({
          open: true,
          severity: "error",
          text: "Invalid data!",
        });
        return false;
      }
      return true;
    };
    if (!validatePayload(formJson)) return;
    const url = `${SiteProps.urlbasev1}/tipoproducciones`;
    if (methodName === "Add") {
      axios
        .post(url, formJson)
        .then((response) => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "TipoProduccion creada con éxito!",
          });
          setOpen(false);
          props.reloadData();
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message
            : error.message;
          props.setMessage({
            open: true,
            severity: "error",
            text: `Error al crear TipoProduccion! ${errorMessage}`,
          });
        });
    } else if (methodName === "Update") {
      axios
        .put(`${url}/${id}`, formJson)
        .then((response) => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "TipoProduccion actualizada con éxito!",
          });
          setOpen(false);
          props.reloadData();
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message
            : error.message;
          props.setMessage({
            open: true,
            severity: "error",
            text: `Error al actualizar TipoProduccion! ${errorMessage}`,
          });
          console.error(
            "Error al actualizar TipoProduccion!",
            error.response || error.message
          );
        });
    } else if (methodName === "Delete") {
      axios
        .delete(`${url}/${id}`)
        .then((response) => {
          props.setMessage({
            open: true,
            severity: "success",
            text: "TipoProduccion eliminada con éxito!",
          });
          setOpen(false);
          props.reloadData();
        })
        .catch((error) => {
          const errorMessage = error.response
            ? error.response.data.message
            : error.message;
          props.setMessage({
            open: true,
            severity: "error",
            text: `Error al eliminarTipoProduccion! ${errorMessage}`,
          });
          console.error(
            "Error al eliminar TipoProduccion!",
            error.response || error.message
          );
        });
    }
    handleClose();
  };

  //hacer el post de la TipoProduccion
  return (
    <React.Fragment>
      <StackButtons
        methods={methods}
        create={create}
        open={open}
        setOpen={setOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Tipo Produccion</DialogTitle>
        <DialogContent>
          <DialogContentText>Completa el formulario.</DialogContentText>
          <FormControl fullWidth margin="normal">
            <TextField
              autoFocus
              required
              id="nombre"
              name="nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.nombre || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="descripcion"
              name="descripcion"
              label="Descripción"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.descripcion || ""}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="estado-label"
              sx={{
                backgroundColor: 'white', 
                padding: '0 8px',      
              }}
            >Estado</InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={props.selectedRow?.estado || ''}
              fullWidth
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit">{methodName}</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}