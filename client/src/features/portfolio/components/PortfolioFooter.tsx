import { ArrowUpRight, Copy, Instagram, Mail, MessageCircle } from "lucide-react";

type PortfolioFooterProps = {
  markUrl: string;
  whatsAppUrl: string;
  onWhatsAppClick: () => void;
  emailCopyStatus: "idle" | "copied" | "error";
  copyContactEmail: () => void;
};

export default function PortfolioFooter({
  markUrl,
  whatsAppUrl,
  onWhatsAppClick,
  emailCopyStatus,
  copyContactEmail,
}: PortfolioFooterProps) {
  return (
    <footer id="contato-rodape" className="border-t border-white/[0.07] bg-[#06080d]" aria-labelledby="footer-contact-title">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-12">
        <div>
          <div className="flex items-center gap-3">
            <img src={markUrl} alt="" width="24" height="24" decoding="async" className="h-6 w-6 object-contain" />
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#7b91b3]">
              Pablo Guilherme · desenvolvimento web & audiovisual
            </p>
          </div>
          <h2 id="footer-contact-title" className="mt-5 max-w-sm font-display text-2xl font-medium tracking-[-0.04em] text-white">
            Tem um projeto em mente?
          </h2>
          <p className="mt-3 max-w-md font-body text-sm leading-6 text-[#9fb4d2]">
            Conte o objetivo, o prazo e o que precisa ser construído ou produzido.
          </p>
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#60a5fa]">contato direto</p>
          <div data-availability-status="true" role="status" aria-live="polite" className="mt-3 inline-flex items-center gap-2 border border-amber-300/25 bg-amber-300/5 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-amber-100">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />
            disponibilidade atual: sob consulta
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <a href="mailto:mpjcreator@gmail.com" className="inline-flex min-h-11 items-center gap-2 border border-[#3b82f6]/35 bg-[#0b1c36] px-3 font-mono text-[10px] text-[#d9eaff] transition-colors hover:border-[#3b82f6] hover:text-white">
              <Mail className="h-3.5 w-3.5" /> mpjcreator@gmail.com
            </a>
            <button
              type="button"
              onClick={copyContactEmail}
              aria-label={emailCopyStatus === "copied" ? "E-mail copiado" : "Copiar e-mail mpjcreator@gmail.com"}
              className="inline-flex min-h-11 items-center gap-2 border border-white/15 px-3 font-mono text-[10px] text-[#b8cae5] transition-colors hover:border-[#3b82f6] hover:text-white"
            >
              <Copy className="h-3.5 w-3.5" />
              {emailCopyStatus === "copied" ? "copiado" : emailCopyStatus === "error" ? "tente novamente" : "copiar"}
            </button>
          </div>
          <p data-email-copy-status="true" role="status" aria-live="polite" className="mt-2 min-h-4 font-mono text-[9px] text-[#75a7fb]">
            {emailCopyStatus === "copied" ? "E-mail copiado." : emailCopyStatus === "error" ? "Não foi possível copiar automaticamente." : ""}
          </p>
        </div>

        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#60a5fa]">links profissionais</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="https://www.instagram.com/pablogui000/" target="_blank" rel="noreferrer" aria-label="Instagram @pablogui000" className="footer-social-icon text-[#6e85a8]">
              <Instagram className="h-4 w-4" />
            </a>
            <a href={whatsAppUrl} onClick={onWhatsAppClick} target="_blank" rel="noreferrer" aria-label="Falar com Pablo pelo WhatsApp" className="footer-social-icon text-[#6e85a8]">
              <MessageCircle className="h-4 w-4" />
            </a>
            <a href="https://pabloguilherme01.github.io/observatorio/" target="_blank" rel="noreferrer" aria-label="Abrir projeto Observatório" className="footer-social-icon text-[#6e85a8]">
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7b91b3]">portfólio profissional · 2026</p>
            <a href={import.meta.env.BASE_URL + "privacidade/"} className="inline-flex min-h-11 items-center font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8fbd] underline decoration-[#3b82f6]/50 underline-offset-4 transition-colors hover:text-[#b7d4ff]">
              privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
