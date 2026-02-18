import { CalculatorState, PRICING, MobileGroup } from '../types/pricing';

export interface CalculationResult {
  fiberPrice: number;
  firstLinePrice: number;
  mobileGroupsTotal: number;
  subtotal: number;
  vat: number;
  total: number;
  totalLines: number;
  breakdown: BreakdownItem[];
}

export interface BreakdownItem {
  label: string;
  price: number;
  quantity?: number;
  unitPrice?: number;
}

export function formatEuro(amount: number): string {
  return amount.toFixed(2).replace('.', ',') + ' €';
}

export function calculateTotal(state: CalculatorState): CalculationResult {
  let fiberPrice = 0;
  let firstLinePrice = 0;
  let mobileGroupsTotal = 0;
  const breakdown: BreakdownItem[] = [];

  if (state.withFiber) {
    if (state.fiberSpeed) {
      fiberPrice = PRICING.withFiber.fiber[state.fiberSpeed];
      breakdown.push({
        label: `Fibra ${state.fiberSpeed === '600Mbps' ? '600 Mbps' : '1 Gbps'} (Wi-Fi 6)`,
        price: fiberPrice
      });
    }

    state.mobileGroups.forEach(group => {
      if (group.plan && group.quantity > 0) {
        const unitPrice = PRICING.withFiber.mobilePerLine[group.plan as keyof typeof PRICING.withFiber.mobilePerLine];
        const groupTotal = unitPrice * group.quantity;
        mobileGroupsTotal += groupTotal;
        breakdown.push({
          label: `${group.quantity} × ${getPlanLabel(group.plan)}`,
          price: groupTotal,
          quantity: group.quantity,
          unitPrice
        });
      }
    });
  } else {
    if (state.firstLinePlanWithoutFiber) {
      firstLinePrice = PRICING.noFiber.firstLine[state.firstLinePlanWithoutFiber];
      breakdown.push({
        label: `1ª línea: ${getPlanLabel(state.firstLinePlanWithoutFiber)}`,
        price: firstLinePrice
      });
    }

    state.mobileGroups.forEach(group => {
      if (group.plan && group.quantity > 0) {
        const unitPrice = PRICING.noFiber.additional[group.plan as keyof typeof PRICING.noFiber.additional];
        const groupTotal = unitPrice * group.quantity;
        mobileGroupsTotal += groupTotal;
        breakdown.push({
          label: `${group.quantity} × ${getPlanLabel(group.plan)}`,
          price: groupTotal,
          quantity: group.quantity,
          unitPrice
        });
      }
    });
  }

  const subtotal = fiberPrice + firstLinePrice + mobileGroupsTotal;
  const vat = state.vat21 ? subtotal * 0.21 : 0;
  const total = subtotal + vat;

  const totalLines = state.withFiber
    ? state.mobileGroups.reduce((sum, g) => sum + (g.quantity || 0), 0)
    : 1 + state.mobileGroups.reduce((sum, g) => sum + (g.quantity || 0), 0);

  return {
    fiberPrice,
    firstLinePrice,
    mobileGroupsTotal,
    subtotal: Math.round(subtotal * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    total: Math.round(total * 100) / 100,
    totalLines,
    breakdown
  };
}

function getPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    '25GB': '25 GB',
    '50GB': '50 GB',
    '150GB': '150 GB',
    'ILIMITADOS': 'GBs Ilimitados',
    'ILIMITADA': 'Ilimitada'
  };
  return labels[plan] || plan;
}

export function validateState(state: CalculatorState): string[] {
  const errors: string[] = [];

  const result = calculateTotal(state);

  if (result.totalLines < 1 || result.totalLines > 15) {
    errors.push('Debes contratar entre 1 y 15 líneas.');
  }

  if (state.withFiber && !state.fiberSpeed) {
    errors.push('Selecciona la velocidad de fibra (600 Mbps o 1 Gbps).');
  }

  if (!state.withFiber && !state.firstLinePlanWithoutFiber) {
    errors.push('Selecciona el plan de la 1ª línea.');
  }

  state.mobileGroups.forEach((group, index) => {
    if (group.quantity > 0 && !group.plan) {
      errors.push(`Selecciona un plan de línea móvil válido para el grupo ${index + 1}.`);
    }
  });

  return errors;
}
