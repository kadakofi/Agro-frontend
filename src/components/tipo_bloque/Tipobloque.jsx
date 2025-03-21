import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import FormTipoBloque from "./FormTipobloque.jsx";
import GridTipoBloque from "./GridTipoBloque";
import MessageSnackBar from "../MessageSnackBar";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * Componente principal para gestionar los tipos de bloque.
 *
 * Permite listar, crear, actualizar y eliminar registros del recurso tipo_bloque.
 * @component
 * @module TipoBloque
 * @returns {JSX.Element}
 */
export default function TipoBloque() {
  const initialRow = { id: null, nombre: "", descripcion: "", estado: 1 };

  const [bloques, setBloques] = useState([]);
  const [selectedRow, setSelectedRow] = useState(initialRow);
  const [message, setMessage] = useState({ open: false, severity: "info", text: "" });

  /**
   * Carga los tipos de bloque desde la API.
   * @async
   * @function fetchData
   */
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticación no encontrado.");

      const response = await axios.get(`${SiteProps.urlbasev1}/tipo_bloque`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBloques(response.data || []);
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      setMessage({ open: true, severity: "error", text: `Error al cargar datos: ${errorMessage}` });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Crea un nuevo tipo de bloque.
   * @async
   * @function addTipoBloque
   * @param {Object} data - Datos del tipo de bloque a crear.
   */
  const addTipoBloque = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticación no encontrado.");

      await axios.post(`${SiteProps.urlbasev1}/tipo_bloque`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ open: true, severity: "success", text: "Tipo de Bloque creado con éxito!" });
      fetchData();
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      setMessage({ open: true, severity: "error", text: `Error al crear tipo_bloque: ${errorMessage}` });
    }
  };

  /**
   * Actualiza un tipo de bloque existente.
   * @async
   * @function updateTipoBloque
   * @param {Object} data - Datos actualizados del tipo de bloque.
   */
  const updateTipoBloque = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticación no encontrado.");

      await axios.put(`${SiteProps.urlbasev1}/tipo_bloque/${data.id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ open: true, severity: "success", text: "Tipo de Bloque actualizado con éxito!" });
      fetchData();
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      setMessage({ open: true, severity: "error", text: `Error al actualizar tipo_bloque: ${errorMessage}` });
    }
  };

  /**
   * Elimina un tipo de bloque por su ID.
   * @async
   * @function deleteTipoBloque
   * @param {number} id - ID del tipo de bloque a eliminar.
   */
  const deleteTipoBloque = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token de autenticación no encontrado.");

      await axios.delete(`${SiteProps.urlbasev1}/tipo_bloque/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ open: true, severity: "success", text: "Tipo de Bloque eliminado con éxito!" });
      fetchData();
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message : error.message;
      setMessage({ open: true, severity: "error", text: `Error al eliminar tipo_bloque: ${errorMessage}` });
    }
  };

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <h1>Tipo Bloque</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />

      <FormTipoBloque
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        addTipoBloque={addTipoBloque}
        updateTipoBloque={updateTipoBloque}
        deleteTipoBloque={deleteTipoBloque}
        reloadData={fetchData}
      />

      <GridTipoBloque bloques={bloques} setSelectedRow={setSelectedRow} />
    </Box>
  );
}
