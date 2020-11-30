import React, { Component } from "react";
import ColorBox from "./ColorBox";
import "./Palette.css";
import { generatePalette } from "./colorHelpers";
import seedColors from "./seedColors";

class Palette extends Component {
  render() {
    console.log(generatePalette(seedColors[4]));
    const colorBoxes = this.props.colors.map((color) => (
      <ColorBox background={color.color} name={color.name} />
    ));
    return (
      <div className='Palette'>
        <div className='Palette-colors'>{colorBoxes}</div>
      </div>
    );
  }
}

export default Palette;
