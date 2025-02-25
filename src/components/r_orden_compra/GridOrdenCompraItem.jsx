import React from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function GridOrdenCompraItem({ items, ordenCompraId }) {
  const columns = [
    { field: "producto", headerName: "Producto", width: 200 },
    { field: "cantidad", headerName: "Cantidad", width: 150 },
    { field: "precio", headerName: "Precio", width: 150 },
    { field: "unidad", headerName: "Unidad", width: 150 },
  ];

  return (
    <div style={{ marginTop: 20, height: 400, width: "100%" }}>
      <h3>Ítems de la Orden de Compra {ordenCompraId}</h3>
      <DataGrid
        rows={items} // 'items' debe ser un array
        columns={columns}
        getRowId={(row) => row.id}
      />
    </div>
  );
}
