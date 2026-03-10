import Link from "next/link";
import {
  ArrowRight,
  Leaf,
  Shield,
  Heart,
  Truck,
  Sparkles,
  Apple,
  Zap,
  Star,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/supabase/server";
import { getSiteSettings } from "@/supabase/queries/site-settings";
import { getFeaturedProducts } from "@/supabase/queries/products";
import { formatPrice } from "@/lib/utils";
import { SafeImage } from "@/components/ui/safe-image";

export const dynamic = "force-dynamic";

const HERO_IMAGE = "/img/bannersection.png";
const BENEFITS_IMAGE = "/img/benefitsnutrielys.png";
const ABOUT_IMAGE = "/img/sobrenutrielys.png";

const TESTIMONIALS = [
  {
    name: "Mariana C.",
    role: "Cliente frecuente",
    quote:
      "Los snacks de Nutrielys me salvaron la lonchera de mis hijos. Les encantan y yo estoy tranquila por los ingredientes.",
  },
  {
    name: "Carlos R.",
    role: "Entrenador personal",
    quote:
      "Recomiendo Nutrielys a mis clientes porque son prácticos, sabrosos y no tienen ese exceso de azúcar de otros snacks.",
  },
  {
    name: "Andrea P.",
    role: "Emprendedora",
    quote:
      "El servicio por WhatsApp es rápido y siempre llega todo bien presentado. Se nota el cuidado en cada producto.",
  },
];

const MAIN_OBJECTIVES = [
  "Promover el consumo de alimentos naturales y saludables.",
  "Reducir la merma agrícola aprovechando frutas y vegetales.",
  "Desarrollar productos innovadores, nutritivos y prácticos.",
  "Impulsar una alimentación sostenible y consciente.",
];

export default async function HomePage() {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> = null;
  let featured: Awaited<ReturnType<typeof getFeaturedProducts>> = [];

  try {
    const supabase = await createClient();
    const [settingsData, featuredData] = await Promise.all([
      getSiteSettings(supabase),
      getFeaturedProducts(supabase, 8),
    ]);
    settings = settingsData;
    featured = featuredData ?? [];
  } catch (err) {
    console.error("Home: error cargando datos de Supabase (red/timeout):", err);
  }

  const heroTitle = settings?.hero_title ?? "Alimentación saludable que cuida tu bienestar";
  const heroSubtitle =
    settings?.hero_subtitle ??
    "Transformamos frutas y vegetales naturales en alimentos deshidratados nutritivos, prácticos y deliciosos.";

  return (
    <div className="overflow-x-hidden bg-gradient-to-b from-cream-50 via-white to-cream-50/70">
      <section className="relative min-h-[88vh] overflow-hidden md:min-h-[92vh]">
        <div className="absolute inset-0">
          <SafeImage
            src={HERO_IMAGE}
            alt="Frutas frescas y naturales"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/75" />
        </div>
        <div className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="absolute left-[9%] top-[24%] h-24 w-24 rounded-full bg-warm-mango/30 blur-xl animate-soft-float" />
          <div className="absolute right-[13%] top-[30%] h-32 w-32 rounded-full bg-warm-papaya/30 blur-2xl animate-soft-float-delay" />
          <div className="absolute bottom-[18%] left-[18%] h-20 w-20 rounded-full bg-sage-300/30 blur-xl animate-soft-float" />
        </div>
        <div className="relative mx-auto grid min-h-[88vh] max-w-6xl items-center gap-8 px-3 py-14 text-white sm:px-4 md:min-h-[92vh] lg:grid-cols-[1fr_auto]">
          <div className="mx-auto max-w-3xl text-center lg:mx-0 lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] opacity-0 animate-slide-up">
              <Leaf className="h-3.5 w-3.5" />
              Snacks naturales de Panamá
            </span>
            <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight opacity-0 animate-slide-up drop-shadow-lg md:text-5xl lg:text-6xl xl:text-7xl">
              {heroTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-lg opacity-0 animate-slide-up-delay-1 text-white/95 drop-shadow md:text-xl lg:max-w-xl">
              {heroSubtitle}
            </p>
            <p className="mt-4 max-w-2xl text-sm opacity-0 animate-slide-up-delay-1 text-white/85 md:text-base lg:max-w-xl">
              Transformamos alimentos en opciones prácticas para tu día a día, con enfoque en nutrición, calidad y
              sostenibilidad.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0 animate-slide-up-delay-2 sm:gap-4 lg:justify-start">
              <Button size="lg" asChild className="bg-[#25D366] font-semibold hover:bg-[#20bd5a]">
                <Link href="/productos">Ver productos</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-white/80 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
              >
                <Link href="/contacto">Contactar</Link>
              </Button>
            </div>
          </div>

          <aside className="mx-auto hidden w-full max-w-xs rounded-2xl border border-white/25 bg-white/10 p-5 opacity-0 backdrop-blur-md animate-slide-up-delay-2 lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/90">Esencia Nutrielys</p>
            <div className="mt-4 space-y-3 text-sm text-white/95">
              {[
                "Alimentos deshidratados nutritivos y deliciosos.",
                "Compromiso con el aprovechamiento agrícola.",
                "Marca enfocada en bienestar y consumo consciente.",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-white/90" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-sage-200/60 bg-white py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <h2 className="text-center font-serif text-2xl font-medium text-sage-900 opacity-0 animate-slide-up md:text-3xl">
            Lo que hace especial a Nutrielys
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 xl:gap-7">
            {[
              { icon: Leaf, title: "100% natural", text: "Sin conservantes artificiales.", delay: "animate-slide-up-delay-1" },
              { icon: Shield, title: "Calidad", text: "Ingredientes seleccionados y procesos cuidados.", delay: "animate-slide-up-delay-2" },
              { icon: Heart, title: "Bienestar", text: "Aporta nutrición para un estilo de vida equilibrado.", delay: "animate-slide-up-delay-3" },
              { icon: Truck, title: "Compromiso local", text: "Apoyamos el aprovechamiento agrícola en Panamá.", delay: "animate-slide-up-delay-4" },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border border-sage-200/60 bg-gradient-to-br from-cream-50/80 to-sage-50/50 p-6 text-center opacity-0 ${item.delay} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sage-200/40 lg:p-7`}
              >
                <item.icon className="mx-auto h-10 w-10 text-sage-600 lg:h-11 lg:w-11" />
                <h3 className="mt-3 font-semibold text-sage-800 lg:text-base">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sage-700/90">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-sage-200/60 bg-gradient-to-b from-cream-50/50 to-sage-50/30 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h2 className="font-serif text-2xl font-medium text-sage-900 md:text-3xl">
              Productos disponibles
            </h2>
            <Button variant="outline" asChild className="transition-transform hover:scale-105">
              <Link href="/productos">Ver todos</Link>
            </Button>
          </div>
          {featured.length === 0 ? (
            <p className="mt-10 text-center text-sage-600">
              Aún no hay productos publicados. Crea productos desde el panel de administración para que aparezcan aquí.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product, i) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-2xl border border-sage-200/60 bg-white shadow-sm opacity-0 animate-slide-up transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sage-300/30"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <Link href={`/productos/${product.slug}`} className="block">
                    <div className="aspect-square relative overflow-hidden bg-sage-100/50">
                      {product.image_url ? (
                        <SafeImage
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-warm-papaya/20 to-warm-mango/20">
                          <span className="text-sm font-medium text-sage-600">Sin imagen</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/productos/${product.slug}`} className="block">
                      <h3 className="font-semibold text-sage-900 transition-colors group-hover:text-sage-700">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-sage-600">{formatPrice(product.price)}</p>
                    </Link>
                    <Button asChild size="sm" className="mt-3 w-full">
                      <Link href={`/productos/${product.slug}`}>Pedir producto</Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-sage-200/60 bg-gradient-to-b from-cream-50/50 to-white py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sage-600">Beneficios</p>
              <h2 className="mt-3 font-serif text-2xl font-medium text-sage-900 md:text-3xl">
                Beneficios de nuestros productos
              </h2>
              <p className="mt-3 max-w-md text-sage-700">
                Conservan sabor, textura y valor nutricional. Ideales para meriendas saludables, escuela, deporte y
                rutinas activas.
              </p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-sage-200/70 bg-white shadow-sm">
                <div className="relative aspect-[4/3]">
                  <SafeImage
                    src={BENEFITS_IMAGE}
                    alt="Beneficios de los productos Nutrielys"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 36vw"
                  />
                </div>
                <div className="border-t border-sage-200/70 bg-cream-50/70 p-4 text-sm text-sage-700">
                  Hechos para personas que quieren comer mejor sin complicarse.
                </div>
              </div>
            </div>

            <div className="divide-y divide-sage-200/70 rounded-2xl border border-sage-200/70 bg-white/90 lg:self-center">
              {[
                { icon: Apple, title: "Nutritivos", text: "Aportan bienestar y ayudan a mantener propiedades naturales." },
                { icon: Zap, title: "Prácticos", text: "Fáciles de consumir en cualquier momento del día." },
                { icon: Leaf, title: "Sin conservantes", text: "Ingredientes naturales, sin aditivos artificiales." },
                { icon: Sparkles, title: "Mayor duración", text: "Excelente opción para consumo diario y recetas." },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-5 transition-colors duration-300 hover:bg-cream-50/60 md:gap-5 md:p-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-600">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sage-500">Beneficio {index + 1}</p>
                    <h3 className="mt-1 text-lg font-semibold text-sage-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-sage-700/90">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-sage-200/60 bg-white py-14 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-3 sm:px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sage-600">Sobre Nutrielys</p>
            <h2 className="font-serif text-3xl font-medium text-sage-900 md:text-4xl">
              Nutrición, sostenibilidad e innovación en cada producto
            </h2>
            <p className="text-sage-700">
              Nutrielys nace para transformar frutas y vegetales en alimentos deshidratados de alta calidad,
              contribuyendo al bienestar de las personas y al aprovechamiento responsable de alimentos.
            </p>
            <div className="space-y-3">
              {MAIN_OBJECTIVES.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3 text-sage-800">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-sage-600" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <Button asChild className="mt-2">
              <Link href="/nosotros" className="inline-flex items-center gap-2">
                Descubrir nuestra historia
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-3xl border border-sage-200/70 shadow-lg shadow-sage-200/40 md:h-[360px]">
            <SafeImage
              src={ABOUT_IMAGE}
              alt="Equipo preparando snacks naturales"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
            <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 px-4 py-3 text-sage-900 shadow-lg backdrop-blur">
              <p className="text-xs uppercase tracking-[0.12em] text-sage-600">Compromiso</p>
              <p className="font-semibold">Bienestar, agricultores y sostenibilidad</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-sage-200/60 bg-white py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-sage-600">Testimonios</p>
            <h2 className="mt-3 font-serif text-3xl font-medium text-sage-900 md:text-4xl">
              Lo que dicen nuestros clientes
            </h2>
            <p className="mt-3 text-sage-700">
              Familias, deportistas y personas activas que eligen opciones naturales y nutritivas.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((item, index) => (
              <article
                key={item.name}
                className="rounded-2xl border border-sage-200/70 bg-gradient-to-b from-white to-cream-50/60 p-6 shadow-sm opacity-0 animate-slide-up"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <div className="flex gap-1 text-warm-mango">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={`${item.name}-star-${starIndex}`} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-sage-700">
                  <span aria-hidden>&ldquo;</span>
                  {item.quote}
                  <span aria-hidden>&rdquo;</span>
                </p>
                <p className="mt-5 font-semibold text-sage-900">{item.name}</p>
                <p className="text-xs uppercase tracking-[0.1em] text-sage-600">{item.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-sage-200/60 bg-gradient-to-b from-cream-50/70 to-white py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div className="grid gap-6 rounded-3xl border border-sage-500/30 bg-gradient-to-br from-sage-700 to-sage-800 p-5 text-white shadow-lg shadow-sage-900/20 md:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/95">
                <Mail className="h-3.5 w-3.5 text-white/90" />
                Newsletter
              </p>
              <h2 className="mt-4 font-serif text-2xl font-medium text-white md:text-3xl">
                Suscríbete y recibe novedades directo en tu correo
              </h2>
              <p className="mt-3 max-w-xl text-sage-100">
                Nuevo producto, promociones y recomendaciones saludables. Sin rodeos y sin spam.
              </p>
            </div>

            <form className="rounded-2xl border border-white/25 bg-white/10 p-4 md:p-5">
              <label className="text-sm font-medium text-white" htmlFor="newsletter-email">
                Correo electrónico
              </label>
              <Input
                id="newsletter-email"
                type="email"
                required
                placeholder="tu@correo.com"
                className="mt-2 h-11 border-white/30 bg-white/95 text-sage-900 placeholder:text-sage-500"
              />
              <Button size="lg" className="mt-3 h-11 w-full bg-white px-6 text-sage-900 hover:bg-sage-100">
                Quiero novedades
              </Button>
              <p className="mt-3 text-center text-xs text-sage-100/95">También te atendemos por WhatsApp.</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
