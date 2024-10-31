import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";

function CampaignTable() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    const response = await axios.get("/api/admin/campaign");
    if (response.status == 200) {
      toast.success("Campaign updated.");
    }
    setCampaigns(response.data.data);
  };

  const handleStatusChange = (event, campaign) => {
    const status = event.target.value;
    if (status === "rejected") {
      setSelectedCampaign(campaign);
      setShowModal(true);
    } else {
      updateCampaignStatus(campaign._id, { status });
    }
  };

  const updateCampaignStatus = async (id, data) => {
    await axios.put(`/api/admin/campaign/${id}`, data);
    fetchCampaigns();
    if (showModal) {
      setShowModal(false);
    }
  };

  const handleRejectionSubmit = async () => {
    if (rejectionReason.trim()) {
      await updateCampaignStatus(selectedCampaign._id, {
        status: "rejected",
        rejection_reason: rejectionReason,
      });
      setRejectionReason("");
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRejectionReason("");
  };

  return (
    <div>
      <h2>Campaigns</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Campaign Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Video URL</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign._id}>
                <TableCell>{campaign.user?.name}</TableCell>
                <TableCell>{campaign.name}</TableCell>
                <TableCell>{campaign.description}</TableCell>
                <TableCell>{campaign.location?.identifier}</TableCell>
                <TableCell>{campaign.status}</TableCell>
                <TableCell>
                  <a href={campaign.video_url}>Video Url</a>
                </TableCell>
                <TableCell>
                  <Select
                    value={campaign.status}
                    onChange={(event) => handleStatusChange(event, campaign)}
                    fullWidth
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={showModal} onClose={handleCloseModal}>
        <DialogTitle>Enter Rejection Reason</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason"
            type="text"
            fullWidth
            variant="outlined"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleRejectionSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CampaignTable;
