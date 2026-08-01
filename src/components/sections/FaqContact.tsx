'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Reveal, Eyebrow, Magnetic, EASE } from '@/components/ui/primitives';

// ─── FAQ ──────────────────────────────────────────────────
export const faqs = [
  {
    q: '¿Cuánto tiempo toma obtener una licencia ambiental en Guatemala?',
    r: 'Depende del tipo de proyecto y su categoría. Los proyectos de bajo impacto pueden resolverse en 2-3 meses, mientras que los de alto impacto pueden tomar 6-12 meses. Te damos un cronograma realista desde la primera reunión.',
  },
  {
    q: '¿Qué documentos necesito para iniciar el trámite?',
    r: 'Los requisitos varían según el proyecto y la entidad (MARN, INAB, CONAP o municipalidad). En general se necesita: escritura del terreno, planos, descripción del proyecto y estudio de impacto ambiental. Nosotros te guiamos con una lista personalizada.',
  },
  {
    q: '¿Trabajan solo en la ciudad de Guatemala?',
    r: 'No. Trabajamos en todo el territorio guatemalteco. Hemos gestionado proyectos en Petén, Izabal, Alta Verapaz, Escuintla y más. Nos desplazamos según las necesidades del proyecto.',
  },
  {
    q: '¿Qué incluye el acompañamiento de CREA PROYECTOS?',
    r: 'Acompañamiento integral: diagnóstico inicial, preparación de estudios, gestión ante entidades, seguimiento de trámites y entrega de licencias. También ofrecemos auditorías ambientales y planes de manejo.',
  },
  {
    q: '¿Cuánto cuestan sus servicios?',
    r: 'Cada proyecto es único. El costo depende de la complejidad, las entidades involucradas y los plazos. Ofrecemos una consultoría inicial gratuita para evaluar tu proyecto y darte un presupuesto claro.',
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative bg-crema py-28 md:py-40 px-6 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sticky heading */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Eyebrow num="04" label="Preguntas frecuentes" />
            <h2 className="text-carbon font-semibold tracking-tight leading-[1.02] text-4xl md:text-5xl lg:text-[3.6rem] mb-6">
              <Reveal>
                Resolvemos tus
                <br />
                <em className="font-display font-light italic text-teal">dudas.</em>
              </Reveal>
            </h2>
            <Reveal delay={0.12}>
              <p className="text-carbon/60 text-sm md:text-base leading-relaxed max-w-sm mb-8">
                Lo que empresarios y municipalidades nos preguntan antes de iniciar sus trámites
                ambientales en Guatemala.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-teal hover:gap-3.5 transition-all duration-300"
              >
                ¿OTRA PREGUNTA? ESCRÍBENOS <Send size={12} />
              </button>
            </Reveal>
          </div>
        </div>

        {/* Accordion */}
        <div className="lg:col-span-7">
          <div className="border-t border-carbon/10">
            {faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={i} delay={i * 0.05} y={24}>
                  <div className="border-b border-carbon/10">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group w-full flex items-center gap-5 py-6 md:py-7 text-left"
                      data-cursor="hover"
                    >
                      <span className={`font-mono text-[10px] tracking-[0.2em] shrink-0 transition-colors duration-300 ${isOpen ? 'text-teal' : 'text-carbon/30'}`}>
                        0{i + 1}
                      </span>
                      <span className={`flex-1 font-display text-lg md:text-[1.35rem] tracking-tight transition-colors duration-300 ${isOpen ? 'text-teal-deep' : 'text-carbon group-hover:text-teal-deep'}`}>
                        {faq.q}
                      </span>
                      <motion.span
                        className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          isOpen ? 'bg-teal border-teal text-crema' : 'border-carbon/15 text-carbon/50 group-hover:border-teal group-hover:text-teal'
                        }`}
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <Plus size={15} strokeWidth={1.5} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <p className="pl-12 pr-14 pb-7 text-carbon/60 text-sm leading-relaxed">
                            {faq.r}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────
const contactRows = [
  { icon: Mail, label: 'CORREO', value: 'info@creaproyectos.com', href: 'mailto:info@creaproyectos.com' },
  { icon: Phone, label: 'WHATSAPP', value: '+502 5413 7785', href: 'https://wa.me/50254137785?text=Quiero%20informaci%C3%B3n' },
  { icon: MapPin, label: 'UBICACIÓN', value: 'Guatemala, Centroamérica' },
  { icon: Clock, label: 'HORARIO', value: 'Lun – Vie · 8:00 a 17:00' },
];

const projectTypes = [
  'Licencia ambiental',
  'Licencia forestal',
  'Obra civil / construcción',
  'Licencia + obra (integral)',
  'Otro',
];

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: projectTypes[0], message: '' });

  // Primary channel: WhatsApp with a pre-filled, structured message.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = [
      'Hola CREA PROYECTOS, quiero información sobre mi proyecto.',
      '',
      `Nombre: ${form.name}`,
      form.email && `Correo: ${form.email}`,
      form.phone && `Teléfono: ${form.phone}`,
      `Tipo de proyecto: ${form.type}`,
      form.message && `Detalle: ${form.message}`,
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/50254137785?text=${encodeURIComponent(text)}`, '_blank');
  };

  const inputCls =
    'w-full bg-transparent border-b border-carbon/15 pb-3 text-carbon text-sm focus:border-teal outline-none transition-colors duration-300 placeholder:text-carbon/25';
  const labelCls = 'font-mono text-[9px] tracking-[0.3em] text-carbon/45 block mb-2.5';

  return (
    <section id="contact" className="relative bg-white py-28 md:py-40 px-6 md:px-12 lg:px-16 overflow-hidden">
      {/* soft radial tint */}
      <div className="absolute -top-40 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(60,110,128,0.06), transparent 65%)' }} />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left: pitch + contact data */}
        <div className="lg:col-span-5">
          <Eyebrow num="05" label="Contacto" />
          <h2 className="text-carbon font-semibold tracking-tight leading-[0.98] text-5xl md:text-6xl lg:text-[4.6rem] mb-8">
            <Reveal>
              Hablemos de
              <br />
              <em className="font-display font-light italic bg-gradient-to-r from-teal to-verde bg-clip-text text-transparent">
                tu proyecto.
              </em>
            </Reveal>
          </h2>
          <Reveal delay={0.12}>
            <p className="text-carbon/60 text-sm md:text-base leading-relaxed max-w-sm mb-12">
              Cuéntanos sobre tu proyecto. Te asesoramos sobre los requisitos ambientales,
              forestales y municipales necesarios para su viabilidad — la primera consulta es gratuita.
            </p>
          </Reveal>

          <div className="space-y-1">
            {contactRows.map((row, i) => (
              <Reveal key={row.label} delay={0.15 + i * 0.07}>
                {row.href ? (
                  <a
                    href={row.href}
                    target={row.href.startsWith('http') ? '_blank' : undefined}
                    rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-5 py-4 border-b border-carbon/8 hover:border-teal/30 transition-colors"
                    data-cursor="hover"
                  >
                    <span className="w-11 h-11 rounded-full bg-teal/8 flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-crema transition-colors duration-300 shrink-0">
                      <row.icon size={17} strokeWidth={1.4} />
                    </span>
                    <span>
                      <span className="block font-mono text-[9px] tracking-[0.3em] text-carbon/40 mb-0.5">{row.label}</span>
                      <span className="text-[15px] text-carbon group-hover:text-teal-deep transition-colors">{row.value}</span>
                    </span>
                  </a>
                ) : (
                  <div className="flex items-center gap-5 py-4 border-b border-carbon/8">
                    <span className="w-11 h-11 rounded-full bg-teal/8 flex items-center justify-center text-teal shrink-0">
                      <row.icon size={17} strokeWidth={1.4} />
                    </span>
                    <span>
                      <span className="block font-mono text-[9px] tracking-[0.3em] text-carbon/40 mb-0.5">{row.label}</span>
                      <span className="text-[15px] text-carbon">{row.value}</span>
                    </span>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>

        {/* Right: form card */}
        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <motion.form
              onSubmit={handleSubmit}
              className="relative bg-crema rounded-3xl p-8 md:p-12 lg:p-14 border border-carbon/5 shadow-sm overflow-hidden"
              whileHover={{ boxShadow: '0 24px 80px rgba(60,110,128,0.10)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal via-verde to-arena" />
              <p className="font-mono text-[10px] tracking-[0.3em] text-carbon/45 mb-10">
                SOLICITUD DE CONSULTA GRATUITA
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-9 mb-9">
                <div>
                  <label htmlFor="cf-name" className={labelCls}>01 — NOMBRE *</label>
                  <input
                    id="cf-name" type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls} placeholder="Tu nombre o empresa"
                  />
                </div>
                <div>
                  <label htmlFor="cf-email" className={labelCls}>02 — CORREO *</label>
                  <input
                    id="cf-email" type="email" required value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls} placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label htmlFor="cf-phone" className={labelCls}>03 — TELÉFONO</label>
                  <input
                    id="cf-phone" type="tel" value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputCls} placeholder="+502 ····"
                  />
                </div>
                <div>
                  <label htmlFor="cf-type" className={labelCls}>04 — TIPO DE PROYECTO</label>
                  <select
                    id="cf-type" value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className={`${inputCls} appearance-none bg-transparent`}
                  >
                    {projectTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="cf-msg" className={labelCls}>05 — CUÉNTANOS DE TU PROYECTO</label>
                  <textarea
                    id="cf-msg" rows={3} value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`${inputCls} resize-none`} placeholder="Ubicación, tipo de obra, estado actual del trámite…"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <p className="text-[11px] text-carbon/40 leading-relaxed max-w-[240px]">
                  Al enviar, abriremos WhatsApp con tu mensaje listo. Respondemos en menos de 24 horas.
                </p>
                <Magnetic strength={30}>
                  <button
                    type="submit"
                    className="group relative inline-flex items-center gap-3 bg-teal text-crema font-mono text-[11px] tracking-[0.2em] px-9 py-4 rounded-full overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-night translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out" />
                    <span className="relative z-10 flex items-center gap-2.5">
                      <MessageCircle size={14} strokeWidth={1.6} />
                      ENVIAR POR WHATSAPP
                    </span>
                  </button>
                </Magnetic>
              </div>
            </motion.form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
