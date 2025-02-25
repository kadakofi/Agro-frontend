import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import FormOrdenCompra from "./FormOrdenCompra";
import GridOrdenCompra from "./GridOrdenCompra";
import GridOrdenCompraItem from "./GridOrdenCompraItem";
import FormOrdenCompraItem from "./FormOrdenCompraItem";
import axios from "axios";
import { SiteProps } from "../dashboard/SiteProps";

export default function OrdenCompra() {
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [almacenId, setAlmacenId] = useState(null);
  const [selectedOrdenCompra, setSelectedOrdenCompra] = useState(null);
  const [ordenCompraItems, setOrdenCompraItems] = useState([]);

  // Cargar órdenes de compra
  const fetchOrdenesCompra = async () => {
    if (!almacenId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${SiteProps.urlbasev1}/orden_compra/almacen/${almacenId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrdenesCompra(response.data.content || []);
    } catch (error) {
      console.error("Error al cargar órdenes de compra:", error);
    }
  };

  // Cargar ítems de una orden de compra
  const fetchOrdenCompraItems = async () => {
    if (!selectedOrdenCompra || !selectedOrdenCompra.id) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${SiteProps.urlbasev1}/orden_compra_item/orden_compra/${selectedOrdenCompra.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const items = response.data?.content || [];
      setOrdenCompraItems(items);
    } catch (error) {
      console.error("Error al cargar los ítems:", error);
    }
  };

  useEffect(() => {
    fetchOrdenesCompra();
  }, [almacenId]);

  useEffect(() => {
    fetchOrdenCompraItems();
  }, [selectedOrdenCompra]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
        height: "80vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Gestión de Órdenes de Compra
      </Typography>

      <FormOrdenCompra
        onAddOrdenCompra={fetchOrdenesCompra}
        onUpdateOrdenCompra={fetchOrdenesCompra}
        onDeleteOrdenCompra={() => {
          // Lógica para eliminar
        }}
        setAlmacenId={setAlmacenId}
        selectedOrdenCompra={selectedOrdenCompra}
        setSelectedOrdenCompra={setSelectedOrdenCompra}
        fetchOrdenesCompra={fetchOrdenesCompra}
      />

      <GridOrdenCompra
        ordenesCompra={ordenesCompra}
        onGenerateReport={() => {
          // Lógica para generar reporte
        }}
        onSelectOrdenCompra={(ordenCompra) => {
          setSelectedOrdenCompra(ordenCompra);
        }}
      />

      {selectedOrdenCompra && (
        <>
          <GridOrdenCompraItem
            items={Array.isArray(ordenCompraItems) ? ordenCompraItems : []}
            ordenCompraId={selectedOrdenCompra.id}
          />
          <FormOrdenCompraItem
            ordenCompraId={selectedOrdenCompra.id}
            fetchOrdenCompraItems={fetchOrdenCompraItems}
            disabled={ordenCompraItems.length > 0}
          />
        </>
      )}
    </Box>
  );
}
