'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, MapPin, Send, Instagram, Linkedin } from 'lucide-react'
import { FaPinterestP } from 'react-icons/fa'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ContactClientProps {
  locale: string
  dict: any
}

export function ContactClient({ locale, dict }: ContactClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Define schema dynamically based on dictionary validation messages
  const contactSchema = z.object({
    name: z.string().min(2, dict.form.validation.name),
    email: z.string().email(dict.form.validation.email),
    phone: z.string().optional(),
    subject: z.string().min(2, dict.form.validation.subject),
    message: z.string().min(10, dict.form.validation.message),
  })

  type ContactFormData = z.infer<typeof contactSchema>

  const contactInfo = [
    {
      icon: Mail,
      label: dict.info.email,
      value: 'info@raiz-interiors.com',
      href: 'mailto:info@raiz-interiors.com',
    },
    {
      icon: MapPin,
      label: dict.info.location.label,
      value: dict.info.location.value,
      href: null,
    },
  ]

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/raiz.interiors.living', label: 'Instagram' },
    { icon: FaPinterestP, href: 'https://pt.pinterest.com/raizinteriorsliving/', label: 'Pinterest' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/raiz-interiors-living', label: 'LinkedIn' },
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    console.log('Form submitted:', data)
    setIsSubmitting(false)
    setIsSubmitted(true)
    reset()

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <>
      {/* Hero Section - Menor */}
      <section className="relative pt-28 pb-8 lg:pt-36 lg:pb-12 bg-[#E3DFDD]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 
              className="font-cormorant text-3xl lg:text-4xl font-light text-stone-800 leading-tight"
              dangerouslySetInnerHTML={{ __html: dict.hero.title }}
            />
            <p className="mt-4 font-inter text-sm text-stone-600 leading-relaxed max-w-lg">
              {dict.hero.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 lg:py-16 bg-[#E3DFDD]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 
                className="font-cormorant text-xl lg:text-2xl font-light text-stone-800 mb-6"
                dangerouslySetInnerHTML={{ __html: dict.info.title }}
              />

              <div className="space-y-8 mb-12">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 flex items-center justify-center shrink-0">
                      <item.icon size={20} className="text-stone-600" />
                    </div>
                    <div>
                      <span className="block font-inter text-xs tracking-[0.15em] uppercase text-stone-400 mb-1">
                        {item.label}
                      </span>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-inter text-base text-stone-800 hover:text-stone-600 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <span className="font-inter text-base text-stone-800">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="font-inter text-xs tracking-[0.2em] uppercase text-stone-500 mb-4">
                  {dict.info.followUs}
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:border-stone-900 transition-all"
                      aria-label={social.label}
                    >
                      <social.icon size={20} />
                    </a>
                  ))}
                </div>
              </motion.div>

            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 
                className="font-cormorant text-xl lg:text-2xl font-light text-stone-800 mb-6"
                dangerouslySetInnerHTML={{ __html: dict.form.title }}
              />

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 bg-green-50 border border-green-200 text-center"
                >
                  <h3 className="font-cormorant text-2xl text-green-800 mb-2">
                    {dict.form.success.title}
                  </h3>
                  <p className="font-inter text-sm text-green-700">
                    {dict.form.success.message}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-inter text-xs tracking-[0.15em] uppercase text-stone-500 mb-2">
                        {dict.form.labels.name}
                      </label>
                      <Input
                        {...register('name')}
                        placeholder={dict.form.placeholders.name}
                        className={cn(
                          'h-12 bg-stone-50 border-stone-200 focus:border-stone-400 rounded-none font-inter text-sm',
                          errors.name && 'border-red-400'
                        )}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">{errors.name.message as string}</p>
                      )}
                    </div>

                    <div>
                      <label className="block font-inter text-xs tracking-[0.15em] uppercase text-stone-500 mb-2">
                        {dict.form.labels.email}
                      </label>
                      <Input
                        {...register('email')}
                        type="email"
                        placeholder={dict.form.placeholders.email}
                        className={cn(
                          'h-12 bg-stone-50 border-stone-200 focus:border-stone-400 rounded-none font-inter text-sm',
                          errors.email && 'border-red-400'
                        )}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email.message as string}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-inter text-xs tracking-[0.15em] uppercase text-stone-500 mb-2">
                        {dict.form.labels.phone}
                      </label>
                      <Input
                        {...register('phone')}
                        placeholder={dict.form.placeholders.phone}
                        className="h-12 bg-stone-50 border-stone-200 focus:border-stone-400 rounded-none font-inter text-sm"
                      />
                    </div>

                    <div>
                      <label className="block font-inter text-xs tracking-[0.15em] uppercase text-stone-500 mb-2">
                        {dict.form.labels.subject}
                      </label>
                      <Input
                        {...register('subject')}
                        placeholder={dict.form.placeholders.subject}
                        className={cn(
                          'h-12 bg-stone-50 border-stone-200 focus:border-stone-400 rounded-none font-inter text-sm',
                          errors.subject && 'border-red-400'
                        )}
                      />
                      {errors.subject && (
                        <p className="mt-1 text-xs text-red-500">{errors.subject.message as string}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-inter text-xs tracking-[0.15em] uppercase text-stone-500 mb-2">
                      {dict.form.labels.message}
                    </label>
                    <Textarea
                      {...register('message')}
                      placeholder={dict.form.placeholders.message}
                      rows={6}
                      className={cn(
                        'bg-stone-50 border-stone-200 focus:border-stone-400 rounded-none font-inter text-sm resize-none',
                        errors.message && 'border-red-400'
                      )}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">{errors.message.message as string}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto h-14 px-10 bg-[#b5adaa] text-white font-inter text-xs tracking-[0.2em] uppercase hover:bg-[#a39d9a] rounded-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        {dict.form.button.sending}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {dict.form.button.send}
                        <Send size={14} />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
