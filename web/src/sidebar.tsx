import React, { useEffect, useState } from "react";
import { Drawer, Box, Typography, IconButton, Button, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  text: string;
  textArea: HTMLTextAreaElement; // ✅ Ensure textArea is correctly used
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, text, textArea }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState(text);

  useEffect(() => {
    setInputText(text);
  }, [text]);

  const fetchRephrasedPrompts = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:7071/api/AnalyzePrompt", {
        prompt: inputText,
      });
      setSuggestions([
        response.data.rephrasedPrompt1,
        response.data.rephrasedPrompt2,
        response.data.rephrasedPrompt3,
      ]);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
    setLoading(false);
  };

  // ✅ Use this function to insert rephrased text back into the text area
  const handleUsePrompt = (prompt: string) => {
    if (textArea) {
      textArea.value = prompt; // ✅ Sets the text inside the original text area
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 350, p: 3 }}>
        <IconButton onClick={onClose} sx={{ float: "right" }}>
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" gutterBottom>
          Enhance Your Prompt
        </Typography>

        <TextField
          fullWidth
          multiline
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button variant="contained" color="primary" onClick={fetchRephrasedPrompts} fullWidth>
          Rephrase Prompt
        </Button>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          suggestions.map((prompt, index) => (
            <Box key={index} sx={{ mt: 2, p: 2, border: "1px solid #ccc", borderRadius: "5px" }}>
              <Typography variant="body1">{prompt}</Typography>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => handleUsePrompt(prompt)} // ✅ New function to insert text
                sx={{ mt: 1 }}
              >
                Use Prompt
              </Button>
            </Box>
          ))
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
