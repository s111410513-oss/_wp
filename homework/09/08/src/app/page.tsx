"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { playCorrect, playWrong, playLevelUp, playGameOver, playTimeout, playHint } from "@/lib/sound";

type GameData = {
  gameId: string;
  mode: "normal" | "challenge";
  max: number;
  difficulty: string;
  level?: number;
  attempts?: number;
  attemptsLeft?: number;
  maxAttempts?: number;
  hintsLeft?: number;
  totalAttempts?: number;
  startedAt: number;
  message: string;
  temperatureLabel?: string;
  temperatureColor?: string;
  distance?: number;
  hintMessage?: string;
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

type ResultData = {
  mode: "normal" | "challenge";
  difficulty: string;
  message: string;
  attempts?: number;
  levelsCleared?: number;
  totalAttempts?: number;
  hintsLeft?: number;
};

const MODES = [
  { key: "normal", label: "一般模式", desc: "不限次數，越少越好" },
  { key: "challenge", label: "闖關模式", desc: "有限次數，逐關挑戰" },
] as const;

const NORMAL_DIFFS = [
  { key: "easy", label: "簡單", sub: "0-100" },
  { key: "hard", label: "困難", sub: "0-500" },
  { key: "extreme", label: "超困難", sub: "0-2000" },
  { key: "custom", label: "自訂", sub: "自訂範圍" },
] as const;

const CHALLENGE_DIFFS = [
  { key: "easy", label: "普通", sub: "18 次起" },
  { key: "hard", label: "困難", sub: "12 次起" },
  { key: "extreme", label: "極度困難", sub: "10 次起" },
] as const;

const HINTS = [
  { key: "oddEven", label: "奇數/偶數" },
  { key: "halfRange", label: "大小區間" },
  { key: "lastDigit", label: "個位數字" },
] as const;

export default function HomePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [mode, setMode] = useState<"normal" | "challenge">("normal");
  const [difficulty, setDifficulty] = useState("easy");
  const [game, setGame] = useState<GameData | null>(null);
  const [guess, setGuess] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [idleTime, setIdleTime] = useState(0);
  const [idleWarning, setIdleWarning] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [customMax, setCustomMax] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState<"register" | "login" | null>(null);
  const [authUser, setAuthUser] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authMsg, setAuthMsg] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [showTitles, setShowTitles] = useState(false);
  const [unlockedTitles, setUnlockedTitles] = useState<string[]>([]);
  const [newUnlocks, setNewUnlocks] = useState<string[]>([]);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [guessHistory, setGuessHistory] = useState<{value: number; level: number}[]>([]);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("ng_login");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setPlayerName(data.playerName || "");
        setUserTitle(data.userTitle || "");
        setIsLoggedIn(data.isLoggedIn || false);
        setUnlockedTitles(data.unlockedTitles || []);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const t = document.documentElement.dataset.theme || "light";
    setTheme(t);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      localStorage.setItem("ng_login", JSON.stringify({
        playerName, userTitle, isLoggedIn, unlockedTitles,
      }));
    } else {
      localStorage.removeItem("ng_login");
    }
  }, [isLoggedIn, playerName, userTitle, unlockedTitles]);

  const inputRef = useRef<HTMLInputElement>(null);
  const gameRef = useRef(game);
  gameRef.current = game;
  const idleTimedOutRef = useRef(false);
  const guessRef = useRef(guess);
  guessRef.current = guess;
  const playerNameRef = useRef(playerName);
  playerNameRef.current = playerName;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const difficultyRef = useRef(difficulty);
  difficultyRef.current = difficulty;
  const customMaxRef = useRef(customMax);
  customMaxRef.current = customMax;
  const isLoggedInRef = useRef(isLoggedIn);
  isLoggedInRef.current = isLoggedIn;
  const userTitleRef = useRef(userTitle);
  userTitleRef.current = userTitle;

  useEffect(() => {
    if (!game || !game.startedAt || !game.gameId) return;
    const interval = setInterval(() => {
      const timeLimit = gameRef.current!.mode === "challenge" ? 300000 : 600000;
      const remaining = Math.max(0, Math.floor((gameRef.current!.startedAt + timeLimit - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0 && gameRef.current?.gameId) {
        const g = gameRef.current;
        playTimeout();
        setResult({
          mode: g.mode,
          difficulty: g.difficulty,
          message: "⏰ 時間到！遊戲已結束。",
          attempts: g.mode === "normal" ? g.attempts : undefined,
          levelsCleared: g.mode === "challenge" ? (g.level ?? 1) - 1 : undefined,
          totalAttempts: g.totalAttempts,
          hintsLeft: g.hintsLeft,
        });
        setGame(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [game]);

  useEffect(() => {
    if (game !== null) {
      idleTimedOutRef.current = false;
      setIdleTime(0);
      setIdleWarning(false);
      return;
    }
    if (idleTimedOutRef.current) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setIdleTime(elapsed);
      if (elapsed >= 120) setIdleWarning(true);
      if (elapsed >= 180) {
        idleTimedOutRef.current = true;
        forceReset();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [game]);

  useEffect(() => {
    if (game && game.gameId && !loading) {
      inputRef.current?.focus();
    }
  }, [loading, game]);

  async function handleStartGame(guestName?: string) {
    const name = guestName || playerNameRef.current.trim();
    if (!name) return;
    setLoading(true);
    try {
      const diff = difficultyRef.current;
      const body: Record<string, unknown> = { playerName: name, mode: modeRef.current, difficulty: diff };
      if (diff === "custom") body.customMax = Number(customMaxRef.current);

      const res = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setGame(null);
        return;
      }
      const data = await res.json();
      setGame(data);
      setTimeLeft(data.mode === "challenge" ? 300 : 600);
      setGuess("");
      setGuessHistory([]);
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
        body: JSON.stringify({ gameId: g.gameId, guess: Number(val), playerName: isLoggedInRef.current ? playerNameRef.current.trim() : "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGame((prev) => prev ? { ...prev, message: data.error || "發生錯誤" } : prev);
        setGuess("");
        setLoading(false);
        return;
      }
      setGuessHistory((prev) => [...prev, { value: Number(val), level: gameRef.current?.level ?? 1 }]);

      if (data.result === "correct" || data.result === "victory" || data.result === "gameover") {
        if (data.result === "correct" || data.result === "victory") playCorrect();
        else playGameOver();
        if (data.unlocks && Array.isArray(data.unlocks) && data.unlocks.length > 0) {
          setNewUnlocks(data.unlocks);
          setUnlockedTitles((prev) => [...new Set([...prev, ...data.unlocks])]);
        }
        if (data.achievements && Array.isArray(data.achievements) && data.achievements.length > 0) {
          setNewAchievements(data.achievements);
        }
        setResult({
          mode: data.mode,
          difficulty: data.difficulty || g.difficulty,
          message: data.message,
          attempts: data.attempts,
          levelsCleared: data.levelsCleared,
          totalAttempts: data.totalAttempts,
          hintsLeft: data.hintsLeft,
        });
        setGame(null);
      } else if (data.result === "levelup") {
        playLevelUp();
        setGame({
          gameId: g.gameId,
          mode: "challenge",
          max: data.max!,
          difficulty: g.difficulty,
          level: data.level,
          attemptsLeft: data.attemptsLeft,
          maxAttempts: data.maxAttempts,
          hintsLeft: data.hintsLeft ?? g.hintsLeft,
          totalAttempts: data.totalAttempts,
          startedAt: g.startedAt,
          message: data.message,
        });
      } else {
        playWrong();
        setGame((prev) => prev ? {
          ...prev,
          attempts: data.attempts ?? prev.attempts,
          attemptsLeft: data.attemptsLeft ?? prev.attemptsLeft,
          hintsLeft: data.hintsLeft ?? prev.hintsLeft,
          totalAttempts: data.totalAttempts ?? prev.totalAttempts,
          temperatureLabel: data.temperatureLabel ?? prev.temperatureLabel,
          temperatureColor: data.temperatureColor ?? prev.temperatureColor,
          distance: data.distance ?? prev.distance,
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
      playHint();
      setGame((prev) => prev ? { ...prev, hintsLeft: data.hintsLeft, hintMessage: data.message } : prev);
    } catch {
      setGame((prev) => prev ? { ...prev, hintMessage: "提示系統錯誤" } : prev);
    } finally {
      setLoading(false);
    }
  }

  function resetGame() {
    setGame(null);
    setResult(null);
    setGuess("");
    setTimeLeft(0);
    setIdleTime(0);
    setIdleWarning(false);
    setCustomMax("");
    setNewUnlocks([]);
    setNewAchievements([]);
    setGuessHistory([]);
  }

  function forceReset() {
    setMode("normal");
    setDifficulty("easy");
    setGame(null);
    setResult(null);
    setGuess("");
    setTimeLeft(0);
    setIdleTime(0);
    setIdleWarning(false);
    setCustomMax("");
    setNewUnlocks([]);
    setNewAchievements([]);
    setGuessHistory([]);
  }

  async function handleAuth() {
    if (!showAuth || !authUser.trim() || authPass.length < 3) return;
    setLoading(true);
    setAuthMsg("");
    try {
      const res = await fetch(`/api/auth/${showAuth}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: authUser.trim(), password: authPass }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthMsg(data.error || "操作失敗");
      } else {
        const name = authUser.trim();
        const unlocks: string[] = [];
        if (name === "King") {
          unlocks.push("挑戰者", "神之一筆");
        } else {
          if (data.challengerUnlocked) unlocks.push("挑戰者");
          if (data.godlyUnlocked) unlocks.push("神之一筆");
        }
        setUnlockedTitles(unlocks);
        setPlayerName(authUser.trim());
        setUserTitle(data.title || "初心者");
        setIsLoggedIn(true);
        setShowAuth(null);
        setAuthUser("");
        setAuthPass("");
        setAuthMsg("");
      }
    } catch {
      setAuthMsg("網路錯誤");
    } finally {
      setLoading(false);
    }
  }

  const diffs = mode === "normal" ? NORMAL_DIFFS : CHALLENGE_DIFFS;
  const diffLabels: Record<string, string> = { easy: "#52c41a", hard: "#fa8c16", extreme: "#f5222d", custom: "#1677ff" };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem" }}>🔢 Number Guessing Game</h1>
      <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>
        {mode === "normal" ? "不限次數，越少 attempts 排名越高！" : "有限次數，逐關挑戰，看你能闖到第幾關！"}
      </p>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <button onClick={() => router.push("/leaderboard")} style={btnStyle}>🏆 排行榜</button>
        {isLoggedIn && (
          <button onClick={() => router.push("/stats")} style={btnStyle}>📊 統計</button>
        )}
        <button onClick={() => {
          const next = theme === "dark" ? "light" : "dark";
          document.documentElement.dataset.theme = next;
          localStorage.setItem("ng_theme", next);
          setTheme(next);
        }} style={btnStyle}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      {result ? (
        <div style={cardStyle} className="anim-pop-in">
          <h2 style={{ textAlign: "center", margin: 0 }}>📊 結算</h2>
          {newUnlocks.length > 0 && (
            <div className="anim-slide-down" style={{
              background: "#f6ffed", border: "1px solid #b7eb8f", borderRadius: 8,
              padding: "0.75rem 1rem", textAlign: "center",
            }}>
              <span style={{ fontSize: "1.2rem" }}>🎉</span>
              {" "}解鎖稱號：<strong>{newUnlocks.join("、")}</strong>
              {" "}<button onClick={() => { resetGame(); setNewUnlocks([]); setShowTitles(true); }}
                style={{ background: "none", border: "none", color: "#52c41a", cursor: "pointer", fontWeight: 600 }}>
                前往裝備
              </button>
            </div>
          )}
          {newAchievements.length > 0 && (
            <div className="anim-slide-down" style={{
              background: "#e6f7ff", border: "1px solid #91d5ff", borderRadius: 8,
              padding: "0.75rem 1rem", textAlign: "center",
            }}>
              🏆 獲得成就：
              <strong>{newAchievements.map((id) => {
                const names: Record<string, string> = {
                  first_win: "初次勝利", speed_demon: "閃電快手",
                  marathon: "馬拉松選手", hint_master: "提示大師",
                  persistent: "堅持不懈",
                };
                return names[id] || id;
              }).join("、")}</strong>
            </div>
          )}
          <p style={{
            textAlign: "center", fontSize: "1.1rem", fontWeight: 500,
            color: result.mode === "challenge" ? "#722ed1" : "#1677ff",
          }}>{result.mode === "challenge" ? "闖關模式" : "一般模式"} — {
            (result.mode === "challenge"
              ? CHALLENGE_DIFFS.find((d) => d.key === result.difficulty)?.label
              : NORMAL_DIFFS.find((d) => d.key === result.difficulty)?.label) || result.difficulty
          }</p>
          <p style={{ fontSize: "1rem", color: "var(--text-secondary)", textAlign: "center" }}>{result.message}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0.5rem 0" }}>
            {result.mode === "normal" && result.attempts !== undefined && (
              <div style={statRowStyle}>
                <span>總嘗試次數</span><span style={{ fontWeight: 700 }}>{result.attempts} 次</span>
              </div>
            )}
            {result.mode === "challenge" && (
              <>
                <div style={statRowStyle}>
                  <span>通過關卡</span><span style={{ fontWeight: 700 }}>{result.levelsCleared ?? 0} 關</span>
                </div>
                <div style={statRowStyle}>
                  <span>總嘗試次數</span><span style={{ fontWeight: 700 }}>{result.totalAttempts ?? 0} 次</span>
                </div>
                {result.hintsLeft !== undefined && (
                  <div style={statRowStyle}>
                    <span>剩餘提示</span><span style={{ fontWeight: 700 }}>{result.hintsLeft} / 3</span>
                  </div>
                )}
              </>
            )}
          </div>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button onClick={() => {
              handleStartGame();
              setResult(null);
            }} style={btnStyle}>🔄 再玩一次</button>
            <button onClick={resetGame} style={{ ...btnStyle, background: "#888" }}>🏠 回大廳</button>
          </div>
        </div>
      ) : !game ? (
        <div style={cardStyle}>
          {idleWarning && (
            <div style={{
              background: "#fff3cd", color: "#856404", padding: "0.5rem 1rem",
              borderRadius: 8, fontSize: "0.85rem", fontWeight: 500, border: "1px solid #ffc107",
            }}>
              ⚠ 閒置超過 2 分鐘，再 1 分鐘後將自動關閉遊戲
            </div>
          )}

          {!isLoggedIn ? (
            <>
              <h2 style={{ margin: 0 }}>訪客模式</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                名稱：unknown（不計分數）
              </p>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => handleStartGame("unknown")} disabled={loading} style={{ ...btnStyle, flex: 1 }}>
                  {loading ? "啟動中..." : "🎮 訪客遊玩"}
                </button>
                <button onClick={() => setShowAuth("register")} style={{ ...btnStyle, flex: 1, background: "#52c41a" }}>
                  📝 註冊
                </button>
                <button onClick={() => setShowAuth("login")} style={{ ...btnStyle, flex: 1, background: "#1677ff" }}>
                  🔑 登入
                </button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ margin: 0 }}>👋 {playerName}</h2>
                  {userTitle && (
                    <span style={{
                      fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500,
                      background: "var(--hover-bg)", padding: "0.1rem 0.5rem", borderRadius: 8,
                    }}>
                      {userTitle}
                    </span>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <button onClick={() => setShowTitles(true)}
                    style={{ ...btnStyle, fontSize: "0.85rem", padding: "0.3rem 0.8rem", background: "#722ed1" }}>
                    稱號
                  </button>
                  <button onClick={() => {
                    localStorage.removeItem("ng_login");
                    setIsLoggedIn(false);
                    setPlayerName("");
                    setUserTitle("");
                    setUnlockedTitles([]);
                  }} style={{ ...btnStyle, fontSize: "0.85rem", padding: "0.3rem 0.8rem", background: "#f5222d" }}>
                    登出
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontWeight: 500, marginBottom: "0.3rem", display: "block" }}>遊戲模式</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {MODES.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => { setMode(m.key); setDifficulty("easy"); setCustomMax(""); }}
                      style={{
                        ...btnStyle, flex: 1,
                        background: mode === m.key ? "#1677ff" : "var(--hover-bg)",
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

              {mode === "normal" && difficulty === "custom" && (
                <div>
                  <label style={{ fontWeight: 500, marginBottom: "0.3rem", display: "block" }}>自訂最大範圍</label>
                  <input
                    value={customMax}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^\d*$/.test(v)) setCustomMax(v);
                    }}
                    placeholder="輸入正整數（≥ 2）"
                    style={inputStyle}
                  />
                </div>
              )}

              <button onClick={() => handleStartGame()} disabled={loading || (mode === "normal" && difficulty === "custom" && !(Number(customMax) >= 2))} style={btnStyle}>
                {loading ? "啟動中..." : "開始遊戲"}
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
              <button onClick={resetGame} style={{
                ...btnStyle, fontSize: "0.85rem", padding: "0.3rem 0.8rem",
                background: "#888",
              }}>← 大廳</button>
              <h2 style={{ margin: 0 }}>{playerName}</h2>
              {userTitle && (
                <span style={{
                  fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500,
                  background: "var(--hover-bg)", padding: "0.1rem 0.4rem", borderRadius: 6, marginLeft: "0.3rem",
                }}>
                  {userTitle}
                </span>
              )}
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

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {game.gameId && (
              <span style={{
                fontSize: "0.9rem", fontWeight: 600,
                color: timeLeft <= 60 ? "#f5222d" : "#333",
              }}>
                ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
              </span>
            )}
          </div>

          {game.temperatureLabel && (
            <div className="anim-fade-in-up" style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center",
              color: game.temperatureColor, letterSpacing: "0.05em" }}>
              {game.temperatureLabel}
              <span style={{
                fontSize: "0.85rem", fontWeight: 400, opacity: 0.7,
                marginLeft: "0.5rem", display: "inline-block",
              }}>
                ({(() => {
                  const d = game.distance;
                  if (d === undefined) return "";
                  if (d <= 5) return "±5";
                  if (d <= 20) return "±20";
                  if (d <= 50) return "±50";
                  return ">50";
                })()})
              </span>
            </div>
          )}

          <p style={{
            fontSize: game.temperatureLabel ? "1rem" : "1.2rem",
            color: "var(--text)", fontWeight: 600,
            textAlign: "center",
            background: "var(--hover-bg)", padding: "0.5rem 1rem", borderRadius: 8,
          }}>
            {game.message}
          </p>

          {game.hintMessage && (
            <div style={{
              fontSize: "0.85rem", color: "#722ed1", fontWeight: 600,
              textAlign: "center", padding: "0.3rem 0",
            }}>
              {game.hintMessage}
            </div>
          )}

          {game.gameId && (
            <>
              {game.mode === "challenge" && (
                <p style={{ color: "#722ed1", fontWeight: 600 }}>
                  剩餘嘗試：{game.attemptsLeft} / {game.maxAttempts} 次
                </p>
              )}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  ref={inputRef}
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder={`輸入數字 (0-${game.max})`}
                  type="number" min={0} max={game.max}
                  style={{ ...inputStyle, flex: 1 }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmitGuess()}
                  disabled={loading}
                  autoFocus
                />
                <button onClick={handleSubmitGuess} disabled={loading || !guess.trim()} style={btnStyle}>
                  {loading ? "..." : "猜"}
                </button>
              </div>
              {game.mode === "challenge" && (
                <div>
                  <div style={{ display: "flex", gap: "0.4rem", alignItems: "center", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
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
                          background: "var(--hover-bg)", color: "#333", border: "1px solid var(--border-light)",
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
              {guessHistory.length > 0 && (() => {
                const levels = [...new Set(guessHistory.map((g) => g.level))].sort((a, b) => a - b);
                const multiLevel = levels.length > 1;
                return (
                  <div style={{ maxHeight: 120, overflowY: "auto" }}>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.3rem" }}>
                      猜過：{guessHistory.length} 次
                    </div>
                    {levels.map((lv) => {
                      const items = guessHistory.filter((g) => g.level === lv);
                      return (
                        <div key={lv} style={{ marginBottom: multiLevel ? "0.4rem" : 0 }}>
                          {multiLevel && (
                            <div style={{
                              fontSize: "0.7rem", color: "#722ed1", fontWeight: 700,
                              marginBottom: "0.2rem",
                            }}>
                              Level {lv}
                            </div>
                          )}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
                            {items.map((g, i) => {
                              const isLast = multiLevel
                                ? i === items.length - 1 && lv === levels[levels.length - 1]
                                : g === guessHistory[guessHistory.length - 1];
                              return (
                                <span key={`${lv}-${i}`} style={{
                                  background: "var(--hover-bg)", fontSize: "0.75rem", fontWeight: 600,
                                  padding: "0.15rem 0.5rem", borderRadius: 6,
                                  color: isLast ? "#1677ff" : "#555",
                                  border: isLast ? "1px solid #1677ff" : "1px solid var(--border-light)",
                                }}>
                                  {g.value}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </>
          )}

          {!game.gameId && (
            <button onClick={resetGame} style={btnStyle}>
              再玩一次
            </button>
          )}
        </div>
      )}

      {showTitles && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}>
          <div style={{ ...cardStyle, width: 340 }}>
            <h3 style={{ margin: 0 }}>稱號列表</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {["管理員", "初心者", "挑戰者", "神之一筆"].map((t) => {
                const isKing = playerName === "King";
                let locked = false;
                let lockReason = "";
                if (t === "管理員") {
                  locked = !isKing;
                  lockReason = "僅 King 可用";
                } else if (t === "挑戰者") {
                  locked = !isKing && !unlockedTitles.includes("挑戰者");
                  lockReason = "需遊玩闖關模式解鎖";
                } else if (t === "神之一筆") {
                  locked = !isKing && !unlockedTitles.includes("神之一筆");
                  lockReason = "需一次猜中解鎖";
                }
                return (
                  <button
                    key={t}
                    disabled={locked}
                    onClick={async () => {
                      if (locked) return;
                      const res = await fetch("/api/titles/set", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username: playerName, title: t }),
                      });
                      if (res.ok) {
                        setUserTitle(t);
                        setShowTitles(false);
                      } else {
                        const err = await res.json();
                        alert(err.error || "無法裝備");
                      }
                    }}
                    style={{
                      ...btnStyle, textAlign: "left",
                      background: userTitle === t ? "#1677ff" : locked ? "#e0e0e0" : "#f0f0f0",
                      color: userTitle === t ? "white" : locked ? "#bbb" : "#333",
                      fontWeight: userTitle === t ? 700 : 500, cursor: locked ? "not-allowed" : "pointer",
                    }}
                  >
                    {t} {userTitle === t && " ✓"} {locked && ` 🔒 ${lockReason}`}
                  </button>
                );
              })}
            </div>
            <button onClick={() => setShowTitles(false)}
              style={{ ...btnStyle, background: "#888" }}>
              關閉
            </button>
          </div>
        </div>
      )}

      {showAuth && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }}>
          <div style={{ ...cardStyle, width: 340 }}>
            <h3 style={{ margin: 0 }}>{showAuth === "register" ? "註冊帳號" : "登入"}</h3>
            <input
              value={authUser}
              onChange={(e) => setAuthUser(e.target.value)}
              placeholder="遊戲名稱"
              style={inputStyle}
            />
            <input
              value={authPass}
              onChange={(e) => setAuthPass(e.target.value)}
              placeholder="密碼（至少 3 碼）"
              type="password"
              style={inputStyle}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
            />
            {authMsg && <p style={{ color: "#f5222d", fontSize: "0.85rem", margin: 0 }}>{authMsg}</p>}
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={handleAuth} disabled={loading || !authUser.trim() || authPass.length < 3}
                style={{ ...btnStyle, flex: 1 }}>
                {loading ? "處理中..." : "確認"}
              </button>
              <button onClick={() => { setShowAuth(null); setAuthUser(""); setAuthPass(""); setAuthMsg(""); }}
                style={{ ...btnStyle, flex: 1, background: "#888" }}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: "var(--card-bg)", borderRadius: 12, padding: "1.5rem",
  boxShadow: "var(--shadow)", display: "flex", flexDirection: "column", gap: "1rem",
};

const inputStyle: React.CSSProperties = {
  padding: "0.6rem 1rem", fontSize: "1rem", border: "1px solid var(--border)",
  borderRadius: 8, outline: "none", background: "var(--input-bg)", color: "var(--text)",
};

const btnStyle: React.CSSProperties = {
  padding: "0.6rem 1.2rem", fontSize: "1rem", background: "#1677ff",
  color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500,
};

const statRowStyle: React.CSSProperties = {
  display: "flex", justifyContent: "space-between",
  padding: "0.4rem 0.8rem", background: "var(--muted-bg)", borderRadius: 6,
  fontSize: "0.95rem",
};
