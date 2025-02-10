// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import NavBar from "@/components/Navbar/Navbar";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Cupid Connect",
//   description: "Cupid Connect is for you ",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         {/* <NavBar/> */}
//         {children}
//         </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cupid Connect - Find Your Perfect Match ❤️",
  description: "Cupid Connect helps you find love through matchmaking and meaningful conversations. Join now and start your journey towards a perfect match!",
  keywords: "matchmaking, dating, love, find partner, chat, relationship, romance, singles, cupid connect",
  robots: "index, follow",
  openGraph: {
    title: "Cupid Connect - Matchmaking & Chat 💕",
    description: "Find your perfect match and chat with like-minded people. Cupid Connect is your gateway to love!",
    url: "https://cupidconnect.vercel.app/",
    siteName: "Cupid Connect",
    type: "website",
    images: [
      {
        url: "https://cupidconnect.com/Logo1.png", // Replace with actual OG image URL
        width: 1200,
        height: 630,
        alt: "Cupid Connect - Love & Matchmaking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cupid Connect - Matchmaking & Chat 💕",
    description: "Join Cupid Connect and meet like-minded people for love and friendship.",
    site: "@CupidConnect",
    images: ["https://cupidconnect.com/Logo1.png"], // Replace with actual Twitter OG image URL
  },
  themeColor: "#FF4081", // Love theme color (pinkish tone)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} bg-pink-100 text-gray-900`}>
        {/* <NavBar /> */}
        {children}
      </body>
    </html>
  );
}
