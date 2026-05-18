import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: '#0a1628' }}>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/logo.png"
          alt="Amarants Logo"
          width={48}
          height={48}
          className="rounded-xl"
        />
        <div>
          <h1 className="font-black text-xl tracking-widest text-white leading-none">
            AMARANTS
          </h1>
          <p className="text-xs font-medium tracking-wider" style={{ color: '#6ee04a' }}>
            Instagrowht
          </p>
        </div>
      </div>

      {/* Tag */}
      <span className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border"
        style={{
          color: '#6ee04a',
          background: 'rgba(110,224,74,0.1)',
          borderColor: 'rgba(110,224,74,0.3)'
        }}>
        Expansão Digital com IA
      </span>

      {/* Título principal */}
      <h2 className="text-4xl font-black text-white text-center mb-4 leading-tight">
        O sistema operacional de<br />
        <span style={{ color: '#6ee04a' }}>
          crescimento para Instagram
        </span>
      </h2>

      {/* Subtítulo */}
      <p className="text-center text-lg mb-10 max-w-md" style={{ color: '#a0aec0' }}>
        Crie posts, carrosséis, reels e banners com IA.
        Agende e publique automaticamente.
      </p>

      {/* Botões */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          className="px-7 py-3 rounded-lg font-bold text-sm transition-all hover:-translate-y-0.5"
          style={{
            background: '#6ee04a',
            color: '#0a1628',
            boxShadow: '0 4px 20px rgba(110,224,74,0.3)'
          }}>
          Começar grátis
        </button>
        <button
          className="px-7 py-3 rounded-lg font-semibold text-sm border transition-all hover:-translate-y-0.5"
          style={{
            background: 'transparent',
            color: '#ffffff',
            borderColor: 'rgba(255,255,255,0.25)'
          }}>
          Ver demo
        </button>
      </div>

      {/* Rodapé */}
      <p className="mt-16 text-xs italic" style={{ color: '#6ee04a' }}>
        Estruturas digitais para seus negócios!
      </p>

    </main>
  )
}