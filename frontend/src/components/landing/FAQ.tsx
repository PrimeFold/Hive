import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const FAQS = [
  {
    question: "Is Hive free to use?",
    answer: "Yes! Hive is completely free. It's currently in v1 as a learning project, so you can enjoy the core features without any limits.",
  },
  {
    question: "What features are currently supported?",
    answer: "Right now, Hive supports real-time messaging, organized channels, and direct messages between friends.",
  },
  {
    question: "What tech stack is Hive built with?",
    answer: "Hive is built using modern web technologies including React, TypeScript, Tailwind CSS, and WebSockets for real-time communication.",
  },
  {
    question: "Can I contribute or see the code?",
    answer: "Absolutely! This is an open learning project. Feel free to check out the source code and learn how it was put together.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3">
          FAQ
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Questions, answered.
        </h2>
      </motion.div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
              className={`rounded-xl border transition-colors duration-300 overflow-hidden bg-surface ${isOpen ? "border-primary/30" : "border-border"}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none"
              >
                <span className="text-sm md:text-base font-medium text-foreground">{faq.question}</span>
                <Plus className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-out ${isOpen ? "rotate-45 text-primary" : "text-muted-foreground"}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                    <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}