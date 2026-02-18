import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Smartphone, Plus, Trash2, Check, CheckCircle, Clock } from 'lucide-react';
import { CalculatorState, MobileGroup, FiberSpeed, PlanWithoutFiber, PlanWithFiber, PRICING, PLAN_LABELS } from '../types/pricing';
import { calculateTotal, formatEuro, validateState } from '../utils/calculations';
import { ContactForm, ContactFormData } from './ContactForm';
import { submitLeadToGoogleForm } from '../utils/googleForm';
import { buildOfferSummary, OfferSummaryConfig } from '../utils/offerSummary';

export function Calculator() {
  const navigate = useNavigate();
  const [state, setState] = useState<CalculatorState>({
    withFiber: false,
    fiberSpeed: null,
    firstLinePlanWithoutFiber: null,
    mobileGroups: [],
    vat21: false
  });

  const [showContactForm, setShowContactForm] = useState(false);

  // Contador de tiempo limitado (5 minutos = 300 segundos)
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Cuando llegue a 0, resetear todo el estado
          setState({
            withFiber: false,
            fiberSpeed: null,
            firstLinePlanWithoutFiber: null,
            mobileGroups: [],
            vat21: false
          });
          clearInterval(timer);
          // Reiniciar el contador
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const result = calculateTotal(state);
  const errors = validateState(state);
  const canAddMoreLines = result.totalLines < 15;

  // Determinar si el usuario ha empezado a configurar
  const hasStartedConfiguration = state.withFiber || state.firstLinePlanWithoutFiber !== null || state.mobileGroups.length > 0;

  // Verificar qué pasos están completados
  const step1Complete = state.withFiber || state.firstLinePlanWithoutFiber !== null;
  const step2Complete = state.withFiber ? state.fiberSpeed !== null : state.firstLinePlanWithoutFiber !== null;
  const step3Complete = state.mobileGroups.some(g => g.plan && g.quantity > 0);

  const handleFiberToggle = (enabled: boolean) => {
    // Si se activa la fibra, añadir automáticamente una línea móvil de 25GB
    const initialMobileGroups = enabled ? [{
      id: Date.now().toString(),
      plan: '25GB',
      quantity: 1
    }] : [];

    setState({
      ...state,
      withFiber: enabled,
      fiberSpeed: enabled ? '600Mbps' : null,
      firstLinePlanWithoutFiber: enabled ? null : state.firstLinePlanWithoutFiber,
      mobileGroups: initialMobileGroups
    });
  };

  const handleFiberSpeedSelect = (speed: FiberSpeed) => {
    setState({ ...state, fiberSpeed: speed });
  };

  const handleFirstLinePlanSelect = (plan: PlanWithoutFiber) => {
    setState({ ...state, firstLinePlanWithoutFiber: plan });
  };

  const addMobileGroup = () => {
    const newGroup: MobileGroup = {
      id: Date.now().toString(),
      plan: state.withFiber ? '25GB' : '',
      quantity: 1
    };
    setState({ ...state, mobileGroups: [...state.mobileGroups, newGroup] });
  };

  const removeMobileGroup = (id: string) => {
    setState({
      ...state,
      mobileGroups: state.mobileGroups.filter(g => g.id !== id)
    });
  };

  const updateMobileGroup = (id: string, updates: Partial<MobileGroup>) => {
    setState({
      ...state,
      mobileGroups: state.mobileGroups.map(g =>
        g.id === id ? { ...g, ...updates } : g
      )
    });
  };

  const incrementQuantity = (id: string) => {
    const group = state.mobileGroups.find(g => g.id === id);
    if (!group) return;

    const newQuantity = group.quantity + 1;
    const newTotal = state.withFiber
      ? state.mobileGroups.reduce((sum, g) => sum + (g.id === id ? newQuantity : g.quantity), 0)
      : 1 + state.mobileGroups.reduce((sum, g) => sum + (g.id === id ? newQuantity : g.quantity), 0);

    if (newTotal <= 15) {
      updateMobileGroup(id, { quantity: newQuantity });
    }
  };

  const decrementQuantity = (id: string) => {
    const group = state.mobileGroups.find(g => g.id === id);
    if (!group) return;

    // Todas las líneas con fibra deben tener mínimo 1
    const minQuantity = state.withFiber ? 1 : 0;

    if (group.quantity <= minQuantity) return;
    updateMobileGroup(id, { quantity: group.quantity - 1 });
  };

  const buildConfigData = (): OfferSummaryConfig => ({
    withFiber: state.withFiber,
    fiberSpeed: state.fiberSpeed,
    firstLinePlan: state.firstLinePlanWithoutFiber,
    mobileGroups: state.mobileGroups,
    vat21: state.vat21,
    subtotal: result.subtotal,
    vat: result.vat,
    total: result.total,
    totalLines: result.totalLines
  });

  const handleContactFormSubmit = async (data: ContactFormData) => {
    const configData = buildConfigData();
    const offerSummary = buildOfferSummary(configData);

    await submitLeadToGoogleForm({
      ...data,
      offerSummary
    });
  };

  const handleContactFormSuccess = (data: ContactFormData) => {
    const configData = buildConfigData();

    navigate(
      `/gracias?method=${data.contactMethod}&name=${encodeURIComponent(data.name)}&config=${encodeURIComponent(JSON.stringify(configData))}`
    );
  };

  return (
    <div className="bg-white">
      <div className={`max-w-3xl mx-auto px-4 ${hasStartedConfiguration && result.totalLines > 0 ? 'pb-32' : 'pb-8'}`}>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                step1Complete
                  ? 'bg-green-500 text-white'
                  : 'bg-vodafone-red text-white'
              }`}>
                {step1Complete ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-vodafone-red" />
                <div>
                  <p className="font-semibold text-slate-900 text-sm">¿Quieres internet fibra?</p>
                  <p className="text-xs text-slate-600">Fibra óptica hasta 1 Gbps</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${state.withFiber ? 'text-slate-400' : 'text-slate-700'}`}>
                NO
              </span>
              <button
                onClick={() => handleFiberToggle(!state.withFiber)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  state.withFiber ? 'bg-vodafone-red' : 'bg-slate-300'
                }`}
                aria-label="Activar fibra"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    state.withFiber ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-xs font-semibold ${state.withFiber ? 'text-vodafone-red' : 'text-slate-400'}`}>
                SÍ
              </span>
            </div>
          </div>
        </div>

        {state.withFiber && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                step2Complete && state.withFiber
                  ? 'bg-green-500 text-white'
                  : 'bg-vodafone-red text-white'
              }`}>
                {step2Complete && state.withFiber ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Wifi className="w-4 h-4 text-vodafone-red" />
                Selecciona la velocidad de fibra
              </h2>
            </div>
            <div className="space-y-2">
              {Object.entries(PRICING.withFiber.fiber).map(([speed, price]) => (
                <button
                  key={speed}
                  onClick={() => handleFiberSpeedSelect(speed as FiberSpeed)}
                  className={`relative w-full p-3 rounded-lg border-2 transition-all text-left ${
                    state.fiberSpeed === speed
                      ? 'border-vodafone-red bg-red-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">
                        {speed === '600Mbps' ? '600 Mbps' : '1 Gbps'}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">Wi-Fi 6</div>
                    </div>
                    <div className="text-lg font-bold text-vodafone-red">
                      {formatEuro(price)}<span className="text-xs font-normal text-slate-600">/mes</span>
                    </div>
                  </div>
                  {state.fiberSpeed === speed && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-vodafone-red" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {!state.withFiber && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                step2Complete && !state.withFiber
                  ? 'bg-green-500 text-white'
                  : 'bg-vodafone-red text-white'
              }`}>
                {step2Complete && !state.withFiber ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4 text-vodafone-red" />
                Elige el plan para tu primera línea móvil
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(PRICING.noFiber.firstLine).map(([plan, price]) => (
                <button
                  key={plan}
                  onClick={() => handleFirstLinePlanSelect(plan as PlanWithoutFiber)}
                  className={`relative p-3 rounded-lg border-2 transition-all text-left ${
                    state.firstLinePlanWithoutFiber === plan
                      ? 'border-vodafone-red bg-red-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {state.firstLinePlanWithoutFiber === plan && (
                    <div className="absolute top-2 right-2">
                      <Check className="w-4 h-4 text-vodafone-red" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{PLAN_LABELS[plan]}</div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        Ilimitado · Roaming Z1
                      </div>
                    </div>
                    <div className="text-lg font-bold text-vodafone-red">
                      {formatEuro(price)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                step3Complete
                  ? 'bg-green-500 text-white'
                  : 'bg-vodafone-red text-white'
              }`}>
                {step3Complete ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              <h2 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4 text-vodafone-red" />
                {state.withFiber ? 'Añade líneas móviles' : 'Añade líneas móviles adicionales'}
                <span className="text-xs text-slate-500 font-normal">(Opcional)</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                result.totalLines > 15
                  ? 'bg-red-100 text-red-700'
                  : result.totalLines >= 12
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {result.totalLines}/15
              </span>
            </div>
          </div>

          {state.mobileGroups.length === 0 ? (
            <div className="text-center py-6 text-slate-500">
              <Smartphone className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-xs">Puedes añadir hasta 15 líneas móviles</p>
              <p className="text-xs mt-1">Selecciona el plan y la cantidad para cada tipo</p>
            </div>
          ) : (
            <div className="space-y-2 mb-3">
              {state.mobileGroups.map((group, index) => {
                const availablePlans = state.withFiber
                  ? Object.keys(PRICING.withFiber.mobilePerLine)
                  : Object.keys(PRICING.noFiber.additional);

                const maxQuantity = 15 - (result.totalLines - group.quantity);

                // La primera línea con fibra es obligatoria y no se puede eliminar
                const isFirstLineWithFiber = state.withFiber && index === 0;

                return (
                  <div key={group.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-medium text-slate-700">
                        {isFirstLineWithFiber ? 'Línea incluida con fibra' : 'Seleccionar plan'}
                      </label>
                      {!isFirstLineWithFiber && (
                        <button
                          onClick={() => removeMobileGroup(group.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {availablePlans.map(plan => {
                        const price = state.withFiber
                          ? PRICING.withFiber.mobilePerLine[plan as PlanWithFiber]
                          : PRICING.noFiber.additional[plan as PlanWithoutFiber];

                        return (
                          <button
                            key={plan}
                            onClick={() => updateMobileGroup(group.id, { plan })}
                            className={`p-2 rounded-lg border-2 transition-all text-left ${
                              group.plan === plan
                                ? 'border-vodafone-red bg-red-50'
                                : 'border-slate-200 bg-white hover:border-slate-300'
                            }`}
                          >
                            {group.plan === plan && (
                              <div className="absolute top-1 right-1">
                                <Check className="w-3 h-3 text-vodafone-red" />
                              </div>
                            )}
                            <div className="font-semibold text-slate-900 text-xs">
                              {PLAN_LABELS[plan]}
                            </div>
                            <div className="text-sm font-bold text-vodafone-red mt-0.5">
                              {formatEuro(price)}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-700">
                        Cantidad de líneas
                      </label>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => decrementQuantity(group.id)}
                          disabled={group.quantity <= 0}
                          className="w-7 h-7 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-slate-700 text-sm"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={group.quantity}
                          readOnly
                          className="w-10 text-center px-1 py-1.5 text-sm border border-slate-300 rounded-lg bg-white font-semibold"
                        />
                        <button
                          onClick={() => incrementQuantity(group.id)}
                          disabled={group.quantity >= maxQuantity}
                          className="w-7 h-7 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-bold text-slate-700 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button
            onClick={addMobileGroup}
            disabled={!canAddMoreLines}
            className="w-full py-2.5 px-4 border-2 border-dashed border-slate-300 rounded-lg text-slate-700 hover:border-vodafone-red hover:text-vodafone-red hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-sm"
          >
            <Plus className="w-4 h-4" />
            Añadir líneas
          </button>
          {!canAddMoreLines && (
            <p className="text-xs text-amber-600 mt-1.5 text-center">
              Límite máximo alcanzado
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-slate-900 text-sm">Mostrar con IVA (21%)</p>
              <p className="text-xs text-slate-600 mt-0.5">Añadir IVA al precio final</p>
            </div>
            <button
              onClick={() => setState({ ...state, vat21: !state.vat21 })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                state.vat21 ? 'bg-vodafone-red' : 'bg-slate-300'
              }`}
              aria-label="Mostrar IVA"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  state.vat21 ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {hasStartedConfiguration && result.totalLines > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg">
          <div className="max-w-3xl mx-auto px-4 py-2">
            {/* Oferta por tiempo limitado */}
            <div className="mb-3 p-3 bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 rounded-xl shadow-xl border-2 border-amber-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-white/30 backdrop-blur-sm p-1.5 rounded-full">
                    <Clock className="w-5 h-5 text-amber-900" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-white tracking-wide drop-shadow-md">¡OFERTA POR TIEMPO LIMITADO!</span>
                    <p className="text-xs text-amber-50 font-semibold">Esta oferta expira pronto</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-lg border-2 border-amber-200">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-xl font-black text-orange-600 font-mono tabular-nums">{formatTime(timeLeft)}</span>
                  </div>
                  <span className="text-xs text-amber-50 font-bold">quedan</span>
                </div>
              </div>
            </div>

            {errors.length > 0 && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                {errors.map((error, index) => (
                  <p key={index} className="text-xs text-red-700">{error}</p>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mb-2 p-2 bg-red-50 rounded-lg">
              <div>
                <div className="text-xs text-slate-600 font-medium">Total mensual</div>
                {state.vat21 && (
                  <div className="text-xs text-slate-500 mt-0.5">{formatEuro(result.subtotal)} + IVA</div>
                )}
              </div>
              <span className="text-xl font-bold text-vodafone-red">{formatEuro(result.total)}</span>
            </div>

            <button
              onClick={() => {
                if (errors.length === 0) {
                  setShowContactForm(true);
                }
              }}
              disabled={errors.length > 0}
              className={`w-full py-3 text-white font-semibold rounded-xl transition-colors text-sm ${
                errors.length > 0
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-vodafone-red hover:bg-vodafone-red-dark shadow-lg shadow-vodafone-red/20 animate-pulse'
              }`}
            >
              Solicitar oferta
            </button>

            <p className="text-xs text-slate-500 mt-2 text-center">
              Incluye minutos nacionales ilimitados, Roaming Z1 y Secure Net*
            </p>
          </div>
        </div>
      )}

      {showContactForm && (
        <ContactForm
          onClose={() => setShowContactForm(false)}
          onSubmit={handleContactFormSubmit}
          onSuccess={handleContactFormSuccess}
        />
      )}
    </div>
  );
}
