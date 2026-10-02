import { ArrowUpRight, Instagram } from "lucide-react";

const profiles = [
  {
    handle: "@pablogui000",
    label: "arquivo pessoal",
    description: "Bastidores, estudos e registros do processo.",
    url: "https://www.instagram.com/pablogui000/",
  },
  {
    handle: "@mpjstoryworks",
    label: "projetos audiovisuais",
    description: "Captação, eventos e narrativas audiovisuais.",
    url: "https://www.instagram.com/mpjstoryworks/",
  },
];

export default function InstagramRepertoire() {
  return (
    <section id="social" className="archive-chapter border-t border-white/[0.07] bg-[#050c18]">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#67e8f9]">repertório social</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,4.8vw,4rem)] leading-tight tracking-[-0.05em] text-white">O que está em movimento.</h2>
        <p className="mt-4 max-w-2xl font-body text-sm leading-7 text-[#b9ddec]">Acompanhe os registros e trabalhos diretamente nos perfis.</p>
        <div data-social-profiles="true" className="mt-6 grid gap-3 sm:grid-cols-2">
          {profiles.map((profile) => (
            <a key={profile.handle} href={profile.url} target="_blank" rel="noopener noreferrer" aria-label={`${profile.handle}, abrir no Instagram`} className="group flex min-h-28 items-center gap-4 border border-white/10 bg-[#071326] p-5 transition-colors hover:border-[#67e8f9]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
              <Instagram className="h-6 w-6 shrink-0 text-[#67e8f9]" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block font-mono text-[9px] uppercase tracking-[0.1em] text-[#8fa8c7]">{profile.label}</span>
                <span className="mt-1 block font-display text-xl text-white">{profile.handle}</span>
                <span className="mt-2 block font-body text-sm leading-6 text-[#b9ddec]">{profile.description}</span>
              </span>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-[#67e8f9]" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
