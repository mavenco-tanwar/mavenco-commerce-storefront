/**
 * Module 33: BarcodeService
 * Validates EAN-13, EAN-8, UPC-A, GTIN-14, ISBN-10, ISBN-13, and custom formats.
 */

import { BarcodeType } from '@/types/pim-commerce.types';

export class BarcodeService {
  /**
   * Calculates Modulo-10 checksum for EAN/UPC/GTIN barcodes
   */
  public static calculateModulo10Checksum(digitsWithoutCheck: string): number {
    const digits = digitsWithoutCheck.split('').map(Number);
    let sum = 0;
    // Iterate from right to left with weights 3, 1, 3, 1...
    for (let i = digits.length - 1, weight = 3; i >= 0; i--, weight = weight === 3 ? 1 : 3) {
      sum += digits[i] * weight;
    }
    const modulo = sum % 10;
    return modulo === 0 ? 0 : 10 - modulo;
  }

  /**
   * Validates EAN-13 format and checksum
   */
  public static validateEAN13(barcode: string): boolean {
    const clean = barcode.replace(/\s+/g, '');
    if (!/^\d{13}$/.test(clean)) return false;
    const body = clean.slice(0, 12);
    const expectedCheck = this.calculateModulo10Checksum(body);
    return Number(clean[12]) === expectedCheck;
  }

  /**
   * Validates EAN-8 format and checksum
   */
  public static validateEAN8(barcode: string): boolean {
    const clean = barcode.replace(/\s+/g, '');
    if (!/^\d{8}$/.test(clean)) return false;
    const body = clean.slice(0, 7);
    const expectedCheck = this.calculateModulo10Checksum(body);
    return Number(clean[7]) === expectedCheck;
  }

  /**
   * Validates UPC-A format and checksum (12 digits)
   */
  public static validateUPCA(barcode: string): boolean {
    const clean = barcode.replace(/\s+/g, '');
    if (!/^\d{12}$/.test(clean)) return false;
    const body = clean.slice(0, 11);
    const expectedCheck = this.calculateModulo10Checksum(body);
    return Number(clean[11]) === expectedCheck;
  }

  /**
   * Validates GTIN-14 format and checksum
   */
  public static validateGTIN14(barcode: string): boolean {
    const clean = barcode.replace(/\s+/g, '');
    if (!/^\d{14}$/.test(clean)) return false;
    const body = clean.slice(0, 13);
    const expectedCheck = this.calculateModulo10Checksum(body);
    return Number(clean[13]) === expectedCheck;
  }

  /**
   * Validates ISBN-10 and ISBN-13
   */
  public static validateISBN(isbn: string): boolean {
    const clean = isbn.replace(/[-\s]/g, '');
    if (clean.length === 10) {
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        const digit = parseInt(clean[i], 10);
        if (isNaN(digit)) return false;
        sum += digit * (10 - i);
      }
      const lastChar = clean[9].toUpperCase();
      const check = lastChar === 'X' ? 10 : parseInt(lastChar, 10);
      return (sum + check) % 11 === 0;
    } else if (clean.length === 13) {
      return this.validateEAN13(clean);
    }
    return false;
  }

  /**
   * Universal Barcode Validator
   */
  public static validateBarcode(
    barcode: string,
    type: BarcodeType = 'EAN'
  ): { isValid: boolean; detectedType?: string; error?: string } {
    const clean = barcode.trim();
    if (!clean) {
      return { isValid: false, error: 'Barcode value cannot be empty' };
    }

    switch (type) {
      case 'EAN':
        if (clean.length === 13) {
          const ok = this.validateEAN13(clean);
          return ok
            ? { isValid: true, detectedType: 'EAN-13' }
            : { isValid: false, error: 'Invalid EAN-13 checksum' };
        } else if (clean.length === 8) {
          const ok = this.validateEAN8(clean);
          return ok
            ? { isValid: true, detectedType: 'EAN-8' }
            : { isValid: false, error: 'Invalid EAN-8 checksum' };
        }
        return { isValid: false, error: 'EAN barcode must be 8 or 13 digits' };

      case 'UPC':
        if (this.validateUPCA(clean)) {
          return { isValid: true, detectedType: 'UPC-A' };
        }
        return { isValid: false, error: 'Invalid UPC-A 12-digit barcode or checksum' };

      case 'GTIN':
        if (this.validateGTIN14(clean)) {
          return { isValid: true, detectedType: 'GTIN-14' };
        }
        return { isValid: false, error: 'Invalid GTIN-14 barcode or checksum' };

      case 'ISBN':
        if (this.validateISBN(clean)) {
          return { isValid: true, detectedType: 'ISBN' };
        }
        return { isValid: false, error: 'Invalid ISBN format or checksum' };

      case 'custom':
      default:
        if (/^[A-Za-z0-9\-_]{4,64}$/.test(clean)) {
          return { isValid: true, detectedType: 'custom' };
        }
        return { isValid: false, error: 'Custom barcode must be 4-64 alphanumeric characters' };
    }
  }
}
