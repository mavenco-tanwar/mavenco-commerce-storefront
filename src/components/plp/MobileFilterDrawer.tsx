'use client';

import React from 'react';
import { Drawer } from '@/components/ui/Drawer';
import { FilterSidebar, FilterSidebarProps } from './FilterSidebar';
import { Button } from '@/components/ui/Button';

export interface MobileFilterDrawerProps extends FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  productCount: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  productCount,
  ...filterProps
}: MobileFilterDrawerProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      position="bottom"
      title="Filter & Refine"
      subtitle={`${productCount} styles found`}
    >
      <div className="flex flex-col h-full justify-between pb-4">
        <div className="overflow-y-auto max-h-[60vh] pr-2 pb-6">
          <FilterSidebar {...filterProps} isMobile={true} />
        </div>

        {/* Bottom Apply Action */}
        <div className="pt-4 border-t border-[#E8DED8] bg-[#FFFDFC]">
          <Button
            variant="luxury-gold"
            size="lg"
            className="w-full"
            onClick={onClose}
          >
            Show {productCount} Results
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
