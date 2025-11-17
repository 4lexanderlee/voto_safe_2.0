import { useState } from "react";

interface Message {
  sender: "user" | "ia";
  text: string;
}

export default function ChatWidget({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  // 📌 Respuestas automáticas mejoradas
  const getAIResponse = (text: string): string => {
    const msg = text.toLowerCase();

    if (msg.includes("hola") || msg.includes("buenas")) {
      return "¡Hola! ¿Cómo estás?";
    }

    if (msg.includes("ayuda") || msg.includes("ayudame") || msg.includes("ayudar")) {
      return "Claro, ¿en qué puedo ayudarte?";
    }

    if (msg.includes("adios") || msg.includes("me despido") || msg.includes("hasta luego") || msg.includes("chau")) {
      return "Fue un gusto hablar contigo, ¡Hasta pronto!";
    }

    //  Respuesta genérica elegida: Opción A
    return "Entiendo, sigue contándome.";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = inputValue;

    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInputValue("");

    setTimeout(() => {
      const response = getAIResponse(userMsg);
      setMessages((prev) => [...prev, { sender: "ia", text: response }]);
    }, 600);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "80px",
      right: "20px",
      width: "300px",
      height: "400px",
      backgroundColor: "white",
      borderRadius: "15px",
      boxShadow: "0 2px 5px rgba(0,5,30,0.9)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      zIndex: 999
    }}>
      
      {/* Header */}
      <div style={{
        backgroundColor: "#0f366d",
        color: "white",
        padding: "10px",
        fontWeight: "bold",
        display: "flex",
        justifyContent: "space-between"
      }}>
        Chat IA
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "18px"
          }}
        >
          ✖
        </button>
      </div>

      {/* Mensajes */}
      <div style={{
        flex: 1,
        padding: "10px",
        overflowY: "auto",
        backgroundColor: "#eaf2fc"
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: "10px" }}>
            <div style={{
              display: "inline-block",
              backgroundColor: msg.sender === "user" ? "#0f366d" : "#d4e4ff",
              color: msg.sender === "user" ? "white" : "black",
              padding: "8px 12px",
              borderRadius: "12px",
              maxWidth: "80%"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: "flex", padding: "10px", gap: "5px" }}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribe..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #aaa",
            color: "black" // ← ahora sí se ve al escribir
          }}
        />
        <button
          onClick={handleSend}
          style={{
            backgroundColor: "#0f366d",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
