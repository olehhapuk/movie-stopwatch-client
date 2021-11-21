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

function AddShow({ open, onClose, onSubmit }) {
  const formik = useFormik({
    initialValues,
    onSubmit,
  });

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Show</DialogTitle>
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
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddShow;
