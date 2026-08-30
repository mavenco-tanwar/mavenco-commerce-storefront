import { apiClient } from './client';
import { mapCmsCustomerToStorefrontUser } from './adapters';
import { UserProfile, Address } from '@/types/auth';

export class CustomerApiService {
  /**
   * Updates customer profile and address book in the CMS.
   */
  public static async updateCustomer(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      addresses?: Address[];
    }
  ): Promise<UserProfile> {
    const res = await apiClient.patch<any>(`/api/v1/customers/${encodeURIComponent(userId)}`, data);
    return mapCmsCustomerToStorefrontUser(res.data);
  }

  /**
   * Adds an address to the customer's address book.
   */
  public static async addAddress(user: UserProfile, newAddr: Omit<Address, 'id'>): Promise<UserProfile> {
    const id = `addr_${Date.now()}`;
    const addresses = [...user.savedAddresses];

    if (newAddr.isDefault) {
      addresses.forEach((a: Address) => (a.isDefault = false));
    }

    addresses.push({ ...newAddr, id });
    return this.updateCustomer(user.id, { addresses });
  }

  /**
   * Deletes an address from the customer's address book.
   */
  public static async deleteAddress(user: UserProfile, addressId: string): Promise<UserProfile> {
    const addresses = user.savedAddresses.filter((a: Address) => a.id !== addressId);
    if (addresses.length > 0 && !addresses.some((a: Address) => a.isDefault)) {
      addresses[0].isDefault = true;
    }
    return this.updateCustomer(user.id, { addresses });
  }

  /**
   * Sets default address.
   */
  public static async setDefaultAddress(user: UserProfile, addressId: string): Promise<UserProfile> {
    const addresses = user.savedAddresses.map((a: Address) => ({
      ...a,
      isDefault: a.id === addressId,
    }));
    return this.updateCustomer(user.id, { addresses });
  }
}
