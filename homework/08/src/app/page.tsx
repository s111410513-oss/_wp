"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type GameData = {
  gameId: string;
  mode: "normal" | "challenge";
  max: number;
  difficulty: string;
  level?: number;
  attemptsLeft?: number;
  maxAttempts?: number;
  hintsLeft?: number;
  message: string;
};

type GuessData = {
  result: string;
  mode: "normal" | "challenge";
  message: string;
  attempts?: number;
  difficulty?: string;
  level?: number;
  max?: number;
  attemptsLeft?: number;
  maxAttempts?: number;
  hintsLeft?: number;
  cleared?: number;
  levelsCleared?: number;
  totalAttempts?: number;
};

const MODES = [
  { key: "normal", label: "一般模式", desc: "不限次數，越少越好" },
  { key: "challenge", label: "闖關模式", desc: "有限次數，逐關挑戰" },
] as const;

const NORMAL_DIFFS = [
  { key: "easy", label: "簡單", sub: "1-100" },
  { key: "hard", label: "困難", sub: "1-500" },
  { key: "extreme", label: "超困難", sub: "1-2000" },
] as const;

const CHALLENGE_DIFFS = [
  { key: "easy", label: "普通", sub: "" },
  { key: "hard", label: "困難", sub: "" },
  { key: "extreme", label: "極度困難", sub: "" },
] as const;

const HINTS = [
  { key: "oddEven", label: "奇數/偶數" },
  { key: "prime", label: "是否為質數" },
  { key: "range", label: "大約區間" },
] as const;

