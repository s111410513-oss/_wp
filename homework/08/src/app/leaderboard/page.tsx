"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function useThemeSync() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const t = document.documentElement.dataset.theme || "light";
    setTheme(t);
  }, []);
  return { theme, setTheme };
}

type Score = {
  id: number;
  playerName: string;
  mode: string;
  attempts: number;
  levelsCleared: number;
  difficulty: string;
  createdAt: string;
};

const MODE_TABS = [
  { key: "normal", label: "一般模式" },
  { key: "challenge", label: "闖關模式" },
] as const;

const DIFF_FILTERS = ["all", "easy", "hard", "extreme"] as const;

export default function LeaderboardPage() {
  const router = useRouter();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("normal");
  const [filter, setFilter] = useState("all");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const t = document.documentElement.dataset.theme || "light";
    setTheme(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `/api/leaderboard?mode=${mode}`;
    if (filter !== "all") url += `&difficulty=${filter}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => { setScores(data); setLoading(false); });
  }, [mode, filter]);

  const diffColor: Record<string, string> = {
    easy: "#52c41a", hard: "#fa8c16", extreme: "#f5222d",
  };

  const diffLabelsN: Record<string, string> = { easy: "簡單", hard: "困難", extreme: "超困難" };
  const diffLabelsC: Record<string, string> = { easy: "普通", hard: "困難", extreme: "極度困難" };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem" }}>🏆 Leaderboard</h1>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <button onClick={() => router.push("/")} style={btnStyle}>← 回到遊戲</button>
        <button onClick={() => router.push("/stats")} style={btnStyle}>📊 統計</button>
        <button onClick={() => {
          const next = theme === "dark" ? "light" : "dark";
          document.documentElement.dataset.theme = next;
          localStorage.setItem("ng_theme", next);
          setTheme(next);
        }} style={btnStyle}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        {MODE_TABS.map((m) => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setFilter("all"); }}
            style={{
              ...btnStyle, flex: 1,
              background: mode === m.key ? "#1677ff" : "var(--muted-bg)",
              color: mode === m.key ? "white" : "var(--text)",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        {DIFF_FILTERS.map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            style={{
              ...btnStyle,
              background: filter === d ? "#1677ff" : "var(--hover-bg)",
              color: filter === d ? "white" : "var(--text)",
              padding: "0.3rem 0.8rem", fontSize: "0.85rem",
            }}
          >
            {d === "all" ? "全部" : d === "easy" ? "簡單" : d === "hard" ? "困難" : "超困難"}
          </button>
        ))}
      </div>

      <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "1rem" }}>
        {mode === "normal"
          ? "依照嘗試次數排名（越少越高）"
          : "依照過關數排名（越多越高）"}
      </p>

      {loading ? (
        <p style={{ textAlign: "center" }}>載入中...</p>
      ) : scores.length === 0 ? (
        <p style={{ textAlign: "center" }}>尚無記錄，快來玩第一場！</p>
      ) : (
        <div style={cardStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border-light)" }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>玩家</th>
                {mode === "normal" ? (
                  <th style={thStyle}>attempts</th>
                ) : (
                  <th style={thStyle}>過關數</th>
                )}
                <th style={thStyle}>難度</th>
                <th style={thStyle}>日期</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>{s.playerName}</td>
                  {mode === "normal" ? (
                    <td style={tdStyle}>{s.attempts}</td>
                  ) : (
                    <td style={tdStyle}>{s.levelsCleared}</td>
                  )}
                  <td style={tdStyle}>
                    <span style={{
                      background: diffColor[s.difficulty] || "#999", color: "white",
                      padding: "0.15rem 0.5rem", borderRadius: 10, fontSize: "0.75rem", fontWeight: 600,
                    }}>
                      {mode === "normal" ? diffLabelsN[s.difficulty] || s.difficulty : diffLabelsC[s.difficulty] || s.difficulty}
                    </span>
                  </td>
                  <td style={tdStyle}>{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: "var(--card-bg)", borderRadius: 12, padding: "1rem",
  boxShadow: "var(--shadow)",
};

const thStyle: React.CSSProperties = {
  textAlign: "left", padding: "0.6rem 0.8rem", fontWeight: 600, color: "var(--text)",
};

const tdStyle: React.CSSProperties = {
  padding: "0.6rem 0.8rem", color: "var(--text)",
};

const btnStyle: React.CSSProperties = {
  padding: "0.6rem 1.2rem", fontSize: "1rem", background: "#1677ff",
  color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500,
};
