import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Number Guessing Game",
  description: "Guess the number and compete on the leaderboard!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("ng_theme")||"light";document.documentElement.dataset.theme=t}catch(e){}})()`,
        }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
