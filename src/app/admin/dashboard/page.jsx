"use client";
// pages/admin/dashboard.js
import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import AddLocationDialog from "./_components/AddLocationDialog";
import LocationTable from "./_components/LocationTable";
import CampaignTable from "./_components/CampaignTable";

const Dashboard = () => {
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Add New Location
      </Button>
      <LocationTable />
      <CampaignTable />
      <AddLocationDialog open={openDialog} onClose={handleCloseDialog} />
    </Box>
  );
};

export default Dashboard;
