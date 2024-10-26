// components/AddLocationDialog.js
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";

const AddLocationDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    identifier: "",
    description: "",
    latitude: "",
    longitude: "",
    address: "",
    size: "",
    status: "available",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/admin/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        onClose();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred while adding the location.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Location</DialogTitle>
      <DialogContent>
        <TextField
          label="Identifier"
          name="identifier"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
        <TextField
          label="Description"
          name="description"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
        <TextField
          label="Latitude"
          name="latitude"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
        <TextField
          label="Longitude"
          name="longitude"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
        <TextField
          label="Address"
          name="address"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
        <TextField
          label="Size"
          name="size"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
        <TextField
          label="Status"
          name="status"
          fullWidth
          margin="dense"
          onChange={handleChange}
          select
          SelectProps={{ native: true }}
        >
          <option value="available">Available</option>
          <option value="booked">Booked</option>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLocationDialog;
