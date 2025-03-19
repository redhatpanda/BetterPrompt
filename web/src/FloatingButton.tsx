import React, { useState } from "react";
import { Fab } from "@mui/material";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Sidebar from "./sidebar";

const FloatingButton: React.FC = () => {
  const [open, setOpen] = useState(false);

 

  return (
    <>
      { (
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1000000000,
          }}
          onClick={() => setOpen(true)}
        >
          <TextSnippetIcon />
        </Fab>
      )}
      <Sidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default FloatingButton;
