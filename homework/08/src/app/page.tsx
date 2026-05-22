"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DIFFICULTIES = [
  { key: "easy", label: "Easy", range: "1-100" },
  { key: "hard", label: "Hard", range: "1-500" },
  { key: "extreme", label: "Extreme", range: "1-2000" },
] as const;

export default function HomePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [gameId, setGameId] = useState<string | null>(null);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [max, setMax] = useState(100);

  const diff = DIFFICULTIES.find((d) => d.key === difficulty)!;

  async function startGame() {
    if (!playerName.trim()) return;
    setLoading(true);
    const res = await fetch("/api/game/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerName: playerName.trim(), difficulty }),
    });
    const data = await res.json();
    setGameId(data.gameId);
    setMax(data.max);
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
        Guess the number. Fewer attempts = better rank!
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
          <div>
            <label style={{ fontWeight: 500, marginBottom: "0.3rem", display: "block" }}>Difficulty</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  style={{
                    ...btnStyle,
                    flex: 1,
                    background: difficulty === d.key ? "#1677ff" : "#e0e0e0",
                    color: difficulty === d.key ? "white" : "#333",
                  }}
                >
                  {d.label}
                  <br />
                  <small>({d.range})</small>
                </button>
              ))}
            </div>
          </div>
          <button onClick={startGame} disabled={loading || !playerName.trim()} style={btnStyle}>
            {loading ? "Starting..." : "Start Game"}
          </button>
        </div>
      ) : (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>Playing as {playerName}</h2>
            <span style={{
              background: difficulty === "easy" ? "#52c41a" : difficulty === "hard" ? "#fa8c16" : "#f5222d",
              color: "white",
              padding: "0.2rem 0.6rem",
              borderRadius: 12,
              fontSize: "0.75rem",
              fontWeight: 600,
            }}>
              {diff.label} (1-{max})
            </span>
          </div>
          <p style={{ fontSize: "1.2rem", fontWeight: 500 }}>{message}</p>
          {!gameOver && (
            <>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder={`Your guess (1-${max})`}
                  type="number"
                  min={1}
                  max={max}
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
