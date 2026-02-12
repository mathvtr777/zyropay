import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* ─── Animation Helpers ─── */
function Section({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } } };

/* ─── Data ─── */
const partners = [
  { icon: "account_balance", name: "STRIPE" },
  { icon: "payments", name: "PAYPAL" },
  { icon: "credit_card", name: "VISA" },
  { icon: "universal_currency", name: "MASTERCARD" },
  { icon: "qr_code_2", name: "PIX" },
  { icon: "storefront", name: "MERCADO PAGO" },
];

const features = [
  { icon: "speed", title: "Fast Checkout", subtitle: "Performance máxima", description: "Otimizado para carregar em milissegundos. Reduza o abandono em até 40% com nossa tecnologia de 1-click buy." },
  { icon: "shield", title: "Segurança Total", subtitle: "Certificação Bancária", description: "Proteção antifraude avançada com IA e conformidade PCI DSS Nível 1 para garantir a integridade de cada transação." },
  { icon: "hub", title: "Smart Routing", subtitle: "Multiadquirência", description: "Roteamento inteligente que seleciona automaticamente o melhor gateway para garantir a maior taxa de aprovação." },
  { icon: "palette", title: "Checkout Customizável", subtitle: "Sua marca, suas regras", description: "Personalize cada detalhe: cores, tipografia, layout, campos e elementos de confiança. Sem código." },
  { icon: "bar_chart", title: "Analytics Profundo", subtitle: "Dados em tempo real", description: "Monitore conversões, ticket médio, funil de pagamento e abandono em dashboards interativos." },
  { icon: "sync_alt", title: "Fallback Automático", subtitle: "Zero downtime", description: "Se um gateway cai, o tráfego migra automaticamente para o próximo disponível sem impactar o comprador." },
];

const stats = [
  { value: "99.2%", label: "Taxa de aprovação", icon: "verified" },
  { value: "1.2s", label: "Processamento", icon: "bolt" },
  { value: "40%", label: "Menos abandono", icon: "trending_down" },
  { value: "24/7", label: "Suporte ativo", icon: "support_agent" },
];

const steps = [
  { num: "01", title: "Conecte", description: "Integre seu gateway favorito em minutos com nossa API plug-and-play.", icon: "link" },
  { num: "02", title: "Personalize", description: "Customize cores, logo, campos e elementos de confiança no builder visual.", icon: "brush" },
  { num: "03", title: "Publique", description: "Gere links de checkout ou integre botões diretamente no seu site.", icon: "rocket_launch" },
  { num: "04", title: "Escale", description: "Acompanhe métricas, otimize conversões e cresça sem limites.", icon: "trending_up" },
];

