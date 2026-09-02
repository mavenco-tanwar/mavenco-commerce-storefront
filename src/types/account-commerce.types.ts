export interface OrderTimelineEvent {
  id: string;
  stage: string;
  description: string;
  location?: string;
  timestamp: string;
  completed: boolean;
}

export interface CustomerAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export interface CustomerProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addresses: CustomerAddress[];
  tags?: string[];
  notes?: string;
  createdAt: string;
}

export interface AccountBuilderSettings {
  id: string;
  tenantSlug: string;
  dashboard: {
    sidebarPosition: 'left' | 'right';
    showGreetingAvatar: boolean;
    showQuickMetrics: boolean;
    showWishlistQuickLink: boolean;
  };
  orders: {
    showTimelineOnModal: boolean;
    allowCustomerCancellation: boolean;
    cancellationWindowHours: number;
    allowReorder: boolean;
    allowDownloadInvoice: boolean;
  };
  addresses: {
    maxSavedAddresses: number;
    requirePhone: boolean;
    allowSeparateBilling: boolean;
  };
  updatedAt: string;
}
