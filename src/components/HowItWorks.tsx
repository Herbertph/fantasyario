const STEPS = [
  { title: 'Identifique o tamanho', text: 'do seu baby na tabela (PP ao GG).', bg: 'bg-lavender' },
  { title: 'Escolha o tema', text: 'no catálogo de fantasias.', bg: 'bg-mint' },
  { title: 'Reserve pelo WhatsApp', text: 'confirmando a data da festa ou mesversário.', bg: 'bg-butter' },
  { title: 'Celebre sem preocupação', text: '— peças higienizadas e prontas para vestir.', bg: 'bg-[#fdd5c7]' },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="como-funciona-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 id="como-funciona-title" className="text-center text-3xl font-black sm:text-4xl">
        Como Funciona
      </h2>
      <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className={`rounded-3xl p-6 ${s.bg}`}>
            <span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full bg-ink text-xl font-black text-white">
              {i + 1}
            </span>
            <p className="mt-4 text-lg">
              <strong className="font-extrabold">{s.title}</strong> {s.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
