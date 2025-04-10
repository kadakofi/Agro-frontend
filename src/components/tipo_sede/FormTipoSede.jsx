/**
 * @file FormTipoSede.jsx
 * @module FormTipoSede
 * @description Formulario modal para agregar, editar o eliminar Tipos de Sede. Utiliza MUI Dialog y comunica cambios al backend mediante Axios.
 * @author Karla
 */

import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "../axiosConfig";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente de formulario para la gestión de tipos de sede.
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.selectedRow - Objeto que representa la fila seleccionada
 * @param {function(Object): void} props.setSelectedRow - Función para actualizar la fila seleccionada
 * @param {function(): void} props.reloadData - Función para recargar los datos desde la API
 * @param {function(Object): void} props.setMessage - Función para mostrar mensajes en Snackbar
 * @returns {JSX.Element} Formulario para crear, actualizar o eliminar tipos de sede
 */
export default function FormTipoSedes({
  selectedRow,
  setSelectedRow,
  reloadData,
  setMessage,
}) {
  const [open, setOpen] = useState(false);
  const [methodName, setMethodName] = useState("");

  /**
   * Abre el modal según la acción (Add, Update, Delete).
   * @param {string} method - Tipo de acción a ejecutar
   */
  const handleOpen = (method) => {
    if (method === "Update" && (!selectedRow || selectedRow.id == null)) {
      setMessage({
        open: true,
        severity: "error",
        text: "Seleccione un registro para actualizar.",
      });
      return;
    }
    if (method === "Delete" && (!selectedRow || selectedRow.id == null)) {
      setMessage({
        open: true,
        severity: "error",
        text: "Seleccione un registro para eliminar.",
      });
      return;
    }

    setMethodName(method);
    if (method === "Delete") {
      handleDelete();
    } else {
      setOpen(true);
    }
  };

  /**
   * Cierra el diálogo y reinicia la fila seleccionada.
   */
  const handleClose = () => {
    setSelectedRow({ id: null, nombre: "", descripcion: "", estado: 1 });
    setOpen(false);
  };

  /**
   * Maneja el envío del formulario para crear o actualizar.
   */
  const handleSubmit = () => {
    const url = `${SiteProps.urlbasev1}/tipo_sede`;
    const method = methodName === "Add" ? axios.post : axios.put;
    const endpoint = methodName === "Add" ? url : `${url}/${selectedRow.id}`;

    method(endpoint, selectedRow, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text:
            methodName === "Add"
              ? "Tipo de Sede creado con éxito."
              : "Tipo de Sede actualizado con éxito.",
        });
        reloadData();
        handleClose();
      })
      .catch((error) => {
        console.error("Error al guardar tipo_sede:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al guardar los datos. Intente nuevamente.",
        });
      });
  };

  /**
   * Elimina el tipo de sede seleccionado.
   */
  const handleDelete = () => {
    axios
      .delete(`${SiteProps.urlbasev1}/tipo_sede/${selectedRow.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        setMessage({
          open: true,
          severity: "success",
          text: "Tipo de Sede eliminado con éxito.",
        });
        reloadData();
        setSelectedRow({ id: null, nombre: "", descripcion: "", estado: 1 });
      })
      .catch((error) => {
        console.error("Error al eliminar tipo_sede:", error);
        setMessage({
          open: true,
          severity: "error",
          text: "Error al eliminar el registro. Intente nuevamente.",
        });
      });
  };

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen("Add")}
          style={{ marginRight: "10px" }}
        >
          Nuevo
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<UpdateIcon />}
          onClick={() => handleOpen("Update")}
          style={{ marginRight: "10px" }}
        >
          Editar
        </Button>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={() => handleOpen("Delete")}
        >
          Eliminar
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {methodName === "Add" ? "Agregar Tipo de Sede" : "Actualizar Tipo de Sede"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Nombre"
            value={selectedRow?.nombre || ""}
            onChange={(e) =>
              setSelectedRow({ ...selectedRow, nombre: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Descripción"
            value={selectedRow?.descripcion || ""}
            onChange={(e) =>
              setSelectedRow({ ...selectedRow, descripcion: e.target.value })
            }
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              value={selectedRow?.estado || 1}
              onChange={(e) =>
                setSelectedRow({ ...selectedRow, estado: e.target.value })
              }
            >
              <MenuItem value={1}>Activo</MenuItem>
              <MenuItem value={0}>Inactivo</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>
            {methodName === "Add" ? "Agregar" : "Actualizar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

FormTipoSedes.propTypes = {
  selectedRow: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.number,
  }),
  setSelectedRow: PropTypes.func.isRequired,
  reloadData: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};
