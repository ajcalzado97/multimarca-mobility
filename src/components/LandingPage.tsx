import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Smartphone, TrendingUp, Shield, HeadphonesIcon, CheckCircle, ArrowRight, ChevronDown, Star } from 'lucide-react';
import { Calculator } from './Calculator';
import { VodafoneLogo } from './VodafoneLogo';
import { ContactForm, ContactFormData } from './ContactForm';
import { submitLeadToGoogleForm } from '../utils/googleForm';
import { buildOfferSummary } from '../utils/offerSummary';

interface PackageConfig {
  withFiber: boolean;
  fiberSpeed: '600Mbps' | '1Gbps' | null;
  firstLinePlan: string | null;
  mobileGroups: Array<{ id: string; plan: string; quantity: number }>;
  vat21: boolean;
  subtotal: number;
  vat: number;
  total: number;
  totalLines: number;
}

export function LandingPage() {
  const navigate = useNavigate();
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageConfig | null>(null);

  const scrollToCalculator = () => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handlePackageSelect = (packageConfig: PackageConfig) => {
    setSelectedPackage(packageConfig);
    setShowContactForm(true);
  };

  const handleContactSubmit = async (data: ContactFormData) => {
    if (!selectedPackage) return;

    const offerSummary = buildOfferSummary(selectedPackage);

    await submitLeadToGoogleForm({
      ...data,
      offerSummary
    });
  };

  const handleContactSuccess = (data: ContactFormData) => {
    if (!selectedPackage) return;

    // Navegar a la página de gracias con los datos del cliente y la configuración del paquete
    navigate(
      `/gracias?method=${data.contactMethod}&name=${encodeURIComponent(data.name)}&config=${encodeURIComponent(JSON.stringify(selectedPackage))}`
    );
  };

  const handleCloseContactForm = () => {
    setShowContactForm(false);
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <VodafoneLogo className="h-10" />
              <span className="text-sm text-vodafone-gray-500 font-medium">Empresas</span>
            </div>
            <button
              onClick={scrollToCalculator}
              className="bg-vodafone-red hover:bg-vodafone-red-dark text-white px-6 py-2.5 rounded-lg font-semibold transition-colors text-sm"
            >
              Calcular mi oferta
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Calculator */}
      <section className="bg-vodafone-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Left side - Info */}
            <div className="lg:col-span-2 bg-gradient-to-br from-vodafone-red via-vodafone-red-dark to-vodafone-red-dark text-white rounded-2xl p-5">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-medium mb-2">
                Soluciones para PYMES y Autónomos
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
                Conecta tu negocio con la mejor tecnología
              </h1>
              <p className="text-sm mb-3 text-white/90 leading-relaxed">
                Fibra ultrarrápida, minutos ilimitados y soluciones digitales diseñadas para impulsar tu empresa
              </p>

              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg flex items-center gap-1.5">
                  <Wifi className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="font-bold text-xs leading-tight">1 Gbps</p>
                    <p className="text-xs text-white/80 leading-tight">Fibra</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="font-bold text-xs leading-tight">Hasta 15</p>
                    <p className="text-xs text-white/80 leading-tight">Líneas</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg flex items-center gap-1.5">
                  <Shield className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="font-bold text-xs leading-tight">Secure Net</p>
                    <p className="text-xs text-white/80 leading-tight">Incluido</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="font-bold text-xs leading-tight">100%</p>
                    <p className="text-xs text-white/80 leading-tight">Escalable</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Minutos ilimitados nacionales</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Roaming en la UE incluido</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>5G sin coste adicional</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Instalación y router Wi-Fi 6</span>
                </div>
              </div>

              {/* Imagen de oferta Vodafone */}
              <div className="hidden lg:flex flex-col items-center justify-center mt-4 gap-3">
                <div className="relative w-full">
                  <img
                    src="/images/Oferta Vodafone.jpg"
                    alt="Oferta Vodafone"
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </div>
                <button
                  onClick={() => handlePackageSelect({
                    withFiber: true,
                    fiberSpeed: '600Mbps',
                    firstLinePlan: null,
                    mobileGroups: [
                      { id: '1', plan: 'ILIMITADA', quantity: 1 },
                      { id: '2', plan: '25GB', quantity: 1 }
                    ],
                    vat21: false,
                    subtotal: 37.85,
                    vat: 7.95,
                    total: 45.80,
                    totalLines: 2
                  })}
                  className="w-full bg-white hover:bg-yellow-400 text-vodafone-red hover:text-vodafone-red-dark px-8 py-4 rounded-xl font-black text-xl transition-all shadow-2xl hover:shadow-3xl hover:scale-105 border-4 border-white"
                >
                  ¡Quiero esta oferta!
                </button>
              </div>
            </div>

            {/* Right side - Calculator */}
            <div ref={calculatorRef} className="lg:col-span-3">
              <div className="text-center mb-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <VodafoneLogo className="h-7" />
                  <span className="text-vodafone-gray-400">|</span>
                  <h2 className="text-lg font-bold text-vodafone-gray-900">
                    Calculadora de ofertas
                  </h2>
                </div>
                <p className="text-xs text-vodafone-gray-600">
                  Configura tu plan y obtén un presupuesto al instante
                </p>
              </div>
              <Calculator />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-vodafone-gray-900 mb-2">
              ¿Por qué elegir Vodafone Empresas?
            </h2>
            <p className="text-base text-vodafone-gray-600 max-w-3xl mx-auto">
              Soluciones integrales de conectividad y comunicación para hacer crecer tu negocio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-vodafone-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-vodafone-red/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Wifi className="w-6 h-6 text-vodafone-red" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-vodafone-gray-900 mb-2">
                    Fibra ultrarrápida
                  </h3>
                  <p className="text-sm text-vodafone-gray-600 mb-3">
                    Hasta 1 Gbps con Wi-Fi 6, instalación y router incluidos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-vodafone-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-vodafone-red/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Smartphone className="w-6 h-6 text-vodafone-red" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-vodafone-gray-900 mb-2">
                    Minutos ilimitados
                  </h3>
                  <p className="text-sm text-vodafone-gray-600 mb-3">
                    Desde 25GB hasta ilimitados, minutos ilimitados, Roaming UE y 5G incluido.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-vodafone-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-vodafone-red/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-6 h-6 text-vodafone-red" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-vodafone-gray-900 mb-2">
                    Secure Net incluido
                  </h3>
                  <p className="text-sm text-vodafone-gray-600 mb-3">
                    Protección avanzada contra malware y amenazas en línea sin coste adicional.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-vodafone-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-vodafone-red/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-vodafone-red" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-vodafone-gray-900 mb-2">
                    100% escalable
                  </h3>
                  <p className="text-sm text-vodafone-gray-600 mb-3">
                    Hasta 15 líneas móviles. Añade o reduce sin penalización.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-vodafone-gray-50 p-6 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-vodafone-red/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <HeadphonesIcon className="w-6 h-6 text-vodafone-red" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-vodafone-gray-900 mb-2">
                    Soporte 24/7
                  </h3>
                  <p className="text-sm text-vodafone-gray-600 mb-3">
                    Atención prioritaria con gestor de cuenta dedicado.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-vodafone-red to-vodafone-red-dark p-6 rounded-xl text-white">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">
                    Todo incluido
                  </h3>
                  <p className="text-sm text-white/90 mb-3">
                    Factura única, 12 meses de permanencia.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Paquetes Predefinidos Recomendados */}
      <section className="py-16 bg-vodafone-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-vodafone-gray-900 mb-3">
              Paquetes recomendados
            </h2>
            <p className="text-base text-vodafone-gray-600 max-w-2xl mx-auto">
              Elige el plan perfecto para tu negocio con nuestras ofertas más populares
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Oferta especial - Solo móvil */}
            <div className="lg:hidden md:col-span-3 flex flex-col items-center justify-center gap-3">
              <div className="relative w-full">
                <img
                  src="/images/Oferta Vodafone.jpg"
                  alt="Oferta Vodafone"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
              <button
                onClick={() => handlePackageSelect({
                  withFiber: true,
                  fiberSpeed: '600Mbps',
                  firstLinePlan: null,
                  mobileGroups: [
                    { id: '1', plan: 'ILIMITADA', quantity: 1 },
                    { id: '2', plan: '25GB', quantity: 1 }
                  ],
                  vat21: false,
                  subtotal: 37.85,
                  vat: 7.95,
                  total: 45.80,
                  totalLines: 2
                })}
                className="w-full bg-white hover:bg-yellow-400 text-vodafone-red hover:text-vodafone-red-dark px-8 py-4 rounded-xl font-black text-xl transition-all shadow-2xl hover:shadow-3xl hover:scale-105 border-4 border-white"
              >
                ¡Quiero esta oferta!
              </button>
            </div>

            {/* Pack Básico */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-vodafone-red transition-all hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-vodafone-gray-900">Pack Básico</h3>
                  <Star className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-vodafone-gray-600 mb-4">Ideal para autónomos y pequeños negocios</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-vodafone-red">28,75 €</span>
                  <span className="text-sm text-vodafone-gray-600">/mes</span>
                  <p className="text-xs text-vodafone-gray-500 mt-1">IVA no incluido</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-vodafone-gray-700">Fibra 600 Mbps con Wi-Fi 6</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-vodafone-gray-700">1 línea móvil con 25 GB</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-vodafone-gray-700">Minutos ilimitados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-vodafone-gray-700">Secure Net incluido</span>
                  </li>
                </ul>
                <button
                  onClick={() => handlePackageSelect({
                    withFiber: true,
                    fiberSpeed: '600Mbps',
                    firstLinePlan: null,
                    mobileGroups: [{ id: '1', plan: '25GB', quantity: 1 }],
                    vat21: false,
                    subtotal: 28.75,
                    vat: 6.04,
                    total: 34.79,
                    totalLines: 1
                  })}
                  className="w-full py-3 bg-vodafone-gray-100 hover:bg-vodafone-red hover:text-white text-vodafone-gray-900 font-semibold rounded-lg transition-colors"
                >
                  Solicitar esta oferta
                </button>
              </div>
            </div>

            {/* Pack Profesional - DESTACADO */}
            <div className="bg-gradient-to-br from-vodafone-red to-vodafone-red-dark rounded-2xl shadow-lg overflow-hidden border-2 border-orange-400">
              <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                MÁS POPULAR
              </div>
              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Pack Profesional</h3>
                  <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                </div>
                <p className="text-sm text-white/90 mb-4">Perfecto para pequeñas empresas en crecimiento</p>
                <div className="mb-6">
                  <span className="text-4xl font-black">65,00 €</span>
                  <span className="text-sm text-white/80">/mes</span>
                  <p className="text-xs text-white/70 mt-1">IVA no incluido</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                    <span className="text-sm">Fibra 1 Gbps con Wi-Fi 6</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                    <span className="text-sm">5 líneas móviles con 50 GB cada una</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                    <span className="text-sm">Minutos ilimitados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                    <span className="text-sm">Secure Net + Soporte prioritario</span>
                  </li>
                </ul>
                <button
                  onClick={() => handlePackageSelect({
                    withFiber: true,
                    fiberSpeed: '1Gbps',
                    firstLinePlan: null,
                    mobileGroups: [{ id: '1', plan: '50GB', quantity: 5 }],
                    vat21: false,
                    subtotal: 65.00,
                    vat: 13.65,
                    total: 78.65,
                    totalLines: 5
                  })}
                  className="w-full py-3 bg-white text-vodafone-red font-semibold rounded-lg hover:bg-yellow-50 transition-colors shadow-lg"
                >
                  Solicitar esta oferta
                </button>
              </div>
            </div>

            {/* Pack Enterprise */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-vodafone-red transition-all hover:shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-vodafone-gray-900">Pack Enterprise</h3>
                  <Star className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-vodafone-gray-600 mb-4">Para empresas con equipos grandes</p>
                <div className="mb-6">
                  <span className="text-4xl font-black text-vodafone-red">170,50 €</span>
                  <span className="text-sm text-vodafone-gray-600">/mes</span>
                  <p className="text-xs text-vodafone-gray-500 mt-1">IVA no incluido</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-vodafone-gray-700">Fibra 1 Gbps con Wi-Fi 6</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-vodafone-gray-700">15 líneas móviles ilimitadas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-vodafone-gray-700">Minutos ilimitados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-vodafone-gray-700">Secure Net + Gestor dedicado 24/7</span>
                  </li>
                </ul>
                <button
                  onClick={() => handlePackageSelect({
                    withFiber: true,
                    fiberSpeed: '1Gbps',
                    firstLinePlan: null,
                    mobileGroups: [{ id: '1', plan: 'ILIMITADA', quantity: 15 }],
                    vat21: false,
                    subtotal: 170.50,
                    vat: 35.81,
                    total: 206.31,
                    totalLines: 15
                  })}
                  className="w-full py-3 bg-vodafone-gray-100 hover:bg-vodafone-red hover:text-white text-vodafone-gray-900 font-semibold rounded-lg transition-colors"
                >
                  Solicitar esta oferta
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-vodafone-gray-900 mb-3">
              Preguntas frecuentes
            </h2>
            <p className="text-base text-vodafone-gray-600">
              Resuelve tus dudas sobre nuestros servicios
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "¿Cuánto tarda la instalación de la fibra?",
                answer: "La instalación de fibra se realiza en un plazo de 3-5 días laborables desde la contratación. Nuestro equipo técnico se pondrá en contacto contigo para coordinar la fecha y hora que mejor te convenga. La instalación incluye el router Wi-Fi 6 y toda la configuración necesaria."
              },
              {
                question: "¿Puedo cambiar mi plan después de contratarlo?",
                answer: "Sí, puedes modificar tu plan en cualquier momento. Las mejoras (aumentar velocidad de fibra de 600 Mbps a 1 Gbps, o aumentar GB en líneas móviles de 25 GB a 50 GB, por ejemplo) no tienen coste asociado. Si deseas reducir tu plan, se aplicará una penalización que dependerá del paquete contratado."
              },
              {
                question: "¿Los precios incluyen IVA?",
                answer: "Los precios mostrados no incluyen IVA por defecto. Puedes activar la opción 'Mostrar con IVA' en la calculadora para ver los precios finales con el 21% de IVA incluido. Todos nuestros presupuestos detallan claramente el subtotal, el IVA y el total."
              },
              {
                question: "¿Qué incluye Secure Net?",
                answer: "Secure Net es nuestro servicio de seguridad que ofrece protección avanzada contra malware, phishing, ransomware y otras amenazas en línea. También incluye filtrado de contenido web, protección DNS y actualizaciones automáticas de seguridad. (*) 3 meses gratis, a partir del cuarto mes, 1,66€/mes."
              },
              {
                question: "¿Hay permanencia en los contratos?",
                answer: "Sí, nuestros planes para empresas tienen una permanencia de 12 meses. Pasado este periodo, puedes continuar con tu plan en las mismas condiciones o darte de baja sin penalizaciones."
              },
              {
                question: "¿Las líneas móviles incluyen roaming en Europa?",
                answer: "Sí, todas nuestras líneas móviles incluyen roaming en la Unión Europea (Zona 1) sin coste adicional. Podrás usar tus datos, llamadas y SMS en cualquier país de la UE como si estuvieras en España, dentro de la política de uso razonable."
              },
              {
                question: "¿Qué velocidad de fibra necesito para mi negocio?",
                answer: "Para oficinas pequeñas (1-3 personas) recomendamos 600 Mbps. Para equipos de 4-10 personas, 1 Gbps es ideal. Si realizas videoconferencias frecuentes, trabajas con archivos grandes o tienes más de 10 dispositivos conectados, te recomendamos 1 Gbps para garantizar el mejor rendimiento."
              },
              {
                question: "¿Cómo funciona el soporte técnico?",
                answer: "Ofrecemos soporte técnico 24/7 a través de teléfono, chat y email. Los clientes con Pack Profesional y Enterprise cuentan con atención prioritaria y un gestor de cuenta dedicado. El tiempo medio de respuesta es inferior a 2 horas para incidencias urgentes."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-vodafone-gray-50 rounded-xl overflow-hidden border border-gray-200">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-vodafone-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-vodafone-red shrink-0 transition-transform ${
                      openFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-sm text-vodafone-gray-700 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-vodafone-gray-600 mb-4">¿No encuentras lo que buscas?</p>
            <button
              onClick={scrollToCalculator}
              className="inline-flex items-center gap-2 bg-vodafone-red hover:bg-vodafone-red-dark text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contacta con nosotros
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-vodafone-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-vodafone-red w-8 h-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">"</span>
                </div>
                <div>
                  <h3 className="text-base font-bold">Vodafone</h3>
                  <p className="text-xs text-gray-400">Empresas</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs">
                Conectamos tu negocio con las mejores soluciones.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Enlaces</h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Soluciones PYMES</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifas móviles</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fibra óptica</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Contacto</h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li>Tel: 123 456 789</li>
                <li>empresas@vodafone.es</li>
                <li>L-V 9:00 - 20:00</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-1.5 text-xs text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos y condiciones</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-4 text-center text-xs text-gray-400">
            <p>&copy; 2025 Vodafone España. Calculadora de ofertas PYME</p>
          </div>
        </div>
      </footer>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          onClose={handleCloseContactForm}
          onSubmit={handleContactSubmit}
          onSuccess={handleContactSuccess}
        />
      )}
    </div>
  );
}
