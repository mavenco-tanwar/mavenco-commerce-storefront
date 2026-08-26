export interface PincodeInfo {
  pincode: string;
  city: string;
  state: string;
  estimatedDays: number;
  codAvailable: boolean;
  expressAvailable: boolean;
}

export const pincodesDirectory: Record<string, PincodeInfo> = {
  '110001': { pincode: '110001', city: 'New Delhi', state: 'Delhi', estimatedDays: 2, codAvailable: true, expressAvailable: true },
  '110020': { pincode: '110020', city: 'Okhla', state: 'Delhi', estimatedDays: 2, codAvailable: true, expressAvailable: true },
  '400001': { pincode: '400001', city: 'Mumbai', state: 'Maharashtra', estimatedDays: 2, codAvailable: true, expressAvailable: true },
  '400050': { pincode: '400050', city: 'Bandra', state: 'Maharashtra', estimatedDays: 2, codAvailable: true, expressAvailable: true },
  '560001': { pincode: '560001', city: 'Bengaluru', state: 'Karnataka', estimatedDays: 1, codAvailable: true, expressAvailable: true },
  '560038': { pincode: '560038', city: 'Indiranagar', state: 'Karnataka', estimatedDays: 1, codAvailable: true, expressAvailable: true },
  '600001': { pincode: '600001', city: 'Chennai', state: 'Tamil Nadu', estimatedDays: 3, codAvailable: true, expressAvailable: true },
  '700001': { pincode: '700001', city: 'Kolkata', state: 'West Bengal', estimatedDays: 3, codAvailable: true, expressAvailable: true },
  '500001': { pincode: '500001', city: 'Hyderabad', state: 'Telangana', estimatedDays: 2, codAvailable: true, expressAvailable: true },
  '302001': { pincode: '302001', city: 'Jaipur', state: 'Rajasthan', estimatedDays: 2, codAvailable: true, expressAvailable: true },
  '380001': { pincode: '380001', city: 'Ahmedabad', state: 'Gujarat', estimatedDays: 2, codAvailable: true, expressAvailable: true },
  '411001': { pincode: '411001', city: 'Pune', state: 'Maharashtra', estimatedDays: 2, codAvailable: true, expressAvailable: true },
  '201301': { pincode: '201301', city: 'Noida', state: 'Uttar Pradesh', estimatedDays: 2, codAvailable: true, expressAvailable: true },
  '122001': { pincode: '122001', city: 'Gurugram', state: 'Haryana', estimatedDays: 2, codAvailable: true, expressAvailable: true },
  '682001': { pincode: '682001', city: 'Kochi', state: 'Kerala', estimatedDays: 3, codAvailable: true, expressAvailable: true },
  '160001': { pincode: '160001', city: 'Chandigarh', state: 'Punjab', estimatedDays: 2, codAvailable: true, expressAvailable: true },
};

export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu & Kashmir', 'Ladakh'
];
