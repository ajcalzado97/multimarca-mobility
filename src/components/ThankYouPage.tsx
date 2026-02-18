import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, Phone, MessageCircle, Wifi, Smartphone } from 'lucide-react';
import { VodafoneLogo } from './VodafoneLogo';
import { PLAN_LABELS } from '../types/pricing';

interface ConfigData {
  withFiber: boolean;
  fiberSpeed: string | null;
  firstLinePlan: string | null;
  mobileGroups: Array<{ id: string; plan: string; quantity: number }>;
  vat21: boolean;
  subtotal: number;
  vat: number;
  total: number;
  totalLines: number;
}

function formatEuro(amount: number): string {
  return amount.toFixed(2).replace('.', ',') + ' €';
}

export function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const contactMethod = (searchParams.get('method') as 'whatsapp' | 'phone') || 'whatsapp';
  const customerName = searchParams.get('name') || 'Cliente';

  // Scroll al tope de la página cuando se carga
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Parsear la configuración de la oferta
  let configData: ConfigData | null = null;
  try {
    const configParam = searchParams.get('config');
    if (configParam) {
      configData = JSON.parse(decodeURIComponent(configParam));
    }
  } catch (error) {
    console.error('Error al parsear configuración:', error);
  }
  return (
    <div className="min-h-screen bg-vodafone-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <VodafoneLogo className="h-12" />
          </div>

          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-center text-vodafone-gray-900 mb-4">
            ¡Gracias {customerName}!
          </h1>

          <p className="text-lg text-center text-vodafone-gray-700 mb-8">
            Tu solicitud ha sido recibida correctamente
          </p>

          {/* Contact Method Info */}
          <div className={`p-6 rounded-xl border-2 mb-8 ${
            contactMethod === 'whatsapp'
              ? 'bg-green-50 border-green-500'
              : 'bg-blue-50 border-blue-500'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                contactMethod === 'whatsapp' ? 'bg-green-600' : 'bg-blue-600'
              }`}>
                {contactMethod === 'whatsapp' ? (
                  <MessageCircle className="w-6 h-6 text-white" />
                ) : (
                  <Phone className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h2 className={`text-xl font-bold mb-2 ${
                  contactMethod === 'whatsapp' ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {contactMethod === 'whatsapp'
                    ? 'Te contactaremos por WhatsApp'
                    : 'Te llamaremos por teléfono'}
                </h2>
                <p className={`text-sm ${
                  contactMethod === 'whatsapp' ? 'text-green-700' : 'text-blue-700'
                }`}>
                  {contactMethod === 'whatsapp'
                    ? 'Nuestro equipo te enviará un mensaje de WhatsApp en los próximos 15 minutos. Por favor, mantén tu teléfono cerca y estate atento a los mensajes.'
                    : 'Nuestro equipo te llamará en los próximos 15 minutos. Por favor, mantén tu teléfono cerca y estate atento a las llamadas entrantes.'}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-vodafone-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-vodafone-gray-900 mb-4">
              ¿Qué sucederá a continuación?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-vodafone-red text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-sm text-vodafone-gray-700">
                    <strong>En 15 minutos:</strong> Un asesor de Vodafone Empresas se pondrá en contacto contigo
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-vodafone-red text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-sm text-vodafone-gray-700">
                    <strong>Presupuesto detallado:</strong> Te entregaremos un presupuesto personalizado con toda la información que necesites
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-vodafone-red text-white flex items-center justify-center shrink-0 text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-sm text-vodafone-gray-700">
                    <strong>Resolveremos tus dudas:</strong> Nuestro equipo responderá todas tus preguntas y te ayudará a elegir la mejor solución para tu negocio
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-vodafone-red/10 border-l-4 border-vodafone-red p-4 rounded">
            <p className="text-sm text-vodafone-gray-800">
              <strong>Importante:</strong> {contactMethod === 'whatsapp'
                ? 'Asegúrate de tener WhatsApp activo y de poder recibir mensajes de números desconocidos.'
                : 'Asegúrate de poder recibir llamadas y de tener tu teléfono disponible.'}
            </p>
          </div>

          {/* Offer Summary */}
          {configData && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-bold text-vodafone-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-vodafone-red" />
                Resumen de tu oferta
              </h3>

              <div className="bg-vodafone-gray-50 rounded-xl p-6 space-y-4">
                {/* Fibra */}
                {configData.withFiber && configData.fiberSpeed && (
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                    <Wifi className="w-5 h-5 text-vodafone-red mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-vodafone-gray-900 text-sm">
                        Fibra {configData.fiberSpeed === '600Mbps' ? '600 Mbps' : '1 Gbps'}
                      </p>
                      <p className="text-xs text-vodafone-gray-600 mt-0.5">Wi-Fi 6, instalación y router incluidos</p>
                    </div>
                  </div>
                )}

                {/* Primera línea sin fibra */}
                {!configData.withFiber && configData.firstLinePlan && (
                  <div className="flex items-start gap-3 pb-3 border-b border-gray-200">
                    <Smartphone className="w-5 h-5 text-vodafone-red mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-vodafone-gray-900 text-sm">
                        1ª línea: {PLAN_LABELS[configData.firstLinePlan]}
                      </p>
                      <p className="text-xs text-vodafone-gray-600 mt-0.5">Minutos ilimitados, Roaming UE, 5G incluido</p>
                    </div>
                  </div>
                )}

                {/* Líneas móviles */}
                {configData.mobileGroups.map((group, index) => (
                  group.quantity > 0 && (
                    <div key={group.id} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-b-0 last:pb-0">
                      <Smartphone className="w-5 h-5 text-vodafone-red mt-0.5" />
                      <div className="flex-1">
                        <p className="font-semibold text-vodafone-gray-900 text-sm">
                          {group.quantity} × {PLAN_LABELS[group.plan]}
                        </p>
                        <p className="text-xs text-vodafone-gray-600 mt-0.5">
                          {configData.withFiber && index === 0
                            ? 'Línea incluida con fibra · Minutos ilimitados, Roaming UE, 5G incluido'
                            : 'Minutos ilimitados, Roaming UE, 5G incluido'}
                        </p>
                      </div>
                    </div>
                  )
                ))}

                {/* Total */}
                <div className="pt-4 border-t-2 border-gray-300 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-vodafone-gray-700">Subtotal</span>
                    <span className="text-sm font-semibold text-vodafone-gray-900">{formatEuro(configData.subtotal)}</span>
                  </div>
                  {configData.vat21 && (
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-vodafone-gray-700">IVA (21%)</span>
                      <span className="text-sm font-semibold text-vodafone-gray-900">{formatEuro(configData.vat)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-base font-bold text-vodafone-gray-900">Total mensual</span>
                    <span className="text-2xl font-bold text-vodafone-red">{formatEuro(configData.total)}</span>
                  </div>
                  <p className="text-xs text-vodafone-gray-600 mt-3 text-center">
                    Total de líneas: {configData.totalLines} · {configData.vat21 ? 'IVA incluido' : 'IVA no incluido'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="text-vodafone-red hover:text-vodafone-red-dark font-semibold text-sm transition-colors"
            >
              ← Volver al inicio
            </a>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-vodafone-gray-600">
            ¿Necesitas ayuda inmediata? Llámanos al <strong>123 456 789</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
