import { useState } from 'react';
import { X, Phone, MessageCircle, User, Mail } from 'lucide-react';

interface ContactFormProps {
  onClose: () => void;
  onSubmit: (data: ContactFormData) => Promise<void>;
  onSuccess?: (data: ContactFormData) => void;
}

export interface ContactFormData {
  contactMethod: 'whatsapp' | 'phone' | '';
  name: string;
  email: string;
  phone: string;
}

export function ContactForm({ onClose, onSubmit, onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    contactMethod: '',
    name: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [submissionState, setSubmissionState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.contactMethod) {
      newErrors.contactMethod = 'Selecciona un método de contacto';
    }
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();

    if (!trimmedName) {
      newErrors.name = 'El nombre es obligatorio';
    }
    if (!trimmedEmail) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = 'Email no válido';
    }
    if (trimmedPhone && !/^\d{9}$/.test(trimmedPhone.replace(/\s/g, ''))) {
      newErrors.phone = 'Teléfono no válido (9 dígitos)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmissionState('loading');
      setSubmissionMessage(null);
      const normalizedData: ContactFormData = {
        contactMethod: formData.contactMethod,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      };

      try {
        await onSubmit(normalizedData);
        setSubmissionState('success');
        setSubmissionMessage('Solicitud enviada correctamente. Redirigiendo...');
        setTimeout(() => {
          onSuccess?.(normalizedData);
        }, 800);
      } catch (error) {
        console.error('Error enviando formulario:', error);
        setSubmissionState('error');
        setSubmissionMessage('No se pudo enviar la solicitud. Inténtalo de nuevo.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Solicitar oferta</h2>
            <p className="text-sm text-slate-600 mt-1">Complete los datos para recibir su oferta personalizada</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              ¿Cómo quieres que te contactemos?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, contactMethod: 'whatsapp' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.contactMethod === 'whatsapp'
                    ? 'border-green-600 bg-green-600 shadow-lg shadow-green-500/30'
                    : 'border-green-400 bg-green-100 hover:bg-green-200'
                }`}
              >
                <MessageCircle className={`w-8 h-8 mx-auto mb-2 ${
                  formData.contactMethod === 'whatsapp' ? 'text-white' : 'text-green-700'
                }`} />
                <div className={`font-semibold ${
                  formData.contactMethod === 'whatsapp' ? 'text-white' : 'text-green-800'
                }`}>
                  WhatsApp
                </div>
                <div className={`text-xs mt-1 ${
                  formData.contactMethod === 'whatsapp' ? 'text-green-50' : 'text-green-700'
                }`}>Te contactamos por WhatsApp</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, contactMethod: 'phone' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.contactMethod === 'phone'
                    ? 'border-blue-600 bg-blue-600 shadow-lg shadow-blue-500/30'
                    : 'border-blue-400 bg-blue-100 hover:bg-blue-200'
                }`}
              >
                <Phone className={`w-8 h-8 mx-auto mb-2 ${
                  formData.contactMethod === 'phone' ? 'text-white' : 'text-blue-700'
                }`} />
                <div className={`font-semibold ${
                  formData.contactMethod === 'phone' ? 'text-white' : 'text-blue-800'
                }`}>
                  Llamada telefónica
                </div>
                <div className={`text-xs mt-1 ${
                  formData.contactMethod === 'phone' ? 'text-blue-50' : 'text-blue-700'
                }`}>Quiero que me llamen</div>
              </button>
            </div>
            {errors.contactMethod && (
              <p className="text-sm text-red-600 mt-2">{errors.contactMethod}</p>
            )}
            {formData.contactMethod && (
              <div className={`mt-3 p-3 rounded-lg border-2 ${
                formData.contactMethod === 'whatsapp'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-blue-50 border-blue-500'
              }`}>
                <p className={`text-sm font-semibold text-center ${
                  formData.contactMethod === 'whatsapp' ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {formData.contactMethod === 'whatsapp'
                    ? '✓ Te contactaremos por WhatsApp'
                    : '✓ Te llamaremos a tu teléfono'}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Nombre completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-vodafone-red focus:border-vodafone-red ${
                  errors.name ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Juan Pérez"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-vodafone-red focus:border-vodafone-red ${
                  errors.email ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="juan@empresa.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Teléfono
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-vodafone-red focus:border-vodafone-red ${
                errors.phone ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="666123456"
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submissionState === 'loading'}
              className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-colors shadow-lg shadow-vodafone-red/20 ${
                submissionState === 'loading'
                  ? 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  : 'bg-vodafone-red hover:bg-vodafone-red-dark text-white'
              }`}
            >
              {submissionState === 'loading' ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </div>

          {submissionMessage && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                submissionState === 'success'
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              {submissionMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
