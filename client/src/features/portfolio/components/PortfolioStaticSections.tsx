import { publicMediaPath } from "@/features/portfolio/utils/publicMediaPath";
import { ArrowUpRight } from "lucide-react";
import { processSteps, serviceOffers, skillTracks } from "../portfolioData";

const textureUrl = publicMediaPath("/manus-storage/pablo-systems-texture_cf9aade1.png");
const textureResponsive = {
  avif: publicMediaPath("/manus-storage/pablo-systems-texture-480w_5a6395b2.avif 480w, /manus-storage/pablo-systems-texture-768w_8d43ab9a.avif 768w, /manus-storage/pablo-systems-texture-1200w_bd814e99.avif 1200w, /manus-storage/pablo-systems-texture-1600w_37d28a1c.avif 1600w, /manus-storage/pablo-systems-texture-1920w_743d3758.avif 1920w"),
  webp: publicMediaPath("/manus-storage/pablo-systems-texture-480w_ec71c815.webp 480w, /manus-storage/pablo-systems-texture-768w_c701324d.webp 768w, /manus-storage/pablo-systems-texture-1200w_4041e6bf.webp 1200w, /manus-storage/pablo-systems-texture-1600w_c56f3109.webp 1600w, /manus-storage/pablo-systems-texture-1920w_89c6d1bd.webp 1920w"),
};

export function PortfolioSkills({ isDesktopViewport, markUrl }: { isDesktopViewport: boolean; markUrl: string }) {
  return (
    <section id="trilha" className="archive-chapter relative overflow-hidden border-t border-white/[0.07] bg-[#070a10] py-16 sm:py-24 lg:py-28">
      {isDesktopViewport && (
        <picture className="pointer-events-none absolute inset-0 block">
          <source type="image/avif" srcSet={textureResponsive.avif} sizes="100vw" />
          <source type="image/webp" srcSet={textureResponsive.webp} sizes="100vw" />
          <img src={textureUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-[0.11] mix-blend-screen" />
        </picture>
      )}
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.4fr] lg:gap-20">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">Competências</p>
            <div className="mt-3 flex items-center gap-3">
              <img src={markUrl} alt="" width="28" height="28" loading="lazy" decoding="async" className="h-7 w-7 object-contain opacity-80" />
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">desenvolvimento · produto · audiovisual</span>
            </div>
            <h2 className="mt-5 max-w-md font-display text-[clamp(2.4rem,4vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">
              Competências que conectam produto e comunicação.
            </h2>
            <p className="mt-6 max-w-sm font-body text-base leading-7 text-[#b6d7eb]">
              Desenvolvimento web como núcleo, com conteúdo e audiovisual como repertório complementar quando o projeto pede uma comunicação mais completa.
            </p>
          </div>

          <div className="border-t border-white/[0.1]">
            {skillTracks.map((skill) => (
              <article key={skill.number} className="group grid gap-4 border-b border-white/[0.1] py-7 sm:grid-cols-[70px_1fr] sm:gap-7 sm:py-8">
                <span className="font-mono text-xs text-[#3b82f6]">{skill.number}</span>
                <div>
                  <h3 className="font-display text-2xl font-medium text-[#eff6ff]">{skill.title}</h3>
                  <p className="mt-3 max-w-lg font-body text-sm leading-7 text-[#9eb0cc]">{skill.text}</p>
                  <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f91b7]">{skill.tools}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PortfolioServices({ markUrl }: { markUrl: string }) {
  return (
    <section id="servicos" className="archive-chapter relative overflow-hidden border-t border-white/[0.07] bg-[#09101a]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid gap-10 border-b border-white/[0.1] pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">Serviços</p>
            <div className="mt-3 flex items-center gap-3">
              <img src={markUrl} alt="" width="28" height="28" loading="lazy" decoding="async" className="h-7 w-7 object-contain opacity-80" />
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">soluções digitais e conteúdo</span>
            </div>
            <h2 className="mt-5 max-w-md font-display text-[clamp(2.7rem,4.8vw,5.5rem)] font-medium leading-[0.93] tracking-[-0.06em] text-white">
              Escopo claro, entrega objetiva.
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-2xl font-body text-base leading-8 text-[#c0e3f4]">
              O formato é definido a partir do objetivo: construir uma presença web, comunicar um produto ou registrar uma experiência com qualidade visual.
            </p>
            <a href="#contato" className="mt-7 inline-flex min-h-11 items-center gap-2 border-b border-[#3b82f6] font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#e3eeff] transition-colors hover:text-[#76aaff]">
              solicitar escopo <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-px bg-white/[0.1] lg:grid-cols-3">
          {serviceOffers.map(({ number, label, title, text, detail, delivery, duration, Icon }) => (
            <article key={number} className="group bg-[#07101c] p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-xl text-[#3b82f6]">{number}</span>
                  <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#607aa1]">{label}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center border border-[#3b82f6]/25 bg-[#0c1728] text-[#71a6fb] transition-colors group-hover:border-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <h3 className="mt-6 font-display text-[clamp(2rem,3vw,3rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">{title}</h3>
              <p className="mt-4 font-body text-sm leading-7 text-[#a4b5cf]">{text}</p>
              <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8db8]">{detail}</p>
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
                <div>
                  <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#516987]">entrega</dt>
                  <dd className="mt-1 font-mono text-[9px] uppercase leading-4 tracking-[0.08em] text-[#b6cae8]">{delivery}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#516987]">prazo</dt>
                  <dd className="mt-1 font-mono text-[9px] uppercase leading-4 tracking-[0.08em] text-[#b6cae8]">{duration}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PortfolioProcess() {
  return (
    <section className="archive-chapter relative overflow-hidden border-t border-white/[0.07] bg-[#061226]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:py-28">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5f3fc]">Processo</p>
          <h2 className="mt-5 max-w-md font-display text-[clamp(2.7rem,4.8vw,5.5rem)] font-medium leading-[0.93] tracking-[-0.06em] text-white">
            Do contexto à entrega.
          </h2>
          <p className="mt-6 max-w-sm font-body text-base leading-8 text-[#c0e3f4]">
            Um fluxo curto para reduzir ruído, alinhar expectativas e manter a execução orientada ao objetivo.
          </p>
        </div>

        <div className="divide-y divide-cyan-100/[0.12] border-y border-cyan-100/[0.12]">
          {processSteps.map((step) => (
            <article key={step.number} className="grid gap-5 py-7 sm:grid-cols-[80px_1fr] sm:py-9">
              <span className="font-mono text-xl text-[#67e8f9]">{step.number}</span>
              <div>
                <h3 className="font-display text-2xl font-medium text-white">{step.title}</h3>
                <p className="mt-3 max-w-xl font-body text-sm leading-7 text-[#b9d8e8]">{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
