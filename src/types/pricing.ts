export type FiberSpeed = '600Mbps' | '1Gbps';
export type PlanWithoutFiber = '50GB' | '150GB' | 'ILIMITADOS';
export type PlanWithFiber = '25GB' | '50GB' | '150GB' | 'ILIMITADA';

export interface MobileGroup {
  id: string;
  plan: PlanWithoutFiber | PlanWithFiber | '';
  quantity: number;
}

export interface CalculatorState {
  withFiber: boolean;
  fiberSpeed: FiberSpeed | null;
  firstLinePlanWithoutFiber: PlanWithoutFiber | null;
  mobileGroups: MobileGroup[];
  vat21: boolean;
}

export interface PricingData {
  noFiber: {
    firstLine: Record<PlanWithoutFiber, number>;
    additional: Record<PlanWithoutFiber, number>;
  };
  withFiber: {
    fiber: Record<FiberSpeed, number>;
    mobilePerLine: Record<PlanWithFiber, number>;
  };
}

export const PRICING: PricingData = {
  noFiber: {
    firstLine: {
      '50GB': 12.40,
      '150GB': 16.60,
      'ILIMITADOS': 24.80
    },
    additional: {
      '50GB': 6.20,
      '150GB': 8.30,
      'ILIMITADOS': 12.40
    }
  },
  withFiber: {
    fiber: {
      '600Mbps': 24.65,
      '1Gbps': 34.00
    },
    mobilePerLine: {
      '25GB': 4.10,
      '50GB': 6.20,
      '150GB': 8.30,
      'ILIMITADA': 9.10
    }
  }
};

export const PLAN_LABELS: Record<string, string> = {
  '25GB': '25 GB',
  '50GB': '50 GB',
  '150GB': '150 GB',
  'ILIMITADOS': 'GBs Ilimitados',
  'ILIMITADA': 'Ilimitada'
};
