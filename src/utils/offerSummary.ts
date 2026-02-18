import { PLAN_LABELS } from '../types/pricing';
import { formatEuro } from './calculations';

export interface OfferSummaryConfig {
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

export const buildOfferSummary = (config: OfferSummaryConfig): string => {
  const lines: string[] = [];

  if (config.withFiber && config.fiberSpeed) {
    lines.push(`Fibra: ${config.fiberSpeed === '600Mbps' ? '600 Mbps' : '1 Gbps'}`);
  }

  if (!config.withFiber && config.firstLinePlan) {
    const label = PLAN_LABELS[config.firstLinePlan] ?? config.firstLinePlan;
    lines.push(`1ª línea: ${label}`);
  }

  config.mobileGroups
    .filter((group) => group.quantity > 0)
    .forEach((group) => {
      const label = PLAN_LABELS[group.plan] ?? group.plan;
      lines.push(`${group.quantity} × ${label}`);
    });

  lines.push(`Subtotal: ${formatEuro(config.subtotal)}`);
  if (config.vat21) {
    lines.push(`IVA (21%): ${formatEuro(config.vat)}`);
  }
  lines.push(`Total mensual: ${formatEuro(config.total)}`);

  return lines.join('\n');
};
