import { ArrowLeft, ShieldCheck } from "lucide-react";

const sections = [
  ["Dados enviados", "Na versão publicada no GitHub Pages, o formulário prepara uma mensagem para você revisar e enviar pelo WhatsApp. O site não recebe o pedido automaticamente; o envio pelo WhatsApp está sujeito às regras e à política de privacidade desse serviço. Em ambientes com servidor, o formulário pode receber nome, e-mail, data desejada, tipo de serviço, localização e briefing para analisar o pedido, responder e preparar uma proposta."],
  ["Preferências locais", "Favoritos, histórico de buscas, tema, escala de fonte, ordem manual e preferências de visualização ficam no armazenamento local ou de sessão do navegador. Você pode removê-los limpando os dados deste site."],
  ["Analytics", "Quando habilitado no ambiente de produção, o analytics registra eventos agregados de navegação, filtros, compartilhamentos e downloads. Ele não é necessário para navegar ou enviar um briefing."],
  ["Segurança e solicitações", "Pedidos comerciais são protegidos pelas regras da aplicação. Para solicitar esclarecimento, correção ou exclusão de um dado enviado, escreva para mpjcreator@gmail.com."],
] as const;

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[#030b1e] px-5 py-8 text-[#e8f1ff] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.1] pb-6">
          <a href={import.meta.env.BASE_URL} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#9eb7dc] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> voltar ao arquivo
          </a>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#60a5fa]">arquivo profundo / privacidade</span>
        </header>
        <section className="grid gap-12 py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-24">
          <div>
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#60a5fa]"><ShieldCheck className="h-4 w-4" aria-hidden="true" /> transparência operacional</div>
            <h1 className="mt-6 max-w-xl font-display text-[clamp(3.3rem,8vw,7rem)] font-medium leading-[0.9] tracking-[-0.07em] text-white">Privacidade sem ruído.</h1>
            <p className="mt-7 max-w-md font-body text-base leading-8 text-[#b8cae5]">Uma explicação direta sobre o que entra no arquivo, por que é usado e como pedir esclarecimentos.</p>
          </div>
          <div className="border-l border-[#3b82f6]/45 pl-6 lg:pl-10">
            <div className="divide-y divide-white/[0.1] border-y border-white/[0.1]">
              {sections.map(([title, text], index) => (
                <section key={title} className="py-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#60a5fa]">0{index + 1} / {title}</p>
                  <p className="mt-3 max-w-2xl font-body text-sm leading-7 text-[#d1def0]">{text}</p>
                </section>
              ))}
            </div>
            <blockquote className="mt-8 border border-[#3b82f6]/30 bg-[#071326] p-5 font-body text-sm leading-7 text-[#c9dbf2]">Esta página é uma explicação operacional da experiência atual e não substitui uma revisão jurídica específica para a atividade profissional.</blockquote>
            <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.12em] text-[#7894bb]">Contato do titular: <a href="mailto:mpjcreator@gmail.com" className="text-[#9ec4ff] underline decoration-[#3b82f6]/60 underline-offset-4 hover:text-white">mpjcreator@gmail.com</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}