export default function HomePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [mode, setMode] = useState<"normal" | "challenge">("normal");
  const [difficulty, setDifficulty] = useState("easy");
  const [game, setGame] = useState<GameData | null>(null);
  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(false);

  const gameRef = useRef(game);
  gameRef.current = game;
  const guessRef = useRef(guess);
  guessRef.current = guess;
  const playerNameRef = useRef(playerName);
  playerNameRef.current = playerName;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;

  async function handleStartGame() {
    const name = playerNameRef.current.trim();
    if (!name) return;
    setLoading(true);
    try {
      const res = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: name, mode: modeRef.current, difficulty: difficultyRef.current }),
      });
      if (!res.ok) {
        setGame(null);
        return;
      }
      const data = await res.json();
      setGame(data);
      setGuess("");
    } catch {
      setGame(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitGuess() {
    const g = gameRef.current;
    const val = guessRef.current.trim();
    if (!g || !g.gameId || !val) return;
    setLoading(true);
    try {
      const res = await fetch("/api/game/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: g.gameId, guess: Number(val), playerName: playerNameRef.current.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGame((prev) => prev ? { ...prev, message: data.error || "發生錯誤" } : prev);
        setGuess("");
        setLoading(false);
        return;
      }

      if (data.result === "correct" || data.result === "gameover") {
        setGame({ ...g, message: data.message, gameId: "" });
      } else if (data.result === "levelup") {
        setGame({
          gameId: g.gameId,
          mode: "challenge",
          max: data.max!,
          difficulty: g.difficulty,
          level: data.level,
          attemptsLeft: data.attemptsLeft,
          maxAttempts: data.maxAttempts,
          hintsLeft: data.hintsLeft ?? g.hintsLeft,
          message: data.message,
        });
      } else {
        setGame((prev) => prev ? {
          ...prev,
          attemptsLeft: data.attemptsLeft ?? prev.attemptsLeft,
          hintsLeft: data.hintsLeft ?? prev.hintsLeft,
          message: data.message,
        } : prev);
      }
      setGuess("");
    } catch {
      setGame(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleUseHint(hintType: string) {
    const g = gameRef.current;
    if (!g || !g.gameId || g.mode !== "challenge") return;
    setLoading(true);
    try {
      const res = await fetch("/api/game/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId: g.gameId, hintType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGame((prev) => prev ? { ...prev, message: data.error || "無法使用提示" } : prev);
        setLoading(false);
        return;
      }
      setGame((prev) => prev ? { ...prev, hintsLeft: data.hintsLeft, message: data.message } : prev);
    } catch {
      setGame((prev) => prev ? { ...prev, message: "提示系統錯誤" } : prev);
    } finally {
      setLoading(false);
    }
  }

  function resetGame() {
    setGame(null);
    setGuess("");
  }

  const diffs = mode === "normal" ? NORMAL_DIFFS : CHALLENGE_DIFFS;
  const diffLabels: Record<string, string> = { easy: "#52c41a", hard: "#fa8c16", extreme: "#f5222d" };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem" }}>🔢 Number Guessing Game</h1>
      <p style={{ textAlign: "center", color: "#555" }}>
        {mode === "normal" ? "不限次數，越少 attempts 排名越高！" : "有限次數，逐關挑戰，看你能闖到第幾關！"}
      </p>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <button onClick={() => router.push("/leaderboard")} style={btnStyle}>🏆 Leaderboard</button>
      </div>

      {!game ? (
        <div style={cardStyle}>
          <h2>開始新遊戲</h2>
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="輸入你的名字"
            style={inputStyle}
            onKeyDown={(e) => e.key === "Enter" && handleStartGame()}
          />

          <div>
            <label style={{ fontWeight: 500, marginBottom: "0.3rem", display: "block" }}>遊戲模式</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => { setMode(m.key); setDifficulty("easy"); }}
                  style={{
                    ...btnStyle, flex: 1,
                    background: mode === m.key ? "#1677ff" : "#e0e0e0",
                    color: mode === m.key ? "white" : "#333",
                  }}
                >
                  {m.label}
                  <br /><small>{m.desc}</small>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 500, marginBottom: "0.3rem", display: "block" }}>
              {mode === "normal" ? "難度（範圍）" : "難度（嘗試次數）"}
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {(mode === "normal" ? NORMAL_DIFFS : CHALLENGE_DIFFS).map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  style={{
                    ...btnStyle, flex: 1,
                    background: difficulty === d.key ? "#1677ff" : "#e0e0e0",
                    color: difficulty === d.key ? "white" : "#333",
                  }}
                >
                  {d.label}
                  <br /><small>({d.sub})</small>
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleStartGame} disabled={loading || !playerName.trim()} style={btnStyle}>
            {loading ? "啟動中..." : "開始遊戲"}
          </button>
        </div>
      ) : (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <button onClick={resetGame} style={{
                background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem",
                color: "#888", padding: 0, fontWeight: 500,
              }}>← 大廳</button>
              <h2 style={{ margin: 0 }}>{playerName}</h2>
            </div>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              {game.mode === "challenge" && (
                <span style={{
                  background: "#722ed1", color: "white", padding: "0.2rem 0.6rem", borderRadius: 12,
                  fontSize: "0.75rem", fontWeight: 600,
                }}>Lv.{game.level}</span>
              )}
              <span style={{
                background: diffLabels[game.difficulty] || "#999", color: "white",
                padding: "0.2rem 0.6rem", borderRadius: 12, fontSize: "0.75rem", fontWeight: 600,
              }}>
                {game.mode === "challenge"
                  ? CHALLENGE_DIFFS.find((d) => d.key === game.difficulty)?.label || game.difficulty
                  : NORMAL_DIFFS.find((d) => d.key === game.difficulty)?.label || game.difficulty}
              </span>
            </div>
          </div>

          <p style={{ fontSize: "1.2rem", fontWeight: 500 }}>{game.message}</p>

          {game.gameId && (
            <>
              {game.mode === "challenge" && (
                <p style={{ color: "#722ed1", fontWeight: 600 }}>
                  剩餘嘗試：{game.attemptsLeft} / {game.maxAttempts} 次
                </p>
              )}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder={`輸入數字 (1-${game.max})`}
                  type="number" min={1} max={game.max}
                  style={{ ...inputStyle, flex: 1 }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmitGuess()}
                  disabled={loading}
                />
                <button onClick={handleSubmitGuess} disabled={loading || !guess.trim()} style={btnStyle}>
                  {loading ? "..." : "猜"}
                </button>
              </div>
              {game.mode === "challenge" && (
                <div>
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "#888", fontWeight: 500 }}>
                      💡 提示 ({game.hintsLeft ?? 0}/3)
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {HINTS.map((h) => (
                      <button
                        key={h.key}
                        onClick={() => handleUseHint(h.key)}
                        disabled={loading || (game.hintsLeft ?? 0) <= 0}
                        style={{
                          flex: 1, fontSize: "0.78rem", padding: "0.35rem 0.3rem",
                          background: "#f0f0f0", color: "#333", border: "1px solid #ddd",
                          borderRadius: 6, cursor: "pointer", fontWeight: 500,
                          opacity: (game.hintsLeft ?? 0) <= 0 ? 0.5 : 1,
                        }}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!game.gameId && (
            <button onClick={resetGame} style={btnStyle}>
              再玩一次
            </button>
          )}
        </div>
      )}
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: "white", borderRadius: 12, padding: "1.5rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "1rem",
};

const inputStyle: React.CSSProperties = {
  padding: "0.6rem 1rem", fontSize: "1rem", border: "1px solid #ccc", borderRadius: 8, outline: "none",
};

const btnStyle: React.CSSProperties = {
  padding: "0.6rem 1.2rem", fontSize: "1rem", background: "#1677ff",
  color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500,
};
