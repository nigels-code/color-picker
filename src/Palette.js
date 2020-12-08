import React, { Component } from "react";
import ColorBox from "./ColorBox";
import Navbar from "./Navbar";
import { withStyles } from "@material-ui/styles";
import styles from "./styles/PaletteStyles";
import PaletteFooter from "./PaletteFooter";

class Palette extends Component {
  constructor(props) {
    super(props);
    this.state = { shade: 500, format: "hex" };
    this.changeShade = this.changeShade.bind(this);
    this.changeFormat = this.changeFormat.bind(this);
  }
  changeShade(shade) {
    this.setState({ shade });
  }
  changeFormat(format) {
    this.setState({ format });
  }
  render() {
    const { colors, paletteName, emoji, id } = this.props.palette;
    const { classes } = this.props;
    const { shade, format } = this.state;
    const colorBoxes = colors[shade].map((color) => (
      <ColorBox
        background={color[format]}
        name={color.name}
        key={color.id}
        id={color.id}
        paletteId={id}
        moreUrl={`/palette/${id}/${color.id}`}
        showLink
        showingFullPalette
      />
    ));
    return (
      <div className={classes.Palette}>
        <Navbar
          shade={shade}
          changeShade={this.changeShade}
          handleFormatChange={this.changeFormat}
          showingAllColors
        />
        <div className={classes.PaletteColors}>{colorBoxes}</div>
        <PaletteFooter paletteName={paletteName} emoji={emoji} />
      </div>
    );
  }
}
export default withStyles(styles)(Palette);
