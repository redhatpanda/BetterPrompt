import { useState } from "react";
import Microphone from "./Microphone";

const App = () => {
  const [transcript, setTranscript] = useState('')
  const [isFinal, setIsFinal] = useState(false)
  {console.log(isFinal)}
  return (
    
    <div style={{height:"100%", width:"100%"}}>
      <Microphone setTranscript={setTranscript} setIsFinal={setIsFinal} />
      
      {transcript}
  </div>
  );
};

export default App;


