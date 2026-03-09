import Link from "next/link";
import { Leaf, Heart, Shield, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";

export const metadata = {
  title: "Sobre Nutrielys",
  description: "Conoce la historia y la misión de Nutrielys. Snacks naturales y saludables desde Panamá.",
};

const ABOUT_IMAGE = "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop";

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-6xl px-3 py-12 sm:px-4 md:py-16">
      {/* Hero de la página */}
      <div className="relative mb-12 h-64 overflow-hidden rounded-2xl md:h-80">
        <SafeImage
          src={ABOUT_IMAGE}
          alt="Frutas y snacks naturales"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1152px"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="font-serif text-3xl font-medium text-white drop-shadow-lg md:text-4xl lg:text-5xl">
            Sobre Nutrielys
          </h1>
          <p className="mt-2 max-w-xl text-white/95 drop-shadow md:text-lg">
            Marca panameña de snacks naturales: frutas y vegetales deshidratados con sabor y nutrientes.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <p className="text-lg leading-relaxed text-sage-700">
          Somos una marca panameña dedicada a ofrecer snacks naturales de la más alta calidad:
          frutas y vegetales deshidratados que conservan el sabor y los nutrientes, sin añadidos
          artificiales.
        </p>

        <div className="mt-14 space-y-12">
          <section className="rounded-2xl border border-sage-200/60 bg-cream-50/50 p-6 md:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-sage-900 md:text-2xl">
              <Leaf className="h-6 w-6 text-sage-600" />
              Nuestra historia
            </h2>
            <p className="mt-4 leading-relaxed text-sage-700">
              Nutrielys nace del deseo de llevar a tu mesa lo mejor de la naturaleza en un formato
              práctico y delicioso. Seleccionamos frutas y vegetales frescos, los deshidratamos
              con cuidado para preservar su sabor y propiedades, y los entregamos listos para
              disfrutar en cualquier momento.
            </p>
          </section>

          <section className="rounded-2xl border border-sage-200/60 bg-white p-6 shadow-sm md:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-sage-900 md:text-2xl">
              <Heart className="h-6 w-6 text-sage-600" />
              Misión
            </h2>
            <p className="mt-4 leading-relaxed text-sage-700">
              Ofrecer snacks saludables, naturales y accesibles que contribuyan a una alimentación
              consciente. Queremos que cada bocado transmita frescura, calidad y el orgullo de
              lo que produce Panamá.
            </p>
          </section>

          <section className="rounded-2xl border border-sage-200/60 bg-cream-50/50 p-6 md:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-sage-900 md:text-2xl">
              <Shield className="h-6 w-6 text-sage-600" />
              Propuesta de valor
            </h2>
            <p className="mt-4 leading-relaxed text-sage-700">
              Calidad premium, proceso artesanal y transparencia. Sin conservantes ni aditivos
              innecesarios. Productos que puedes compartir con toda la familia, ideales para
              lunch, viajes o un antojo saludable.
            </p>
          </section>

          <section className="rounded-2xl border border-sage-200/60 bg-white p-6 shadow-sm md:p-8">
            <h2 className="flex items-center gap-2 font-serif text-xl font-medium text-sage-900 md:text-2xl">
              <Sparkles className="h-6 w-6 text-sage-600" />
              Enfoque natural y saludable
            </h2>
            <p className="mt-4 leading-relaxed text-sage-700">
              Creemos que comer bien no tiene que ser aburrido. Nuestros productos son una
              alternativa natural a los snacks procesados, manteniendo el sabor que te gusta
              y los beneficios que tu cuerpo agradece.
            </p>
          </section>
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/productos">Ver productos</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contacto">Contactar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
