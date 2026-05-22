"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [gameId, setGameId] = useState<string | null>(null);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);

  async function startGame() {
    if (!playerName.trim()) return;
    setLoading(true);
    const res = await fetch("/api/game/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName: playerName.trim() }),
    });
    const data = await res.json();
    setGameId(data.gameId);
    setMessage(data.message);
    setGuess("");
    setAttempts(0);
    setGameOver(false);
    setLoading(false);
  }

  async function submitGuess() {
    if (!gameId || !guess.trim()) return;
    setLoading(true);
    const res = await fetch("/api/game/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, guess: Number(guess), playerName: playerName.trim() }),
    });
    const data = await res.json();
    setAttempts(data.attempts);
    setMessage(data.message);
    if (data.result === "correct") {
      setGameOver(true);
    }
    setGuess("");
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem" }}>🔢 Number Guessing Game</h1>
      <p style={{ textAlign: "center", color: "#555" }}>
        Guess a number between 1 and 100. Fewer attempts = better rank!
      </p>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <button onClick={() => router.push("/leaderboard")} style={btnStyle}>
          🏆 Leaderboard
        </button>
      </div>

      {!gameId ? (
        <div style={cardStyle}>
          <h2>Start a New Game</h2>
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            style={inputStyle}
            onKeyDown={(e) => e.key === "Enter" && startGame()}
          />
          <button onClick={startGame} disabled={loading || !playerName.trim()} style={btnStyle}>
            {loading ? "Starting..." : "Start Game"}
          </button>
        </div>
      ) : (
        <div style={cardStyle}>
          <h2>Playing as {playerName}</h2>
          <p style={{ fontSize: "1.2rem", fontWeight: 500 }}>{message}</p>
          {!gameOver && (
            <>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Your guess (1-100)"
                  type="number"
                  min={1}
                  max={100}
                  style={{ ...inputStyle, flex: 1 }}
                  onKeyDown={(e) => e.key === "Enter" && submitGuess()}
                  disabled={loading}
                />
                <button onClick={submitGuess} disabled={loading || !guess.trim()} style={btnStyle}>
                  {loading ? "..." : "Guess"}
                </button>
              </div>
              <p style={{ color: "#666", marginTop: "0.5rem" }}>Attempts: {attempts}</p>
            </>
          )}
          {gameOver && (
            <button onClick={() => setGameId(null)} style={btnStyle}>
              Play Again
            </button>
          )}
        </div>
      )}
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: "white",
  borderRadius: 12,
  padding: "1.5rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const inputStyle: React.CSSProperties = {
  padding: "0.6rem 1rem",
  fontSize: "1rem",
  border: "1px solid #ccc",
  borderRadius: 8,
  outline: "none",
};

const btnStyle: React.CSSProperties = {
  padding: "0.6rem 1.2rem",
  fontSize: "1rem",
  background: "#1677ff",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 500,
};
