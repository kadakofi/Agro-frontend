/**
 * @file GridKardexNuevo.jsx
 * @module GridKardexNuevo
 * @author Karla
 * @description Componente para la gestión visual de items del Kardex. Permite agregar, editar y eliminar registros con autocompletado de producto-presentación y asignación automática de kardexID.
 */

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Box, Modal, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import ProductoPresentacion from './ProductoPresentacion';
import axios from 'axios';
import { SiteProps } from '../dashboard/SiteProps';

/**
 * Columnas configuradas para la grilla de items del Kardex.
 * @type {Array<Object>}
 */
const columns = [
  { field: 'id', headerName: 'ID', width: 90, hide: true },
  {
    field: 'productoPresentacion',
    headerName: 'Producto Presentación',
    width: 200,
    renderCell: (params) => {
      const producto = params.row.productoPresentacion;
      return producto
        ? `${producto.nombreProducto || ''} - ${producto.nombrePresentacion || ''}`
        : '-';
    }
  },
  { field: 'cantidad', headerName: 'Cantidad', type: 'number', width: 110 },
  { field: 'precio', headerName: 'Precio', type: 'number', width: 130 },
  { field: 'estado', headerName: 'Estado', width: 130 },
];

/**
 * Estado inicial del formulario.
 * @type {Object}
 */
const initialFormState = {
  id: '',
  productoPresentacion: null,
  cantidad: '',
  precio: '',
  estado: '',
  kardexID: ''
};

/**
 * Componente GridKardexNuevo.
 * Permite la gestión de items del Kardex: agregar, editar, eliminar y visualizar.
 * 
 * @function
 * @param {Object} props
 * @param {Array<Object>} props.kardexItems - Lista de items actuales en el Kardex.
 * @param {Function} props.setKardexItems - Función para actualizar la lista de items.
 * @returns {JSX.Element}
 */
export default function GridKardexNuevo({ kardexItems, setKardexItems }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [kardexOptions, setKardexOptions] = useState([]);

  /**
   * Carga las opciones de Kardex desde el backend al montar el componente.
   */
  useEffect(() => {
    const fetchKardexOptions = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/kardexItem`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        const kardexItems = response.data._embedded.kardexItemDTOList || [];
        const kardexOptionsList = kardexItems
          .filter(item => item.productoPresentacionID)
          .map((item) => ({
            id: item.kardexID,
            productoPresentacionID: item.productoPresentacionID,
          }));
        setKardexOptions(kardexOptionsList);
      } catch (error) {
        console.error('Error al cargar opciones de Kardex:', error);
      }
    };
    fetchKardexOptions();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState);
    setSelectedRow(null);
  };

  /**
   * Maneja los cambios en los campos del formulario.
   * @param {Object} e Evento de cambio.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAdd = () => {
    setIsEditMode(false);
    handleOpen();
  };

  const handleEdit = () => {
    if (selectedRow) {
      setIsEditMode(true);
      setFormData(selectedRow);
      handleOpen();
    } else {
      alert("Por favor, selecciona una fila para actualizar");
    }
  };

  /**
   * Envía una solicitud para agregar un nuevo item al backend.
   * @param {Object} item
   */
  const handleAddItem = async (item) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${SiteProps.urlbasev1}/kardexItem`, item, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setKardexItems((prevItems) => [...prevItems, item]);
    } catch (error) {
      console.error('Error al agregar item al Kardex:', error);
    }
  };

  /**
   * Envía una solicitud para actualizar un item existente.
   * @param {Object} item
   */
  const handleUpdateItem = async (item) => {
    try {
      const response = await axios.put(`${SiteProps.urlbasev1}/kardexItem/${item.kardexID}`, item, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setKardexItems((prevItems) =>
        prevItems.map((i) => (i.kardexID === item.kardexID ? response.data : i))
      );
    } catch (error) {
      console.error('Error al actualizar item del Kardex:', error);
    }
  };

  /**
   * Procesa la acción de agregar o actualizar según el modo.
   */
  const handleSubmit = () => {
    if (!formData.kardexID) {
      alert("Error: kardexID no asignado automáticamente.");
      return;
    }

    const kardexItemData = {
      kardexID: formData.kardexID,
      productoPresentacionID: formData.productoPresentacion?.id,
      cantidad: formData.cantidad,
      precio: formData.precio,
      estado: formData.estado
    };

    if (isEditMode) {
      handleUpdateItem(kardexItemData);
    } else {
      handleAddItem(kardexItemData);
    }
    handleClose();
  };

  /**
   * Elimina un item del Kardex.
   * @param {Object} item
   */
  const handleDelete = async (item) => {
    try {
      const response = await axios.delete(`${SiteProps.urlbasev1}/kardexItem/${item.kardexID}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        setKardexItems((prevItems) =>
          prevItems.filter((i) => i.kardexID !== item.kardexID)
        );
      }
    } catch (error) {
      console.error('Error al eliminar item del Kardex:', error);
    }
  };

  return (
    <Box sx={{ height: 400, width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" color="primary" onClick={handleAdd} sx={{ mr: 1 }}>
          ADD
        </Button>
        <Button variant="contained" color="primary" onClick={handleEdit} sx={{ mr: 1 }}>
          UPDATE
        </Button>
        <Button variant="contained" color="primary" onClick={() => handleDelete(selectedRow)}>
          DELETE
        </Button>
      </Box>

      <DataGrid
        rows={kardexItems}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        getRowId={(row) => row.productoPresentacionID || row.id}
        onRowSelectionModelChange={(selectionModel) => {
          const selectedID = selectionModel[0];
          const selected = kardexItems.find(item => item.productoPresentacionID === selectedID);
          setSelectedRow(selected);
        }}
      />

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4,
        }}>
          <h2>{isEditMode ? 'Actualizar Item' : 'Añadir Item'}</h2>
          <form>
            <ProductoPresentacion
              value={formData.productoPresentacion}
              setValue={(newValue) => {
                setFormData((prevState) => ({
                  ...prevState,
                  productoPresentacion: newValue
                }));

                const matchingKardex = kardexOptions.find(
                  (kardex) => kardex.productoPresentacionID === newValue?.id
                );
                
                if (matchingKardex) {
                  setFormData((prevState) => ({
                    ...prevState,
                    kardexID: matchingKardex.id
                  }));
                } else {
                  setFormData((prevState) => ({ ...prevState, kardexID: '' }));
                }
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Cantidad"
              name="cantidad"
              type="number"
              value={formData.cantidad}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
              >
                <MenuItem value="Disponible">Disponible</MenuItem>
                <MenuItem value="No_Disponible">No Disponible</MenuItem>
              </Select>
            </FormControl>
            <Box textAlign="center" mt={2}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                {isEditMode ? 'Actualizar' : 'Añadir'}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}
