import { useFormik } from 'formik';
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import InputMask from 'react-input-mask';

import axios from '../axios';
import { useEffect, useState } from 'react';

const fields = {
  title: {
    type: 'text',
    label: 'Title',
    initialValue: '',
  },
  imageUrl: {
    type: 'text',
    label: 'Image URL',
    initialValue: '',
  },
  siteUrl: {
    type: 'text',
    label: 'Site URL',
    initialValue: '',
  },
  season: {
    type: 'number',
    label: 'Season',
    initialValue: 1,
    min: 0,
  },
  episode: {
    type: 'number',
    label: 'Episode',
    initialValue: 1,
    min: 0,
  },
  timecode: {
    type: 'string',
    label: 'Timecode',
    initialValue: '00:00:00',
    mask: '99:99:99',
  },
  status: {
    type: 'select',
    label: 'Status',
    options: ['TO_WATCH', 'WATCHING', 'FINISHED'],
    initialValue: 'TO_WATCH',
  },
  favorite: {
    type: 'checkbox',
    label: 'Favorite',
    initialValue: false,
  },
};

const initialValues = Object.entries(fields).reduce((prev, [key, value]) => {
  prev[key] = value.initialValue;
  return prev;
}, {});

function EditShow({ showId, open, onClose, onSubmit }) {
  const formik = useFormik({
    initialValues,
    onSubmit: (values) => onSubmit(showId, values),
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      Object.entries(initialValues).forEach(([key, value]) =>
        formik.setFieldValue(key, value)
      );
      return;
    }

    setLoading(true);

    axios({
      method: 'GET',
      url: `/shows/${showId}`,
    })
      .then((res) => {
        Object.keys(fields).map((key) =>
          formik.setFieldValue(
            key,
            res.data[key] !== undefined ? res.data[key] : initialValues[key]
          )
        );
      })
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Show</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit} id="add-show-form">
          {Object.entries(fields).map(([key, value]) => {
            const sx = { marginTop: '12px' };

            switch (value.type) {
              case 'number':
                return (
                  <FormControl fullWidth sx={sx} key={key}>
                    <TextField
                      type="number"
                      autoComplete="off"
                      min={value.min}
                      placeholder={value.label}
                      label={value.label}
                      name={key}
                      disabled={loading}
                      value={formik.values[key]}
                      onChange={formik.handleChange}
                    />
                  </FormControl>
                );

              case 'select':
                return (
                  <FormControl fullWidth sx={sx} key={key}>
                    <InputLabel id={`add-show-${key}-label`}>
                      {value.label}
                    </InputLabel>
                    <Select
                      label={value.label}
                      labelId={`add-show-${key}-label`}
                      name={key}
                      disabled={loading}
                      value={formik.values[key]}
                      onChange={formik.handleChange}
                    >
                      {value.options.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );

              case 'checkbox':
                return (
                  <FormControl fullWidth sx={sx} key={key}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          disabled={loading}
                          name={key}
                          checked={formik.values[key]}
                          onChange={formik.handleChange}
                        />
                      }
                      label={value.label}
                    />
                  </FormControl>
                );

              default:
                if (value.mask) {
                  return (
                    <FormControl fullWidth sx={sx} key={key}>
                      <InputMask
                        type="text"
                        name={key}
                        autoComplete="off"
                        placeholder={value.label}
                        value={formik.values[key]}
                        onChange={formik.handleChange}
                        mask={value.mask}
                        disabled={loading}
                      >
                        {(inputProps) => (
                          <TextField {...inputProps} label={value.label} />
                        )}
                      </InputMask>
                    </FormControl>
                  );
                } else {
                  return (
                    <FormControl fullWidth sx={sx} key={key}>
                      <TextField
                        type="text"
                        autoComplete="off"
                        placeholder={value.label}
                        label={value.label}
                        name={key}
                        disabled={loading}
                        value={formik.values[key]}
                        onChange={formik.handleChange}
                      />
                    </FormControl>
                  );
                }
            }
          })}
        </form>
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" form="add-show-form">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditShow;
