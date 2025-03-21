import React, { useState, useEffect } from "react";
import { Fab, IconButton } from "@mui/material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CloseIcon from "@mui/icons-material/Close";
import Sidebar from "./sidebar";
import { motion } from "framer-motion";

interface FloatingButtonProps {
  textArea: HTMLTextAreaElement | HTMLElement;
  getContentEditableText?: (el: HTMLElement) => string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ textArea, getContentEditableText }) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let typingTimeout: number;
    localStorage.removeItem("hintDismissed");

    const handleTyping = () => {
      setIsTyping(true);
      clearTimeout(typingTimeout);
      typingTimeout = window.setTimeout(() => {
        setIsTyping(false);
        if (!localStorage.getItem("hintDismissed")) {
          setShowHint(true);
        }
      }, 1000);
    };

    textArea.addEventListener("input", handleTyping);

    return () => {
      textArea.removeEventListener("input", handleTyping);
      clearTimeout(typingTimeout);
    };
  }, [textArea]);

  const handleOpen = () => {
    const extractedText = getContentEditableText
      ? getContentEditableText(textArea as HTMLElement)
      : (textArea as HTMLTextAreaElement).value;

    setText(extractedText);
    setOpen(true);
  };

  const handleCloseHint = () => {
    setShowHint(false);
    localStorage.setItem("hintDismissed", "true");
  };

  return (
    <>
      {showHint && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            zIndex: 10000,
            backgroundColor: "#fff",
            padding: "10px 15px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ color: "#333", fontSize: "14px" }}>
            Hey! I can help you write a better prompt!
          </span>
          <IconButton size="small" onClick={handleCloseHint}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </motion.div>
      )}

      <motion.div
        animate={isTyping ? { rotate: 360 } : { scale: [1, 1.1, 1] }}
        transition={{ duration: isTyping ? 0.5 : 0.3, repeat: isTyping ? Infinity : 1 }}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 10000,
        }}
      >
        <Fab color="primary" onClick={handleOpen} size="small">
          {isTyping ? <AutorenewIcon /> : <AutoFixHighIcon />}
        </Fab>
      </motion.div>

      <Sidebar open={open} onClose={() => setOpen(false)} text={text} textArea={textArea} />
    </>
  );
};

export default FloatingButton;
