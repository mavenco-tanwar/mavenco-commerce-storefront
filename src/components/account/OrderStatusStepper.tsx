import React from 'react';
import { CheckCircle2, Clock, Package, Truck, Home, Check, XCircle } from 'lucide-react';
import { TrackingStep, OrderStatus } from '@/types/order';

export interface OrderStatusStepperProps {
  steps?: TrackingStep[];
  currentStatus: OrderStatus;
}

const DEFAULT_STAGES: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'placed', label: 'Order Placed', description: 'Payment verified & confirmed' },
  { status: 'confirmed', label: 'Confirmed', description: 'Studio accepted & preparing' },
  { status: 'packed', label: 'Packed', description: 'Quality checked & gift wrapped' },
  { status: 'shipped', label: 'In Transit', description: 'Dispatched via BlueDart Air' },
  { status: 'delivered', label: 'Delivered', description: 'Arriving at your doorstep' },
];

export function OrderStatusStepper({ steps, currentStatus }: OrderStatusStepperProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="my-4 p-4 bg-[#FFF5F5] border border-[#F5C6CB] rounded flex items-center gap-3.5 text-xs text-[#721C24] animate-in fade-in duration-200">
        <div className="w-9 h-9 rounded-full bg-[#F8D7DA] flex items-center justify-center shrink-0 text-[#721C24]">
          <XCircle className="w-5 h-5" />
        </div>
        <div>
          <strong className="text-xs uppercase tracking-wider font-bold block mb-0.5">
            Order Cancelled
          </strong>
          <span className="text-[11px] text-[#842029]">
            This order was cancelled. Any prepaid amount will be refunded to your original payment source within 3–5 business days.
          </span>
        </div>
      </div>
    );
  }

  const stageOrder: OrderStatus[] = ['placed', 'confirmed', 'packed', 'shipped', 'delivered'];
  const activeIdx = Math.max(0, stageOrder.indexOf(currentStatus));

  const resolvedSteps: TrackingStep[] =
    steps && steps.length > 0 && steps[0].label
      ? steps
      : DEFAULT_STAGES.map((st, idx) => ({
          status: st.status,
          label: st.label,
          description: st.description,
          isCompleted: idx <= activeIdx,
          isCurrent: idx === activeIdx,
        }));

  const getIcon = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return Clock;
      case 'confirmed':
        return CheckCircle2;
      case 'packed':
        return Package;
      case 'shipped':
        return Truck;
      case 'delivered':
        return Home;
      default:
        return CheckCircle2;
    }
  };

  return (
    <div className="py-6 select-none">
      <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-2">
        {/* Connecting Line on Desktop */}
        <div className="hidden md:block absolute top-5 left-10 right-10 h-0.5 bg-[#E8DED8] -z-0" />

        {resolvedSteps.map((step, idx) => {
          const Icon = getIcon(step.status);
          const isDone = step.isCompleted;
          const isCurrent = step.isCurrent;

          return (
            <div
              key={idx}
              className="flex md:flex-col items-start md:items-center gap-4 md:gap-2 relative z-10 flex-1"
            >
              {/* Icon Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
                  isCurrent
                    ? 'bg-[#B77A68] border-[#B77A68] text-white ring-4 ring-[#E8B8B5]/40 scale-105'
                    : isDone
                    ? 'bg-[#111111] border-[#111111] text-white'
                    : 'bg-[#FFFDFC] border-[#E8DED8] text-[#999999]'
                }`}
              >
                {isDone && !isCurrent ? (
                  <Check className="w-5 h-5 stroke-[2.5]" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>

              {/* Text Meta */}
              <div className="md:text-center">
                <h5
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isCurrent
                      ? 'text-[#B77A68]'
                      : isDone
                      ? 'text-[#111111]'
                      : 'text-[#888888]'
                  }`}
                >
                  {step.label}
                </h5>
                <p className="text-[11px] text-[#777777] font-sans mt-0.5 max-w-[150px] md:mx-auto">
                  {step.description}
                </p>
                {step.timestamp && (
                  <span className="text-[10px] text-[#B77A68] font-semibold block mt-0.5">
                    {step.timestamp}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
