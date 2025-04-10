/**
 * @file Bloque.jsx
 * @module Bloque
 * @description Componente principal para la gestión de bloques.
 * Permite seleccionar una sede, visualizar los bloques asociados y realizar operaciones CRUD mediante FormBloque.
 * Conecta con el backend para obtener y actualizar datos.
 * @author Karla
 */

import React, { useEffect, useState } from "react";
import axios from "axios";
import MessageSnackBar from "../MessageSnackBar";
import FormBloque from "./FormBloque";
import GridBloque from "./GridBloque";
import { SiteProps } from "../dashboard/SiteProps";

/**
 * @typedef {Object} Sede
 * @property {number} id - ID de la sede
 * @property {string} nombre - Nombre de la sede
 */

/**
 * @typedef {Object} SnackbarMessage
 * @property {boolean} open - Si el mensaje está visible
 * @property {string} severity - Nivel de severidad del mensaje ('success', 'error', etc.)
 * @property {string} text - Texto del mensaje
 */

/**
 * Componente principal para la gestión de bloques.
 *
 * @component
 * @returns {JSX.Element} Componente que renderiza la interfaz de gestión de bloques.
 */
export default function Bloque() {
  /** Lista de sedes disponibles */
  const [sedes, setSedes] = useState(/** @type {Sede[]} */ ([]));

  /** ID de la sede actualmente seleccionada */
  const [selectedSede, setSelectedSede] = useState("");

  /** Fila seleccionada de la tabla de bloques */
  const [selectedRow, setSelectedRow] = useState(null);

  /** Estado para controlar si se debe recargar la tabla de bloques */
  const [reloadData, setReloadData] = useState(false);

  /** Mensaje para mostrar en el snackbar */
  const [message, setMessage] = useState(/** @type {SnackbarMessage} */ ({
    open: false,
    severity: "success",
    text: "",
  }));

  /**
   * Carga las sedes desde el backend al montar el componente.
   */
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []);
      } catch (error) {
        console.error("Error al cargar las sedes:", error);
        setMessage({ open: true, severity: "error", text: "Error al cargar las sedes." });
      }
    };
    fetchSedes();
  }, []);

  /**
   * Maneja el cambio de sede seleccionada.
   * @param {React.ChangeEvent<HTMLSelectElement>} event - Evento de cambio de select
   */
  const handleSedeChange = (event) => {
    setSelectedSede(event.target.value);
    setReloadData((prev) => !prev); // Fuerza recarga de bloques
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Bloque</h1>

      <MessageSnackBar message={message} setMessage={setMessage} />

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="sede-select"><strong>Seleccionar Sede:</strong> </label>
        <select id="sede-select" value={selectedSede} onChange={handleSedeChange}>
          <option value="">Seleccione una sede</option>
          {sedes.map((sede) => (
            <option key={sede.id} value={sede.id}>
              {sede.nombre}
            </option>
          ))}
        </select>
      </div>

      <FormBloque
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        setMessage={setMessage}
        reloadData={() => setReloadData((prev) => !prev)}
      />

      <GridBloque
        selectedSede={selectedSede}
        setSelectedRow={setSelectedRow}
        reloadData={reloadData}
      />
    </div>
  );
}
