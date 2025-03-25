/**
 * @file FormRegistroPersona.jsx
 * @module FormRegistroPersona
 * @description Formulario para registrar una nueva persona y, si corresponde, redirigir al formulario de empresa. Se conecta a la API para guardar los datos.
 * @author Karla
 */

import * as React from 'react';
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
  Container
} from '@mui/material';
import { SiteProps } from '../dashboard/SiteProps';
import axios from '../axiosConfig';
import FormRegistroEmpresa from './FormRegistroEmpresa';

/**
 * @typedef {Object} PersonaRow
 * @property {string} nombre
 * @property {string} apellido
 * @property {number} tipoIdentificacionId
 * @property {string} identificacion
 * @property {string} genero
 * @property {string} fechaNacimiento
 * @property {number} estrato
 * @property {string} direccion
 * @property {string} celular
 * @property {number} estado
 */

/**
 * @typedef {Object} FormRegistroPersonaProps
 * @property {PersonaRow} [selectedRow] - Datos preexistentes para llenar el formulario
 * @property {Function} setCurrentModule - Función para cambiar el componente mostrado (recibe un componente JSX como parámetro)
 */

/**
 * Componente FormRegistroPersona.
 *
 * @param {FormRegistroPersonaProps} props - Propiedades del componente
 * @returns {JSX.Element}
 */
export default function FormRegistroPersona(props) {
  const url = `${SiteProps.urlbasev1}/personas/persona-usuario`;

  /**
   * Maneja el envío del formulario y llama a la API.
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    console.log('formJson __', formJson);

    axios.post(url, formJson)
      .then((response) => {
        console.log('Persona creada con éxito:', response.data);

        const usuarioEstado = response.data.usuarioEstado;
        if (usuarioEstado === 3) {
          props.setCurrentModule(<FormRegistroEmpresa setCurrentModule={props.setCurrentModule} />);
        }
      })
      .catch((error) => {
        console.error('Error al crear la persona:', error);
      });
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFF',
        padding: 3,
        mt: 55,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          padding: 4,
          backgroundColor: 'white',
          borderRadius: 4,
          boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" component="h2" gutterBottom>
            Formulario Persona
          </Typography>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="nombre"
              name="nombre"
              label="Nombre"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.nombre || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="apellido"
              name="apellido"
              label="Apellido"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.apellido || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel
              id="tipoIdentificacionId-label"
              sx={{ backgroundColor: 'white', padding: '0 8px' }}
            >
              Tipo de Identificación
            </InputLabel>
            <Select
              labelId="tipoIdentificacionId-label"
              id="tipoIdentificacionId"
              name="tipoIdentificacionId"
              defaultValue={props.selectedRow?.tipoIdentificacionId || ''}
              fullWidth
              label="Tipo de Identificación"
            >
              <MenuItem value={1}>Cédula</MenuItem>
              <MenuItem value={2}>Pasaporte</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="identificacion"
              name="identificacion"
              label="Número de Identificación"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.identificacion || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel
              id="genero-label"
              sx={{ backgroundColor: 'white', padding: '0 8px' }}
            >
              Género
            </InputLabel>
            <Select
              labelId="genero-label"
              id="genero"
              name="genero"
              defaultValue={props.selectedRow?.genero || 'm'}
              fullWidth
            >
              <MenuItem value="m">Masculino</MenuItem>
              <MenuItem value="f">Femenino</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="fechaNacimiento"
              name="fechaNacimiento"
              label="Fecha de Nacimiento"
              type="date"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.fechaNacimiento || ''}
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="estrato"
              name="estrato"
              label="Estrato"
              type="number"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.estrato || 0}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="direccion"
              name="direccion"
              label="Dirección"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.direccion || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              required
              id="celular"
              name="celular"
              label="Celular"
              fullWidth
              variant="standard"
              defaultValue={props.selectedRow?.celular || ''}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel
              id="estado-label"
              sx={{ backgroundColor: 'white', padding: '0 8px' }}
            >
              Estado
            </InputLabel>
            <Select
              labelId="estado-label"
              id="estado"
              name="estado"
              defaultValue={props.selectedRow?.estado || 0}
              fullWidth
            >
              <MenuItem value={0}>Inactivo</MenuItem>
              <MenuItem value={1}>Activo</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Guardar
          </Button>
        </form>
      </Box>
    </Container>
  );
}
