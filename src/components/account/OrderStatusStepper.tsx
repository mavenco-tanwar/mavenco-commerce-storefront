import React from 'react';
import { CheckCircle2, Clock, Package, Truck, Home } from 'lucide-react';
import { TrackingStep, OrderStatus } from '@/types/order';

export interface OrderStatusStepperProps {
  steps: TrackingStep[];
  currentStatus: OrderStatus;
}

export function OrderStatusStepper({ steps }: OrderStatusStepperProps) {
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
        <div className="hidden md:block absolute top-5 left-8 right-8 h-0.5 bg-[#E8DED8] -z-0" />

        {steps.map((step, idx) => {
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
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCurrent
                    ? 'bg-[#B77A68] border-[#B77A68] text-white ring-4 ring-[#E8B8B5]/30'
                    : isDone
                    ? 'bg-[#111111] border-[#111111] text-white'
                    : 'bg-[#FFFDFC] border-[#E8DED8] text-[#999999]'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Text Meta */}
              <div className="md:text-center">
                <h5
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isCurrent || isDone ? 'text-[#111111]' : 'text-[#777777]'
                  }`}
                >
                  {step.label}
                </h5>
                <p className="text-[11px] text-[#777777] font-sans mt-0.5">
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
