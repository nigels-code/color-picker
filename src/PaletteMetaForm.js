import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

function PaletteMetaForm(props) {
  const { palettes, savePalette, handleHideForm } = props;
  const [newPaletteName, setNewPaletteName] = useState("");
  const [stage, setStage] = useState("form");
  const handleNewPaletteName = (evt) => setNewPaletteName(evt.target.value);
  const showEmojiPicker = () => setStage("emoji");
  const saveEmojiPalette = (emoji) => {
    savePalette({ paletteName: newPaletteName, emoji: emoji.native });
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
      <Dialog open={stage === "emoji"} onClose={handleHideForm}>
        <DialogTitle id='form-dialog-title'>Choose an Emoji</DialogTitle>
        <Picker title='Emoji' onSelect={saveEmojiPalette} />
      </Dialog>
      <Dialog
        open={stage === "form"}
        onClose={handleHideForm}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Choose A Palette Name</DialogTitle>
        <ValidatorForm onSubmit={showEmojiPicker}>
          <DialogContent>
            <DialogContentText>
              Please enter a name for your new palette. Make sure it's unique
            </DialogContentText>
            <TextValidator
              label='Palette Name'
              value={newPaletteName}
              name='paletteName'
              onChange={handleNewPaletteName}
              fullWidth
              margin='normal'
              validators={["required", "isPaletteNameUnique"]}
              errorMessages={["Enter Palette Name", "Name already used"]}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleHideForm} color='primary'>
              Cancel
            </Button>
            <Button variant='contained' color='primary' type='submit'>
              Save Palette
            </Button>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    </div>
  );
}
export default PaletteMetaForm;
