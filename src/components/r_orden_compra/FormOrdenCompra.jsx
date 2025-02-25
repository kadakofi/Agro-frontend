import React, { useState, useEffect } from "react";
import {
  Grid,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  Modal,
  TextField,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

export default function FormOrdenCompra({
  onAddOrdenCompra,
  onUpdateOrdenCompra,
  onDeleteOrdenCompra,
  setAlmacenId,
  selectedOrdenCompra,
  setSelectedOrdenCompra,
  fetchOrdenesCompra,
}) {
  const [sede, setSede] = useState("");
  const [almacen, setAlmacen] = useState("");
  const [sedes, setSedes] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newOrdenCompra, setNewOrdenCompra] = useState({
    pedido: "",
    proveedor: "",
    descripcion: "",
    fechaHora: "",
    estado: 1,
  });
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  // Cargar sedes
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSedes(response.data || []);
      } catch (error) {
        console.error("Error al cargar sedes:", error);
      }
    };
    fetchSedes();
  }, []);

  // Cargar almacenes al seleccionar una sede
  const handleSedeChange = async (e) => {
    const sedeId = e.target.value;
    setSede(sedeId);
    setAlmacen("");
    setAlmacenes([]);
    setSelectedOrdenCompra(null);

    if (sedeId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${SiteProps.urlbasev1}/almacen/minimal/sede/${sedeId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAlmacenes(response.data || []);
      } catch (error) {
        console.error("Error al cargar almacenes:", error);
      }
    }
  };

  // Cargar pedidos al seleccionar un almacén
  useEffect(() => {
    const fetchPedidos = async () => {
      if (!almacen) return;
      setPedidos([]);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${SiteProps.urlbasev1}/pedido/almacen/${almacen}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPedidos(response.data.content || []);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
      }
    };
    fetchPedidos();
  }, [almacen]);

  // Cargar proveedores (pendiente por definir endpoint)
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${SiteProps.urlbasev1}/proveedor`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProveedores(response.data.content || []);
      } catch (error) {
        console.error("Error al cargar proveedores:", error);
      }
    };
    fetchProveedores();
  }, []);

  const handleSaveOrdenCompra = async () => {
    if (!selectedPedido || !selectedProveedor || !newOrdenCompra.descripcion) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const ordenCompraToSend = {
      ...newOrdenCompra,
      pedido: selectedPedido?.id,
      proveedor: selectedProveedor?.id,
    };

    try {
      const token = localStorage.getItem("token");
      if (isEditing) {
        await axios.put(
          `${SiteProps.urlbasev1}/orden_compra/${selectedOrdenCompra.id}`,
          ordenCompraToSend,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Orden de compra actualizada correctamente.");
      } else {
        await axios.post(`${SiteProps.urlbasev1}/orden_compra`, ordenCompraToSend, {
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

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setSelectedOrdenCompra(null);
    setNewOrdenCompra({
      pedido: "",
      proveedor: "",
      descripcion: "",
      fechaHora: "",
      estado: 1,
    });
    setModalOpen(true);
  };

  const handleOpenUpdateModal = () => {
    if (selectedOrdenCompra) {
      setIsEditing(true);
      setNewOrdenCompra({
        pedido: selectedOrdenCompra.pedido,
        proveedor: selectedOrdenCompra.proveedor,
        descripcion: selectedOrdenCompra.descripcion,
        fechaHora: selectedOrdenCompra.fechaHora,
        estado: selectedOrdenCompra.estado,
      });

      const currentPedido = pedidos.find(
        (p) => p.id === selectedOrdenCompra.pedido
      );
      const currentProveedor = proveedores.find(
        (p) => p.id === selectedOrdenCompra.proveedor
      );
      setSelectedPedido(currentPedido || null);
      setSelectedProveedor(currentProveedor || null);

      setModalOpen(true);
    } else {
      alert("Selecciona una orden de compra para actualizar.");
    }
  };

  return (
    <Box mb={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Sede</InputLabel>
            <Select value={sede} onChange={handleSedeChange} required>
              <MenuItem value="">
                <em>Seleccione una sede</em>
              </MenuItem>
              {sedes.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel>Almacén</InputLabel>
            <Select
              value={almacen}
              onChange={(e) => {
                setAlmacen(e.target.value);
                setAlmacenId(e.target.value);
              }}
              required
              disabled={!almacenes.length}
            >
              <MenuItem value="">
                <em>Seleccione un almacén</em>
              </MenuItem>
              {almacenes.map((a) => (
                <MenuItem key={a.id} value={a.id}>
                  {a.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenAddModal}
            style={{ marginRight: "10px" }}
          >
            ADD
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenUpdateModal}
            style={{ marginRight: "10px" }}
          >
            UPDATE
          </Button>
          <Button variant="contained" color="error" onClick={onDeleteOrdenCompra}>
            DELETE
          </Button>
        </Grid>
      </Grid>

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
          <Autocomplete
            options={pedidos}
            getOptionLabel={(option) => `${option.id} - ${option.descripcion}`}
            value={selectedPedido}
            onChange={(event, value) => setSelectedPedido(value)}
            renderInput={(params) => (
              <TextField {...params} label="Pedido" margin="normal" required />
            )}
            fullWidth
          />
          <Autocomplete
            options={proveedores}
            getOptionLabel={(option) => `${option.id} - ${option.nombre}`}
            value={selectedProveedor}
            onChange={(event, value) => setSelectedProveedor(value)}
            renderInput={(params) => (
              <TextField {...params} label="Proveedor" margin="normal" required />
            )}
            fullWidth
          />
          <TextField
            label="Descripción"
            fullWidth
            margin="normal"
            value={newOrdenCompra.descripcion}
            onChange={(e) =>
              setNewOrdenCompra({ ...newOrdenCompra, descripcion: e.target.value })
            }
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveOrdenCompra}
            fullWidth
          >
            Guardar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
