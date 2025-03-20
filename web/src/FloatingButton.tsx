import React, { useState } from "react";
import { Fab } from "@mui/material";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Sidebar from "./sidebar";

interface FloatingButtonProps {
  textArea: HTMLTextAreaElement;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ textArea }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleOpen = () => {
    setText(textArea.value); // ✅ Capture text from text area
    setOpen(true);
  };

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: "absolute",
          top: "-40px", // ✅ Floats above the text area
          right: "5px",
          zIndex: 10000,
        }}
        onClick={handleOpen}
      >
        <TextSnippetIcon />
      </Fab>
      <Sidebar open={open} onClose={() => setOpen(false)} text={text} textArea={textArea} />
    </>
  );
};

export default FloatingButton;
