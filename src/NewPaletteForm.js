import React, { useState } from 'react';
import clsx from 'clsx';
import { withStyles } from '@material-ui/styles';
import PaletteFormNav from './PaletteFormNav';
import ColorPickerForm from './ColorPickerForm';
import seedColors from './seedColors';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DraggableColorList from './DraggableColorList';
import arrayMove from 'array-move';
import styles from './styles/NewPaletteFormStyles';

function NewPaletteForm(props) {
  const defaultProps = {
    maxColors: 20
  };
  const { palettes } = props;
  const classes = styles();
  const [open, setOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState('teal');
  const [colors, setColors] = useState(seedColors[0].colors);
  const paletteIsFull = colors.length >= defaultProps.maxColors;
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
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
  const savePalette = (newPalette) => {
    newPalette.id = newPalette.paletteName.toLowerCase().replace(/ /g, '-');
    newPalette.colors = colors;
    props.savePalette(newPalette);
    props.history.push('/');
  };
  const removeColor = (colorName) => {
    setColors(colors.filter((color) => color.name !== colorName));
  };
  const clearColors = () => {
    setColors([]);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setColors(() => arrayMove(colors, oldIndex, newIndex));
  };
  return (
    <div className={classes.root}>
      <PaletteFormNav
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        savePalette={savePalette}
        palettes={palettes}
      />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
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
        <div className={classes.container}>
          <Typography variant="h4" gutterBottom>
            Design Your Palette
          </Typography>
          <div className={classes.buttons}>
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={clearColors}
            >
              Clear Palette
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={addRandomColor}
              disabled={paletteIsFull}
            >
              Random Color
            </Button>
          </div>
          <ColorPickerForm
            paletteIsFull={paletteIsFull}
            setColors={setColors}
            colors={colors}
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
            isColorUnique={isColorUnique}
          />
        </div>
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
          axis="xy"
          onSortEnd={onSortEnd}
        />
      </main>
    </div>
  );
}
export default NewPaletteForm;
// export default withStyles(styles, { withTheme: true })(NewPaletteForm);
