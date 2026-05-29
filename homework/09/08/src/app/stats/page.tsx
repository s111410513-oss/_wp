"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ALL_ACHIEVEMENTS } from "@/lib/achievements";

type Stats = {
  totalGames: number;
  wins: number;
  winRate: number;
  totalAttempts: number;
  avgAttempts: number;
  bestNormal: { attempts: number; difficulty: string } | null;
  bestChallenge: { levelsCleared: number; attempts: number } | null;
  totalTime: number;
};

type AchievementsData = {
  earned: string[];
  all: Array<{ id: string; name: string; desc: string; icon: string; earned: boolean }>;
};

export default function StatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [achievements, setAchievements] = useState<AchievementsData | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const stored = localStorage.getItem("ng_login");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.isLoggedIn && data.playerName) {
          setUsername(data.playerName);
        }
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const t = document.documentElement.dataset.theme || "light";
    setTheme(t);
  }, []);

  useEffect(() => {
    if (!username) { setLoading(false); return; }
    Promise.all([
      fetch(`/api/achievements?username=${encodeURIComponent(username)}`).then((r) => r.json()),
      fetch(`/api/stats?username=${encodeURIComponent(username)}`).then((r) => r.json()),
    ]).then(([a, s]) => {
      setAchievements(a);
      setStats(s);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
        <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>載入中...</p>
      </main>
    );
  }

  if (!username) {
    return (
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{
          background: "var(--card-bg)", borderRadius: 12, padding: "2rem",
          boxShadow: "var(--shadow)", textAlign: "center",
        }}>
          <h2>請先登入</h2>
          <p style={{ color: "var(--text-secondary)" }}>登入後才能查看個人統計</p>
          <button onClick={() => router.push("/")} style={btnStyle}>回大廳</button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <button onClick={() => router.push("/")} style={btnStyle}>← 回大廳</button>
        <button onClick={() => {
          const next = theme === "dark" ? "light" : "dark";
          document.documentElement.dataset.theme = next;
          localStorage.setItem("ng_theme", next);
          setTheme(next);
        }} style={btnStyle}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <div style={cardStyle}>
        <h2 style={{ margin: 0 }}>📊 {username} 的統計</h2>
        {stats && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div style={statRowStyle}>
              <span>總遊戲次數</span><span style={{ fontWeight: 700 }}>{stats.totalGames}</span>
            </div>
            <div style={statRowStyle}>
              <span>勝場</span><span style={{ fontWeight: 700 }}>{stats.wins}</span>
            </div>
            <div style={statRowStyle}>
              <span>勝率</span><span style={{ fontWeight: 700 }}>{(stats.winRate * 100).toFixed(1)}%</span>
            </div>
            <div style={statRowStyle}>
              <span>總嘗試次數</span><span style={{ fontWeight: 700 }}>{stats.totalAttempts}</span>
            </div>
            <div style={statRowStyle}>
              <span>平均 attempts</span><span style={{ fontWeight: 700 }}>{stats.avgAttempts.toFixed(1)}</span>
            </div>
            {stats.bestNormal && (
              <div style={statRowStyle}>
                <span>一般最佳</span><span style={{ fontWeight: 700 }}>{stats.bestNormal.attempts} 次 ({stats.bestNormal.difficulty})</span>
              </div>
            )}
            {stats.bestChallenge && (
              <div style={statRowStyle}>
                <span>闖關最佳</span><span style={{ fontWeight: 700 }}>{stats.bestChallenge.levelsCleared} 關 ({stats.bestChallenge.attempts} 次)</span>
              </div>
            )}
            <div style={statRowStyle}>
              <span>總遊玩時間</span><span style={{ fontWeight: 700 }}>{formatTime(stats.totalTime)}</span>
            </div>
          </div>
        )}
      </div>

      {achievements && (
        <div style={{ ...cardStyle, marginTop: "1rem" }}>
          <div style={{
            fontSize: "0.8rem", background: "var(--hover-bg)", borderRadius: 8,
            padding: "0.5rem 0.8rem", color: "var(--text-muted)",
          }}>
            💡 闖關模式勝利條件：通過 <strong>10</strong> 關（第 10 關猜中即獲勝）
          </div>
          <h3 style={{ margin: 0 }}>🏆 成就 ({achievements.earned.length}/{achievements.all.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {achievements.all.map((a) => (
              <div
                key={a.id}
                className={a.earned ? "anim-fade-in-up" : ""}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.6rem 0.8rem", borderRadius: 8,
                  background: a.earned ? "var(--muted-bg)" : "var(--hover-bg)",
                  opacity: a.earned ? 1 : 0.45,
                }}
              >
                <span style={{ fontSize: "1.4rem" }}>{a.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: "var(--text)" }}>{a.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{a.desc}</div>
                </div>
                {a.earned && <span style={{ color: "#52c41a", fontWeight: 700 }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s} 秒`;
  return `${m} 分 ${s} 秒`;
}

const cardStyle: React.CSSProperties = {
  background: "var(--card-bg)", borderRadius: 12, padding: "1.5rem",
  boxShadow: "var(--shadow)", display: "flex", flexDirection: "column", gap: "1rem",
};

const btnStyle: React.CSSProperties = {
  padding: "0.6rem 1.2rem", fontSize: "1rem", background: "#1677ff",
  color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500,
};

const statRowStyle: React.CSSProperties = {
  display: "flex", justifyContent: "space-between",
  padding: "0.4rem 0.8rem", background: "var(--muted-bg)", borderRadius: 6, fontSize: "0.95rem",
  color: "var(--text)",
};
