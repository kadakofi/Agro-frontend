import * as React from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import axios from 'axios';
import { SiteProps } from "../dashboard/SiteProps";

const columns = [
  { field: 'id', headerName: 'ID', width: 90, type: 'number' },
  { field: 'tipoIdentificacionId', headerName: 'Tipo Identificación', width: 150, type: 'number',
    valueGetter: (params) => params.row.tipoIdentificacionId === 1 ? 'Cédula' : 'Pasaporte' },
  { field: 'identificacion', headerName: 'Identificación', width: 150, type: 'string' },
  { field: 'nombre', headerName: 'Nombre', width: 150, type: 'string' },
  { field: 'apellido', headerName: 'Apellido', width: 200, type: 'string' },
  { field: 'genero', headerName: 'Género', width: 100, type: 'string',
    valueGetter: (params) => params.row.genero ? 'Femenino' : 'Masculino' },
  { field: 'fechaNacimiento', headerName: 'Fecha de Nacimiento', width: 200, type: 'datetime' },
  { field: 'estrato', headerName: 'Estrato', width: 100, type: 'number' },
  { field: 'direccion', headerName: 'Dirección', width: 250, type: 'string' },
  { field: 'celular', headerName: 'Celular', width: 150, type: 'string' },
  { field: 'estado', headerName: 'Estado', width: 100, type: 'string',
    valueGetter: (params) => params.row.estado === 1 ? 'Activo' : 'Inactivo' },
];

export default function GridPersona(props) {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [rowCount, setRowCount] = React.useState(0);
  const [sortModel, setSortModel] = React.useState([]);
  const [filterModel, setFilterModel] = React.useState({ items: [] });
  
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 2,
    page: 0,
  });

  const fetchData = async (page, pageSize, sortModel, filterModel) => {
    setLoading(true);
    try {
      const baseURL = `${SiteProps.urlbasev1}/persona`;

      const filterParams = filterModel.items.length > 0 ? {
        [filterModel.items[0]?.columnField]: filterModel.items[0]?.value
      } : {};

      const response = await axios.get(baseURL, {
        params: {
          page: page + 1,
          size: pageSize,
          sortBy: sortModel[0]?.field || '',
          sortDirection: sortModel[0]?.sort || 'asc',
          ...filterParams
        },
      });

      setData(response.data?.data || []);
      setRowCount(response.data?.header?.totalElements || 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData(paginationModel.page, paginationModel.pageSize, sortModel, filterModel);
  }, [paginationModel, sortModel, filterModel]);

  const handlePaginationModelChange = (model) => {
    setPaginationModel(model);
    fetchData(model.page, model.pageSize, sortModel, filterModel);
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
      </GridToolbarContainer>
    );
  }

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={data || []}
        columns={columns}
        rowCount={rowCount}
        loading={loading}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        sortingMode="server"
        onSortModelChange={(model) => setSortModel(model)}
        filterMode="server"
        onFilterModelChange={(model) => setFilterModel(model)}
        pageSizeOptions={[2, 4, 6,8, 10]}
        components={{
          Toolbar: CustomToolbar,
        }}
      />
    </div>
  );
}