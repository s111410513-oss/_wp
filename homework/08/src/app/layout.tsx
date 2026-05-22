import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Number Guessing Game",
  description: "Guess the number and compete on the leaderboard!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f0f2f5" }}>
        {children}
      </body>
    </html>
  );
}
