"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Score = {
  id: number;
  playerName: string;
  attempts: number;
  difficulty: string;
  createdAt: string;
};

const DIFFICULTIES = ["all", "easy", "hard", "extreme"] as const;

export default function LeaderboardPage() {
  const router = useRouter();
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setLoading(true);
    const url = filter === "all" ? "/api/leaderboard" : `/api/leaderboard?difficulty=${filter}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setScores(data);
        setLoading(false);
      });
  }, [filter]);

  const diffColor: Record<string, string> = {
    easy: "#52c41a",
    hard: "#fa8c16",
    extreme: "#f5222d",
  };

  return (
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ textAlign: "center", fontSize: "2rem" }}>🏆 Leaderboard</h1>
      <p style={{ textAlign: "center", color: "#555" }}>Top players ranked by fewest attempts</p>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem" }}>
        <button onClick={() => router.push("/")} style={btnStyle}>
          ← Back to Game
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "1rem" }}>
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            style={{
              ...btnStyle,
              background: filter === d ? "#1677ff" : "#e0e0e0",
              color: filter === d ? "white" : "#333",
            }}
          >
            {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : scores.length === 0 ? (
        <p style={{ textAlign: "center" }}>No scores yet. Be the first to play!</p>
      ) : (
        <div style={cardStyle}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee" }}>
                <th style={thStyle}>Rank</th>
                <th style={thStyle}>Player</th>
                <th style={thStyle}>Attempts</th>
                <th style={thStyle}>Difficulty</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, i) => (
                <tr key={score.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={tdStyle}>{i + 1}</td>
                  <td style={tdStyle}>{score.playerName}</td>
                  <td style={tdStyle}>{score.attempts}</td>
                  <td style={tdStyle}>
                    <span style={{
                      background: diffColor[score.difficulty] || "#999",
                      color: "white",
                      padding: "0.15rem 0.5rem",
                      borderRadius: 10,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}>
                      {score.difficulty}
                    </span>
                  </td>
                  <td style={tdStyle}>{new Date(score.createdAt).toLocaleDateString()}</td>
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
  background: "white",
  borderRadius: 12,
  padding: "1rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "0.6rem 0.8rem",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: "0.6rem 0.8rem",
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
