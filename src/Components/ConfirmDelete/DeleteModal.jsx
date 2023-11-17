/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const DeleteModal = ({handleCloseDelete}) => {
  return (
    <Dialog maxWidth="sm" fullWidth>
      <DialogTitle>Confirm the action</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={()=>{handleCloseDelete()}}>
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>some message here</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained">
          Cancel
        </Button>
        <Button color="secondary" variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;