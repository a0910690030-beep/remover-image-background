import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Image Background Remover",
  description: "Remove image background with one click",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
