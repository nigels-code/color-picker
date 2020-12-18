import React, { useState } from "react";
import MiniPalette from "./MiniPalette";
import { withStyles } from "@material-ui/styles";
import styles from "./styles/PaletteListStyles";
import { Link } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function PaletteList(props) {
  const { palettes, classes, deletePalette } = props;
  const goToPalette = (id) => {
    props.history.push(`/palette/${id}`);
  };
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const openDialog = (id) => {
    setOpenDeleteDialog(true);
    setDeleteId(id);
  };
  const closeDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteId("");
  };
  const handleDelete = () => {
    deletePalette(deleteId);
    closeDialog();
  };
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <nav className={classes.nav}>
          <h1>Palettes</h1>
          <Link to='/palette/new'>
            <h1>Create New Palette</h1>
          </Link>
        </nav>
        <TransitionGroup className={classes.palettes}>
          {palettes.map((palette) => (
            <CSSTransition key={palette.id} classNames='fade' timeout={500}>
              <MiniPalette
                {...palette}
                key={palette.id}
                handleClick={goToPalette}
                id={palette.id}
                openDialog={openDialog}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      <Dialog
        open={openDeleteDialog}
        aria-labelledby='delete-dialog-title'
        onClose={closeDialog}
      >
        <DialogTitle id='delete-dialog-title'>Delete Palette</DialogTitle>
        <List>
          <ListItem button onClick={handleDelete}>
            <ListItemAvatar>
              <Avatar style={{ backgroundColor: blue[100], color: blue[600] }}>
                <CheckIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Delete' />
          </ListItem>
          <ListItem button onClick={closeDialog}>
            <ListItemAvatar>
              <Avatar style={{ backgroundColor: red[100], color: red[600] }}>
                <CloseIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='Cancel' />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}

export default withStyles(styles)(PaletteList);
