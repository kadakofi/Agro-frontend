/**
 * @file Espacio.jsx
 * @module Espacio
 * @description Componente principal para la gestión de espacios.
 * Permite seleccionar sede y bloque, visualizar los espacios asociados y gestionarlos con FormEspacio.
 * Conecta con el backend para obtener y actualizar datos de espacios.
 * Utiliza DataGrid de Material UI, manejo de estados con hooks y peticiones HTTP con Axios.
 * @author Karla
 */

import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";
import MessageSnackBar from "../MessageSnackBar";
import FormEspacio from "../espacio/FormEspacio";

/**
 * @typedef {Object} EspacioRow
 * @property {number} id - ID del espacio
 * @property {Object|number} bloque - Objeto bloque o ID del bloque
 * @property {Object|number} tipoEspacio - Objeto tipoEspacio o ID del tipo
 * @property {string} nombre - Nombre del espacio
 * @property {string} geolocalizacion - Coordenada numérica
 * @property {string} coordenadas - Coordenadas en texto (números con espacio)
 * @property {string} descripcion - Descripción del espacio
 * @property {number} estado - Estado (1: Activo, 0: Inactivo)
 */

/**
 * Componente React para la gestión de espacios físicos.
 * Permite cargar y visualizar espacios por sede y bloque, usando un formulario y grilla editable.
 *
 * @component
 * @returns {JSX.Element} Interfaz para gestionar espacios.
 */
export default function Espacio() {
  const [sedes, setSedes] = useState([]);
  const [selectedSede, setSelectedSede] = useState(null);
  const [bloques, setBloques] = useState([]);
  const [selectedBloque, setSelectedBloque] = useState(null);
  const [espacio, setEspacios] = useState([]);
  const [tipoEspacios, setTipoEspacios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ open: false, severity: "success", text: "" });
  const [selectedRow, setSelectedRow] = useState(null);

  /**
   * Carga los espacios desde el backend, incluyendo la relación con bloque y tipoEspacio.
   */
  const fetchEspacios = async () => {
    if (!selectedBloque) {
      setEspacios([]);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${SiteProps.urlbasev1}/espacio/bloque/${selectedBloque}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      const data = response.data || [];

      const mappedData = data.map((esp) => {
        const bloqueObj =
          typeof esp.bloque === "object" ? esp.bloque : bloques.find((b) => b.id === esp.bloque);
        const tipoEspacioObj =
          typeof esp.tipoEspacio === "object"
            ? esp.tipoEspacio
            : tipoEspacios.find((t) => t.id === esp.tipoEspacio);

        return {
          ...esp,
          bloque: bloqueObj || esp.bloque,
          tipoEspacio: tipoEspacioObj || esp.tipoEspacio,
        };
      });

      setEspacios(mappedData);
      setError(null);
    } catch (err) {
      console.error("Error al cargar los espacios:", err);
      setError("No se pudieron cargar los espacios.");
      setEspacios([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Carga la lista de sedes al iniciar el componente.
   */
  useEffect(() => {
    const fetchSedes = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/sede/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setSedes(response.data || []);
      } catch (err) {
        console.error("Error al cargar las sedes:", err);
      }
    };
    fetchSedes();
  }, []);

  /**
   * Carga los bloques al cambiar la sede seleccionada.
   */
  useEffect(() => {
    if (!selectedSede) {
      setBloques([]);
      setEspacios([]);
      return;
    }

    const fetchBloques = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/bloque/sede/${selectedSede}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setBloques(response.data || []);
      } catch (err) {
        console.error("Error al cargar los bloques:", err);
      }
    };
    fetchBloques();
  }, [selectedSede]);

  /**
   * Carga el listado de tipos de espacio.
   */
  useEffect(() => {
    const fetchTipoEspacios = async () => {
      try {
        const response = await axios.get(`${SiteProps.urlbasev1}/tipo_espacio/minimal`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTipoEspacios(response.data || []);
      } catch (err) {
        console.error("Error al cargar tipos de espacio:", err);
      }
    };
    fetchTipoEspacios();
  }, []);

  /**
   * Refresca la lista de espacios cuando cambian bloque, lista de bloques o tipos.
   */
  useEffect(() => {
    fetchEspacios();
  }, [selectedBloque, bloques, tipoEspacios]);

  const handleSedeChange = (event) => {
    setSelectedSede(event.target.value);
    setSelectedBloque(null);
    setEspacios([]);
  };

  const handleBloqueChange = (event) => {
    setSelectedBloque(event.target.value);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "bloque",
      headerName: "Bloque",
      width: 180,
      valueGetter: (params) => params.row.bloque?.nombre || "",
    },
    {
      field: "tipoEspacio",
      headerName: "Tipo de Espacio",
      width: 180,
      valueGetter: (params) => params.row.tipoEspacio?.nombre || "",
    },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "geolocalizacion", headerName: "Geolocalización", width: 300 },
    { field: "coordenadas", headerName: "Coordenadas", width: 150 },
    { field: "descripcion", headerName: "Descripción", width: 250 },
    {
      field: "estado",
      headerName: "Estado",
      width: 120,
      valueGetter: (params) => (params.row.estado === 1 ? "Activo" : "Inactivo"),
    },
  ];

  const handleRowClick = (params) => {
    const row = params.row;
    const bloque = typeof row.bloque === "object" ? row.bloque : bloques.find((b) => b.id === row.bloque);
    const tipoEspacio =
      typeof row.tipoEspacio === "object"
        ? row.tipoEspacio
        : tipoEspacios.find((t) => t.id === row.tipoEspacio);
    const sedeId = bloque?.sede?.id || selectedSede;

    setSelectedRow({
      ...row,
      bloque,
      tipoEspacio,
      sede: sedeId,
    });
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <h1>Espacio</h1>
      <MessageSnackBar message={message} setMessage={setMessage} />
      {loading ? (
        <div style={{ textAlign: "center", margin: "20px" }}>Cargando datos...</div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center", margin: "20px" }}>{error}</div>
      ) : (
        <>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="sede-select">Seleccionar Sede: </label>
            <select id="sede-select" value={selectedSede || ""} onChange={handleSedeChange}>
              <option value="">Seleccione una sede</option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="bloque-select">Seleccionar Bloque: </label>
            <select id="bloque-select" value={selectedBloque || ""} onChange={handleBloqueChange}>
              <option value="">Seleccione un bloque</option>
              {bloques.map((bloque) => (
                <option key={bloque.id} value={bloque.id}>
                  {bloque.nombre}
                </option>
              ))}
            </select>
          </div>

          <FormEspacio
            setMessage={setMessage}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            reloadData={fetchEspacios}
            sedes={sedes}
          />

          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={espacio}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              onRowClick={handleRowClick}
              getRowId={(row) => row.id}
            />
          </div>
        </>
      )}
    </div>
  );
}
