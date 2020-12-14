import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";

function PaletteMetaForm(props) {
  const { palettes, savePalette } = props;
  const [open, setOpen] = React.useState(false);
  const [newPaletteName, setNewPaletteName] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleNewPaletteName = (evt) => {
    setNewPaletteName(evt.target.value);
  };
  useEffect(() => {
    ValidatorForm.addValidationRule("isPaletteNameUnique", (value) =>
      palettes.every(
        ({ paletteName }) => paletteName.toLowerCase() !== value.toLowerCase()
      )
    );
  });
  return (
    <div>
      <Button variant='outlined' color='primary' onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here.
            We will send updates occasionally.
          </DialogContentText>
          <ValidatorForm onSubmit={() => savePalette(newPaletteName)}>
            <TextValidator
              label='Palette Name'
              value={newPaletteName}
              name='paletteName'
              onChange={handleNewPaletteName}
              validators={["required", "isPaletteNameUnique"]}
              errorMessages={["Enter Palette Name", "Name already used"]}
            />
            <Button variant='contained' color='primary' type='submit'>
              Save Palette
            </Button>
          </ValidatorForm>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleClose} color='primary'>
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default PaletteMetaForm;