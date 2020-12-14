import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/styles";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { ChromePicker } from "react-color";

const styles = {
  picker: {
    width: "100% !important",
    marginTop: "2rem"
  },
  addColor: {
    width: "100%",
    padding: "1rem",
    marginTop: "1rem",
    fontSize: "2rem"
  },
  colorNameInput: {
    width: "100%",
    height: "70px"
  }
};

function ColorPickerForm(props) {
  const {
    classes,
    paletteIsFull,
    setColors,
    colors,
    currentColor,
    setCurrentColor,
    isColorUnique
  } = props;
  const [newColorName, setNewColorName] = useState("");
  const handleChangeColor = (newColor) => {
    setCurrentColor(newColor.hex);
  };
  const addNewColor = () => {
    const newColor = {
      color: currentColor,
      name: newColorName
    };
    setColors([...colors, newColor]);
    setNewColorName("");
  };
  const handleNewColorName = (evt) => {
    setNewColorName(evt.target.value);
  };
  useEffect(() => {
    ValidatorForm.addValidationRule("isColorNameUnique", (value) =>
      colors.every(({ name }) => name.toLowerCase() !== value.toLowerCase())
    );
    ValidatorForm.addValidationRule("isColorUnique", (value) =>
      isColorUnique(currentColor)
    );
  });
  return (
    <div>
      <ChromePicker
        className={classes.picker}
        color={currentColor}
        onChangeComplete={handleChangeColor}
      />
      <ValidatorForm onSubmit={addNewColor}>
        <TextValidator
          value={newColorName}
          className={classes.colorNameInput}
          placeholder='Color Name'
          name='newColorName'
          variant='filled'
          margin='normal'
          onChange={handleNewColorName}
          validators={["required", "isColorNameUnique", "isColorUnique"]}
          errorMessages={[
            "Enter a color name",
            "Color name must be unique",
            "Color already used"
          ]}
        />
        <Button
          variant='contained'
          type='submit'
          color='primary'
          disabled={paletteIsFull}
          className={classes.addColor}
          style={{ backgroundColor: paletteIsFull ? "grey" : currentColor }}
        >
          {paletteIsFull ? "Palette Full" : "Add Color"}
        </Button>
      </ValidatorForm>
    </div>
  );
}
export default withStyles(styles)(ColorPickerForm);
