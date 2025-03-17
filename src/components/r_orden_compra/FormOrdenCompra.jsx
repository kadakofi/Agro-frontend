
/**
 * FormOrdenCompra componente principal.
 * @component
 * @returns {JSX.Element}
 */

import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Modal, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente FormOrdenCompra.
 * @module FormOrdenCompra.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function FormOrdenCompra({
  fetchOrdenesCompra,
  sedes,
  almacenes,
  setSede,
  setAlmacenId,
  selectedOrdenCompra,
  setSelectedOrdenCompra,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newOrdenCompra, setNewOrdenCompra] = useState({
    pedidoId: "",
    proveedor: "",
    descripcion: "",
    estado: 1,
  });

  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${SiteProps.urlbasev1}/proveedor/minimal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProveedores(response.data.content || []);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    };
    fetchProveedores();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setNewOrdenCompra({
      pedidoId: "",
      proveedor: "",
      descripcion: "",
      estado: 1,
    });
    setModalOpen(true);
  };

  const handleOpenUpdateModal = () => {
    if (selectedOrdenCompra) {
      setIsEditing(true);
      setNewOrdenCompra({
        pedidoId: selectedOrdenCompra.pedidoId,
        proveedor: selectedOrdenCompra.proveedor,
        descripcion: selectedOrdenCompra.descripcion,
        estado: selectedOrdenCompra.estado,
      });
      setModalOpen(true);
    } else {
      alert("Selecciona una orden de compra para actualizar.");
    }
  };

  const handleSaveOrdenCompra = async () => {
    if (!newOrdenCompra.pedidoId || !newOrdenCompra.proveedor || !newOrdenCompra.descripcion) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.put(`${SiteProps.urlbasev1}/orden_compra/${selectedOrdenCompra.id}`, newOrdenCompra, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Orden de compra actualizada correctamente.");
      } else {
        await axios.post(`${SiteProps.urlbasev1}/orden_compra`, newOrdenCompra, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Orden de compra creada correctamente.");
      }

      setModalOpen(false);
      fetchOrdenesCompra();
    } catch (error) {
      console.error("Error al guardar la orden de compra:", error);
      alert("Hubo un problema al guardar la orden de compra.");
    }
  };

  return (
    <Box mb={2}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleOpenAddModal} style={{ marginRight: "10px" }}>
          ADD
        </Button>
        <Button variant="contained" color="secondary" onClick={handleOpenUpdateModal} style={{ marginRight: "10px" }}>
          UPDATE
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            if (selectedOrdenCompra) {
              if (window.confirm("¿Estás seguro de eliminar esta orden de compra?")) {
                axios
                  .delete(`${SiteProps.urlbasev1}/orden_compra/${selectedOrdenCompra.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                  })
                  .then(() => {
                    alert("Orden de compra eliminada correctamente.");
                    fetchOrdenesCompra();
                    setSelectedOrdenCompra(null);
                  })
                  .catch((error) => {
                    console.error("Error al eliminar la orden de compra:", error);
                    alert("Hubo un problema al eliminar la orden de compra.");
                  });
              }
            } else {
              alert("Selecciona una orden de compra para eliminar.");
            }
          }}
        >
          DELETE
        </Button>
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          p={4}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: "8px",
          }}
        >
          <h2>{isEditing ? "Editar Orden de Compra" : "Añadir Orden de Compra"}</h2>
          <TextField
            label="Pedido ID"
            fullWidth
            margin="normal"
            value={newOrdenCompra.pedidoId}
            onChange={(e) => setNewOrdenCompra({ ...newOrdenCompra, pedidoId: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Proveedor</InputLabel>
            <Select
              value={newOrdenCompra.proveedor}
              onChange={(e) => setNewOrdenCompra({ ...newOrdenCompra, proveedor: e.target.value })}
            >
              {proveedores.map((prov) => (
                <MenuItem key={prov.id} value={prov.id}>
                  {prov.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Descripción"
            fullWidth
            margin="normal"
            value={newOrdenCompra.descripcion}
            onChange={(e) => setNewOrdenCompra({ ...newOrdenCompra, descripcion: e.target.value })}
          />
          <Button variant="contained" color="primary" onClick={handleSaveOrdenCompra} fullWidth>
            Guardar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
