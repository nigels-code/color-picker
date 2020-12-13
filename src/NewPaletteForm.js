import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import PaletteFormNav from "./PaletteFormNav";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { withStyles } from "@material-ui/styles";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { ChromePicker } from "react-color";
import DraggableColorList from "./DraggableColorList";
import arrayMove from "array-move";

const drawerWidth = 400;

const styles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    height: "calc(100vh - 64px)",
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}));

function NewPaletteForm(props) {
  const defaultProps = {
    maxColors: 20
  };
  const { palettes } = props;
  const classes = styles();
  const [open, setOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState("red");
  const [newColorName, setNewColorName] = useState("");
  const [colors, setColors] = useState(palettes[0].colors);
  const paletteIsFull = colors.length >= defaultProps.maxColors;
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
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
  const isColorUnique = (newColor) => {
    return colors.every(({ color }) => color !== newColor);
  };
  const addRandomColor = () => {
    const allColors = palettes.map((p) => p.colors).flat();
    let rnd = Math.floor(Math.random() * allColors.length);
    let rndColor = allColors[rnd];
    while (!isColorUnique(rndColor.color)) {
      rnd = Math.floor(Math.random() * allColors.length);
      rndColor = allColors[rnd];
    }
    setCurrentColor(rndColor.color);
    setColors([...colors, rndColor]);
  };
  const handleNewColorName = (evt) => {
    setNewColorName(evt.target.value);
  };
  const savePalette = (newPaletteName) => {
    const newPalette = {
      paletteName: newPaletteName,
      id: newPaletteName.toLowerCase().replace(/ /g, "-"),
      colors: colors
    };
    props.savePalette(newPalette);
    props.history.push("/");
  };
  const removeColor = (colorName) => {
    setColors(colors.filter((color) => color.name !== colorName));
  };
  const clearColors = () => {
    setColors([]);
  };
  useEffect(() => {
    ValidatorForm.addValidationRule("isColorNameUnique", (value) =>
      colors.every(({ name }) => name.toLowerCase() !== value.toLowerCase())
    );
    ValidatorForm.addValidationRule("isColorUnique", (value) =>
      isColorUnique(currentColor)
    );
  });
  const onSortEnd = ({ oldIndex, newIndex }) => {
    setColors(() => arrayMove(colors, oldIndex, newIndex));
  };
  return (
    <div className={classes.root}>
      <PaletteFormNav
        open={open}
        classes={classes}
        handleDrawerOpen={handleDrawerOpen}
        savePalette={savePalette}
        palettes={palettes}
      />
      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor='left'
        open={open}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <Typography variant='h4'>Design Your Palette</Typography>
        <div>
          <Button variant='contained' color='secondary' onClick={clearColors}>
            Clear Palette
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={addRandomColor}
            disabled={paletteIsFull}
          >
            Random Color
          </Button>
        </div>
        <ChromePicker
          color={currentColor}
          onChangeComplete={handleChangeColor}
        />
        <ValidatorForm onSubmit={addNewColor}>
          <TextValidator
            value={newColorName}
            name='newColorName'
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
            style={{ backgroundColor: paletteIsFull ? "grey" : currentColor }}
          >
            {paletteIsFull ? "Palette Full" : "Add Color"}
          </Button>
        </ValidatorForm>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        <div className={classes.drawerHeader} />
        <DraggableColorList
          colors={colors}
          removeColor={removeColor}
          axis='xy'
          onSortEnd={onSortEnd}
        />
      </main>
    </div>
  );
}
export default withStyles(styles, { withTheme: true })(NewPaletteForm);
