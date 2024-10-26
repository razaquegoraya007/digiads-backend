// components/LocationTable.js
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";

const LocationTable = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/admin/location");
        const data = await response.json();

        if (response.ok) {
          setLocations(data);
        } else {
          toast.error("Failed to fetch locations.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching locations.");
      }
    };

    fetchLocations();
  }, []);

  const handleStatusToggle = async (locationId, currentStatus) => {
    const newStatus = currentStatus === "available" ? "booked" : "available";

    try {
      const response = await fetch("/api/admin/location/update_status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: locationId, status: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setLocations((prevLocations) =>
          prevLocations.map((loc) =>
            loc._id === locationId ? { ...loc, status: newStatus } : loc
          )
        );
        toast.success(data.message);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("An error occurred while updating the status.");
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Locations
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Identifier</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Latitude</TableCell>
              <TableCell>Longitude</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location._id}>
                <TableCell>{location.identifier}</TableCell>
                <TableCell>{location.description}</TableCell>
                <TableCell>{location.latitude}</TableCell>
                <TableCell>{location.longitude}</TableCell>
                <TableCell>{location.address}</TableCell>
                <TableCell>{location.size}</TableCell>
                <TableCell>
                  <Switch
                    checked={location.status === "booked"}
                    onChange={() =>
                      handleStatusToggle(location._id, location.status)
                    }
                    color="primary"
                  />
                  {location.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default LocationTable;