const footerLinks = {
  Produto: ["Checkout", "Pagamentos PIX", "Marketplace", "API Reference"],
  Empresa: ["Sobre nós", "Carreiras", "Blog", "Parceiros"],
  Suporte: ["Documentação", "Central de Ajuda", "Status", "Contato"],
  Legal: ["Privacidade", "Termos de Uso", "Cookies"],
};

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white antialiased overflow-x-hidden" style={{ backgroundColor: "#050505" }}>
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-primary/15 blur-[160px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/8 blur-[120px]" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* ─── NAV ─── */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050505]/70 backdrop-blur-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl">payments</span>
            </div>
            <h2 className="text-white text-xl font-extrabold tracking-tight">PRIVA</h2>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Recursos", "Como Funciona", "Preços"].map((item) => (
              <a key={item} className="text-white/40 hover:text-white text-sm font-medium transition-colors duration-300" href={`#${item.toLowerCase().replace(/ /g, "-")}`}>
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="hidden sm:block text-white/50 text-sm font-semibold hover:text-white transition-colors uppercase tracking-wider">
              Login
            </Link>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold py-2.5 px-6 rounded-full shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-105">
                Começar agora
              </Button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-20 md:pt-32 pb-24 md:pb-40 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              Infraestrutura Premium de Pagamentos
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight leading-[1.02]"
            >
              O checkout
              <br />
              <span className="bg-gradient-to-r from-white via-purple-300 to-primary bg-clip-text text-transparent">
                feito para escalar.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-white/35 text-lg md:text-xl leading-relaxed max-w-2xl"
            >
              Roteamento inteligente, PIX instantâneo e segurança de nível militar — tudo em uma experiência de checkout premium que converte.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-2"
            >
              <Link to="/auth">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold py-5 px-10 h-auto rounded-full shadow-2xl shadow-primary/30 flex items-center gap-2 transition-all hover:scale-105 hover:shadow-primary/50">
                  Criar conta grátis
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Button>
              </Link>
              <Button variant="ghost" className="text-white/50 hover:text-white text-lg font-semibold py-5 px-10 h-auto rounded-full hover:bg-white/5 transition-all">
                Ver demo ao vivo
              </Button>
            </motion.div>
          </div>

          {/* Stats Row */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="rounded-2xl p-6 bg-white/[0.03] backdrop-blur-md border border-white/[0.06] hover:border-primary/40 transition-all duration-500 group hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary/60 group-hover:text-primary text-sm transition-colors">{stat.icon}</span>
                  <p className="text-white/30 text-[11px] font-semibold uppercase tracking-widest">{stat.label}</p>
                </div>
                <p className="text-3xl md:text-4xl font-extrabold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── PARTNERS ─── */}
      <Section className="py-14 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-white/15 text-[11px] font-semibold uppercase tracking-[0.25em] mb-8">
            Integrado com os maiores players do mercado
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {partners.map((p) => (
              <div key={p.name} className="flex items-center gap-2 text-white/15 hover:text-white/40 transition-colors duration-300">
                <span className="material-symbols-outlined text-xl">{p.icon}</span>
                <span className="text-xs font-bold tracking-wider">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── FEATURES ─── */}
      <section className="py-28 md:py-36 relative z-10" id="recursos">
        <div className="max-w-7xl mx-auto px-6">
          <Section className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">Recursos</p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Tudo para{" "}
              <span className="bg-gradient-to-r from-white via-purple-300 to-primary bg-clip-text text-transparent">
                maximizar
              </span>{" "}
              sua conversão.
            </h2>
            <p className="text-white/30 text-lg leading-relaxed">
              Uma plataforma completa de checkout que combina velocidade, segurança e personalização total.
            </p>
          </Section>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="rounded-2xl p-8 bg-white/[0.02] backdrop-blur-md border border-white/[0.06] hover:border-primary/40 transition-all duration-500 group hover:-translate-y-1 hover:bg-white/[0.04]"
              >
                <div className="size-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-500">
                  <span className="material-symbols-outlined text-primary text-2xl">{f.icon}</span>
                </div>
                <h3 className="text-white text-lg font-bold mb-1">{f.title}</h3>
                <p className="text-primary/70 text-sm font-semibold mb-3">{f.subtitle}</p>
                <p className="text-white/30 leading-relaxed text-sm">{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-28 md:py-36 border-t border-white/5 relative z-10" id="como-funciona">
        <div className="max-w-7xl mx-auto px-6">
          <Section className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4">Como Funciona</p>
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Do zero ao checkout
              <br />
              <span className="bg-gradient-to-r from-white via-purple-300 to-primary bg-clip-text text-transparent">
                em minutos.
              </span>
            </h2>
          </Section>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="relative rounded-2xl p-8 bg-white/[0.02] border border-white/[0.06] hover:border-primary/40 transition-all duration-500 group hover:-translate-y-1"
              >
                <span className="text-[80px] font-black text-white/[0.03] absolute top-2 right-4 leading-none select-none group-hover:text-primary/[0.08] transition-colors duration-500">
                  {step.num}
                </span>
                <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-500">
                  <span className="material-symbols-outlined text-primary text-xl">{step.icon}</span>
                </div>
                <h3 className="text-white text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-white/30 text-sm leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── DASHBOARD PREVIEW ─── */}
      <section className="py-28 md:py-36 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <Section className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Gestão completa na
              <br />
              <span className="bg-gradient-to-r from-white via-purple-300 to-primary bg-clip-text text-transparent">
                palma da sua mão.
              </span>
            </h2>
          </Section>

          <Section delay={0.2}>
            <div className="relative max-w-5xl mx-auto">
              {/* Glow behind */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-3xl opacity-50" />
              {/* Dashboard mockup */}
              <div className="relative bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                {/* Title bar */}
                <div className="h-11 bg-white/[0.03] border-b border-white/[0.06] flex items-center px-5 gap-2">
                  <div className="size-3 rounded-full bg-white/10" />
                  <div className="size-3 rounded-full bg-white/10" />
                  <div className="size-3 rounded-full bg-white/10" />
                  <span className="ml-4 text-white/20 text-xs font-medium">PRIVA Dashboard</span>
                </div>
                {/* Content */}
                <div className="p-8 md:p-12 grid md:grid-cols-3 gap-8">
                  {/* Sidebar */}
                  <div className="flex flex-col gap-4">
                    <div className="h-8 w-28 bg-primary/20 rounded-lg" />
                    <div className="space-y-2 mt-4">
                      {[60, 45, 55, 40, 35].map((w, i) => (
                        <div key={i} className="h-8 rounded-lg bg-white/[0.04] border border-white/[0.04]" style={{ width: `${w + 20}%` }} />
                      ))}
                    </div>
                  </div>
                  {/* Main */}
                  <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 rounded-xl bg-primary/10 border border-primary/20 p-4 flex flex-col justify-between">
                        <div className="h-3 w-16 bg-primary/30 rounded" />
                        <div className="h-5 w-20 bg-white/10 rounded" />
                      </div>
                      <div className="h-24 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex flex-col justify-between">
                        <div className="h-3 w-14 bg-white/10 rounded" />
                        <div className="h-5 w-16 bg-white/[0.06] rounded" />
                      </div>
                      <div className="h-24 rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex flex-col justify-between">
                        <div className="h-3 w-12 bg-white/10 rounded" />
                        <div className="h-5 w-18 bg-white/[0.06] rounded" />
                      </div>
                    </div>
                    {/* Chart placeholder */}
                    <div className="h-44 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-end p-6 gap-3">
                      {[35, 55, 45, 70, 60, 80, 50, 65, 75, 90, 70, 85].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary/10"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-28 md:py-36 relative z-10">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(140, 43, 238, 0.15) 0%, transparent 60%)" }} />
        <div className="max-w-7xl mx-auto px-6 relative">
          <Section className="text-center max-w-3xl mx-auto flex flex-col items-center gap-8">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Escalar sua operação
              <br />
              nunca foi tão{" "}
              <span className="bg-gradient-to-r from-white via-purple-300 to-primary bg-clip-text text-transparent">
                elegante.
              </span>
            </h2>
            <p className="text-white/30 text-lg leading-relaxed max-w-xl">
              Pronto para dar o próximo passo? Comece agora e veja a diferença na sua taxa de conversão.
            </p>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold py-5 px-12 h-auto rounded-full shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50 animate-pulse-glow">
                Criar minha conta grátis
              </Button>
            </Link>
            <div className="flex items-center gap-8 text-white/25 text-sm">
              {["Sem taxas de adesão", "Setup em 2 minutos", "Suporte 24/7"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary/60 text-base">check_circle</span>
                  {t}
                </span>
              ))}
            </div>
          </Section>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 pt-16 pb-8 relative z-10" style={{ backgroundColor: "#0B0B0B" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-sm">payments</span>
                </div>
                <h2 className="text-white text-lg font-extrabold tracking-tight">PRIVA</h2>
              </div>
              <p className="text-white/25 text-sm leading-relaxed mb-6 max-w-xs">
                Elevando o padrão de pagamentos digitais. Performance, segurança e conversão em uma única infraestrutura.
              </p>
              <div className="flex gap-3">
                {["share", "groups", "alternate_email"].map((icon) => (
                  <a key={icon} href="#" className="size-9 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/25 hover:text-white hover:border-primary/30 transition-all duration-300">
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </a>
                ))}
              </div>
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-white/80 font-bold text-sm mb-4">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/25 hover:text-white text-sm transition-colors duration-300">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/15 text-xs">© 2024 PRIVA Payments S.A. Todos os direitos reservados.</p>
            <div className="flex gap-6 text-white/15 text-xs">
              <span>Brasil</span>
              <span>Estados Unidos</span>
              <span>Europa</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Material Icons */}
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
    </div>
  );
}
