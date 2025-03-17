
/**
 * GridPais componente principal.
 * @component
 * @returns {JSX.Element}
 */
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'name', headerName: 'Nombre', width: 250, type: 'string' },
];

/**
 * Componente GridPais.
 * @module GridPais.jsx
 * @component
 * @returns {JSX.Element}
 */
export default function GridPais(props) {
  return (
    <DataGrid
      rows={props.pais}
      onRowSelectionModelChange={(id) => {
        const selectedIDs = new Set(id);
        const selectedRowData = props.pais.filter((row) =>
          selectedIDs.has(row.id)
        );
        props.setSelectedRow(selectedRowData[0]);
        console.log(props.selectedRow);
      }}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5,10,20,50]}
    />
  );
}


