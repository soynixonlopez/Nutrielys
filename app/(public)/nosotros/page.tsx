import Link from "next/link";
import { Leaf, Heart, Eye, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";

export const metadata = {
  title: "Sobre Nutrielys",
  description: "Conoce la historia y la misión de Nutrielys. Snacks naturales y saludables desde Panamá.",
};

const ABOUT_IMAGE = "/img/sobrenutrielysbanner.png";
const SUPPORT_IMAGE = "/img/sobrenutrielys.png";

const HIGHLIGHTS = [
  "Alimentos deshidratados naturales y nutritivos.",
  "Aprovechamiento responsable para reducir merma agrícola.",
  "Calidad, innovación y sostenibilidad en cada producto.",
];

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-6xl px-3 py-12 sm:px-4 md:py-16">
      <div className="relative mb-12 h-72 overflow-hidden rounded-3xl md:h-96">
        <SafeImage
          src={ABOUT_IMAGE}
          alt="Frutas y snacks naturales"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1152px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="font-serif text-3xl font-medium text-white drop-shadow-lg md:text-4xl lg:text-5xl">
            Sobre Nutrielys
          </h1>
          <p className="mt-2 max-w-xl text-white/95 drop-shadow md:text-lg">
            Marca panameña de snacks naturales: frutas y vegetales deshidratados con sabor y nutrientes.
          </p>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <article className="rounded-3xl border border-sage-200/70 bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-sage-600">Nuestra historia</p>
          <h2 className="mt-3 font-serif text-3xl font-medium text-sage-900 md:text-4xl">
            Menos desperdicio, más bienestar
          </h2>
          <p className="mt-4 leading-relaxed text-sage-700">
            Nutrielys nace para transformar frutas y vegetales en alimentos deshidratados nutritivos, prácticos y de
            mayor duración. Así impulsamos una alimentación más consciente y el aprovechamiento responsable de la
            producción agrícola.
          </p>
          <div className="mt-6 space-y-3">
            {HIGHLIGHTS.map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-sage-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
                {item}
              </div>
            ))}
          </div>
        </article>

        <div className="relative h-[280px] overflow-hidden rounded-3xl border border-sage-200/70 shadow-sm md:h-[360px]">
          <SafeImage
            src={SUPPORT_IMAGE}
            alt="Proceso de alimentos deshidratados Nutrielys"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-sage-200/70 bg-cream-50/70 p-6">
          <h3 className="flex items-center gap-2 font-serif text-2xl text-sage-900">
            <Heart className="h-5 w-5 text-sage-600" />
            Misión
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-sage-700">
            Ofrecer alimentos deshidratados naturales y nutritivos que promuevan hábitos saludables, con calidad e
            innovación responsable.
          </p>
        </article>

        <article className="rounded-2xl border border-sage-200/70 bg-white p-6">
          <h3 className="flex items-center gap-2 font-serif text-2xl text-sage-900">
            <Eye className="h-5 w-5 text-sage-600" />
            Visión
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-sage-700">
            Ser una marca referente en alimentos deshidratados saludables y sostenibles, reconocida por su impacto en
            la nutrición y la calidad de vida.
          </p>
        </article>
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-sage-200/60 bg-gradient-to-br from-sage-700 to-sage-800 p-6 text-white md:p-8">
        <h3 className="flex items-center gap-2 font-serif text-2xl">
          <Leaf className="h-5 w-5" />
          Compromiso Nutrielys
        </h3>
        <p className="mt-3 max-w-3xl text-sage-100">
          Apostamos por ingredientes reales, procesos cuidados y una relación más sostenible con los alimentos y los
          agricultores.
        </p>
      </section>

      <div className="mt-14 flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/productos">Ver productos</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contacto">Contactar</Link>
        </Button>
      </div>
    </div>
  );
}
