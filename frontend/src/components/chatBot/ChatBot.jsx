import { Webchat, WebchatProvider, Fab, getClient } from "@botpress/webchat";
import { buildTheme } from "@botpress/webchat-generator";
import { useState } from "react";
import "./ChatBot.css"
const { theme } = buildTheme({
  themeName: "prism",
  themeColor: "#634433",
});

//Add your Client ID here ⬇️
const clientId = process.env.REACT_APP_BOT_CLIENT_ID;

export default function App() {
  const client = getClient({ clientId });
  const [isWebchatOpen, setIsWebchatOpen] = useState(false);

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
  };

  return (
    <div className="chat-bot" style={{ width: 'fit-content', height: 'fit-content' }}>
    
      <WebchatProvider
        theme={theme}
        client={client}
      >
        <Fab onClick={toggleWebchat} />
        <div style={{ display: isWebchatOpen ? "block" : "none", }}>
          <Webchat />
        </div>
      </WebchatProvider>
    </div>
  );
}