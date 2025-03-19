import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createRoot } from "react-dom/client";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        <IconButton onClick={onClose} sx={{ float: "right" }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Typed Text:
        </Typography>
        <Typography variant="body1">{  "No text entered yet."}</Typography>
      </Box>
    </Drawer>
  );
};

const sidebarContainer = document.createElement("div");
sidebarContainer.id = "mui-sidebar-root";
document.body.appendChild(sidebarContainer);

const sidebarRoot = createRoot(sidebarContainer);
sidebarRoot.render(<Sidebar open={false} onClose={function (): void {
    throw new Error("Function not implemented.");
} }  />);
export default Sidebar;


