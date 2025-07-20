import Link from 'next/link'
import './globals.css'

export default function RootLayout({children}) {
  return(
    <html lang='en'>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="icon" href="/icon.ico" size="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet"/>
        <title>Sticker task Tracker</title>
      </head>
      <body className='bg-gray-100 text-xl text-gray-800 font-inter antialiased my-4 mx-8' >
        <nav className="border-gray-200 text-3xl flex justify-between items-center w-full">
          
          <Link href="/">🏠</Link>
          <div className='flex items-center gap-x-8'>
            <Link href="/board">🧸</Link>
            <Link href="/insights">📊</Link>
          </div>
          
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}