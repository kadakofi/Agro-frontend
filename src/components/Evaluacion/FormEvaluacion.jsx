
/**
 * FormEvaluacion componente principal.
 * @component
 * @returns {JSX.Element}
 */
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * Componente FormEvaluacion.
 * @module FormEvaluacion.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function FormEvaluacion({ onAdd, onUpdate, onDelete, selectedRow, setSelectedRow }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    eva_id: "",
    eva_nombre: "",
    eva_descripcion: "",
    eva_estado: 1,
  });

  const handleOpen = () => {
    if (selectedRow) {
      setFormData(selectedRow);
    } else {
      setFormData({
        eva_id: "",
        eva_nombre: "",
        eva_descripcion: "",
        eva_estado: 1,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.eva_id) {
      onUpdate(formData);
    } else {
      onAdd({ ...formData, eva_id: Date.now() });
    }
    handleClose();
  };

  const handleDelete = () => {
    if (selectedRow && selectedRow.eva_id) {
      onDelete(selectedRow.eva_id);
      setSelectedRow(null);
    }
  };

  return (
    <>
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
        <Button variant="outlined" color="primary" startIcon={<AddIcon />} onClick={handleOpen}>ADD</Button>
        <Button variant="outlined" color="secondary" startIcon={<EditIcon />} onClick={handleOpen} disabled={!selectedRow}>UPDATE</Button>
        <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete} disabled={!selectedRow}>DELETE</Button>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedRow ? "Editar Evaluación" : "Agregar Evaluación"}</DialogTitle>
        <DialogContent>
          <TextField name="eva_nombre" label="Nombre" value={formData.eva_nombre} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="eva_descripcion" label="Descripción" value={formData.eva_descripcion} onChange={handleChange} fullWidth margin="normal" />
          <TextField name="eva_estado" label="Estado (1: Activo, 0: Inactivo)" value={formData.eva_estado} onChange={handleChange} fullWidth margin="normal" type="number" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type="submit" onClick={handleSubmit}>{selectedRow ? "Actualizar" : "Agregar"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
