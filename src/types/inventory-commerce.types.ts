export interface Warehouse {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'maintenance';
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  priority: number;
  capabilities: ('storage' | 'fulfillment' | 'pickup' | 'returns')[];
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  sku: string;
  barcode?: string;
  warehouseId: string;
  warehouseName: string;
  onHand: number;
  reserved: number;
  available: number;
  incoming: number;
  damaged: number;
  safetyStock: number;
  lowStockThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'backorder';
  updatedAt: string;
}

export type StockMovementType =
  | 'IN'
  | 'OUT'
  | 'RESERVATION'
  | 'RELEASE'
  | 'COMMIT'
  | 'ADJUSTMENT'
  | 'TRANSFER_OUT'
  | 'TRANSFER_IN'
  | 'DAMAGE'
  | 'RETURN';

export interface StockMovementLedger {
  id: string;
  sku: string;
  productId: string;
  variantId: string;
  warehouseId: string;
  warehouseName?: string;
  type: StockMovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  referenceType?: string;
  referenceId?: string;
  actorName: string;
  createdAt: string;
}
