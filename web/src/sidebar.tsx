import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Grid2,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion } from "framer-motion";
import Microphone from "./Microphone";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  text: string;
  textArea: HTMLTextAreaElement | HTMLElement;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, text, textArea }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState(text);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [_isFinal, setIsFinal] = useState(false);

  useEffect(() => {
    setInputText(text);
    setTranscript(null);
  }, [text]);

  const fetchRephrasedPrompts = async () => {
    setLoading(true);
    const finalInput = transcript && transcript.length > 0 ? transcript : inputText;
  
    if (!finalInput.trim()) {
      setLoading(false);
      return;
    }
  
   
    window.postMessage({ type: "FETCH_PROMPTS", prompt: finalInput }, "*");
  
  
    const handleResponse = (event: MessageEvent) => {
      if (event.data.type === "PROMPT_RESPONSE") {
        setSuggestions(event.data.data.suggestions || []);
        setLoading(false);
        window.removeEventListener("message", handleResponse);
      }
    };
  
    window.addEventListener("message", handleResponse);
  };
  

  const handleUsePrompt = (prompt: string) => {
    if (!textArea) return;

    if (textArea instanceof HTMLTextAreaElement) {
      textArea.value = prompt;
    } else {
      textArea.innerText = prompt;
    }
  };

  const handleCopy = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          p: 3,
          background: "rgba(20, 20, 20, 0.9)",
          backdropFilter: "blur(15px)",
          borderRadius: "15px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#fff",
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "#FFD700",
          }}
        >
          <AutoFixHighIcon />
          Enhance Your Prompt
        </Typography>
        <Grid2 container flexDirection={"row"} justifyContent={"space-around"}>
          <Grid2 size={10}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                marginBottom: "15px",
                flex: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#ddd",
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {transcript || inputText || "Type your prompt here..."}
              </Typography>
            </motion.div>
          </Grid2>
          <Grid2 size={2}>
            <Microphone setTranscript={setTranscript} setIsFinal={setIsFinal} />
          </Grid2>
        </Grid2>

        <Button
          variant="contained"
          color="primary"
          onClick={fetchRephrasedPrompts}
          fullWidth
          startIcon={<AutoFixHighIcon />}
          sx={{
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "16px",
            textTransform: "none",
            mt: 2,
            background: "#1976D2",
          }}
        >
          Rephrase Prompt
        </Button>

        {loading ? (
          <Typography
            sx={{
              mt: 3,
              textAlign: "center",
              fontStyle: "italic",
              color: "#aaa",
            }}
          >
            ✨ Generating better prompts...
          </Typography>
        ) : (
          suggestions.map((prompt, index) => (
            <Box
              key={index}
              sx={{
                mt: 3,
                p: 2,
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                backdropFilter: "blur(12px)",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Typography
                variant="body1"
                sx={{ color: "#fff", fontWeight: "500" }}
              >
                {prompt}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1,
                  mt: 2,
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleCopy(prompt)}
                  startIcon={<ContentCopyIcon />}
                  sx={{
                    color: "#ddd",
                    borderColor: "#ddd",
                    "&:hover": {
                      borderColor: "#fff",
                    },
                  }}
                >
                  Copy
                </Button>

                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleUsePrompt(prompt)}
                >
                  Use Prompt
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
