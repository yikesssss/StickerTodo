import Link from 'next/link'
import './globals.css'

export default function RootLayout({children}) {
  return(
    <html lang='en'>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Sticker to do</title>
      </head>
      <body>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/board">Sticker board</Link>
          <Link href="/insights">Insights</Link>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}