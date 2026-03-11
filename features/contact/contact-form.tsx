import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CONTACT_EMAIL = "info@nutrileys.com";

export function ContactForm() {
  return (
    <form
      action={`https://formsubmit.co/${CONTACT_EMAIL}`}
      method="POST"
      className="mt-4 space-y-4"
    >
      <input type="hidden" name="_subject" value="Nuevo mensaje desde Contacto - Nutrielys" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" className="mt-1" required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" className="mt-1" required />
      </div>
      <div>
        <Label htmlFor="message">Mensaje</Label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>
      <Button type="submit">Enviar mensaje</Button>
      <p className="text-xs text-sage-600">
        El mensaje se enviará directamente a {CONTACT_EMAIL}.
      </p>
    </form>
  );
}
