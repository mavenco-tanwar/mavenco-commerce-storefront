/**
 * Module 33: AttributeValidationEngine
 * Enterprise dynamic attribute validation engine supporting 16 types,
 * rule constraints, and conditional requirements.
 */

import {
  AttributeDefinition,
  ProductAttributeValue,
  ProductType,
} from '@/types/pim-commerce.types';

export interface AttributeValidationError {
  attributeCode: string;
  attributeName: string;
  rule: string;
  message: string;
}

export class AttributeValidationEngine {
  /**
   * Validates a single attribute value against its definition
   */
  public static validateValue(
    definition: AttributeDefinition,
    value: any
  ): AttributeValidationError[] {
    const errors: AttributeValidationError[] = [];
    const rules = definition.validationRules || {};

    // 1. Check Required
    const isEmpty =
      value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0);

    if (definition.required || rules.required) {
      if (isEmpty) {
        errors.push({
          attributeCode: definition.code,
          attributeName: definition.name,
          rule: 'required',
          message: `${definition.name} is a required attribute`,
        });
        return errors;
      }
    }

    if (isEmpty) {
      return errors; // optional and not provided
    }

    // 2. Type-specific validation
    switch (definition.type) {
      case 'number':
      case 'integer':
      case 'decimal': {
        const num = Number(value);
        if (isNaN(num)) {
          errors.push({
            attributeCode: definition.code,
            attributeName: definition.name,
            rule: 'type',
            message: `${definition.name} must be a valid number`,
          });
        } else {
          if (definition.type === 'integer' && !Number.isInteger(num)) {
            errors.push({
              attributeCode: definition.code,
              attributeName: definition.name,
              rule: 'type_integer',
              message: `${definition.name} must be an integer without decimals`,
            });
          }
          if (rules.min !== undefined && num < rules.min) {
            errors.push({
              attributeCode: definition.code,
              attributeName: definition.name,
              rule: 'min',
              message: `${definition.name} must be at least ${rules.min}`,
            });
          }
          if (rules.max !== undefined && num > rules.max) {
            errors.push({
              attributeCode: definition.code,
              attributeName: definition.name,
              rule: 'max',
              message: `${definition.name} must be at most ${rules.max}`,
            });
          }
          if (rules.decimalPrecision !== undefined) {
            const parts = String(value).split('.');
            if (parts[1] && parts[1].length > rules.decimalPrecision) {
              errors.push({
                attributeCode: definition.code,
                attributeName: definition.name,
                rule: 'decimal_precision',
                message: `${definition.name} precision exceeds maximum allowed (${rules.decimalPrecision}) decimals`,
              });
            }
          }
        }
        break;
      }

      case 'text':
      case 'textarea': {
        const str = String(value);
        if (rules.length !== undefined && str.length > rules.length) {
          errors.push({
            attributeCode: definition.code,
            attributeName: definition.name,
            rule: 'length',
            message: `${definition.name} exceeds max length of ${rules.length} characters`,
          });
        }
        if (rules.regex) {
          try {
            const re = new RegExp(rules.regex);
            if (!re.test(str)) {
              errors.push({
                attributeCode: definition.code,
                attributeName: definition.name,
                rule: 'regex',
                message: `${definition.name} format is invalid`,
              });
            }
          } catch {}
        }
        break;
      }

      case 'select': {
        if (rules.allowedValues && rules.allowedValues.length > 0) {
          if (!rules.allowedValues.includes(String(value))) {
            errors.push({
              attributeCode: definition.code,
              attributeName: definition.name,
              rule: 'allowed_values',
              message: `${definition.name} must be one of: ${rules.allowedValues.join(', ')}`,
            });
          }
        }
        break;
      }

      case 'multi_select': {
        if (!Array.isArray(value)) {
          errors.push({
            attributeCode: definition.code,
            attributeName: definition.name,
            rule: 'type_array',
            message: `${definition.name} must be an array of selections`,
          });
        } else if (rules.allowedValues && rules.allowedValues.length > 0) {
          const invalid = value.filter((v) => !rules.allowedValues!.includes(String(v)));
          if (invalid.length > 0) {
            errors.push({
              attributeCode: definition.code,
              attributeName: definition.name,
              rule: 'allowed_values',
              message: `${definition.name} contains invalid values: ${invalid.join(', ')}`,
            });
          }
        }
        break;
      }

      case 'color': {
        const str = String(value);
        if (!/^#([0-9A-F]{3}){1,2}$/i.test(str) && !/^[a-zA-Z\s]+$/.test(str)) {
          errors.push({
            attributeCode: definition.code,
            attributeName: definition.name,
            rule: 'color_format',
            message: `${definition.name} must be a valid HEX color (e.g. #FFFFFF) or color name`,
          });
        }
        break;
      }

      case 'url': {
        try {
          new URL(String(value));
        } catch {
          errors.push({
            attributeCode: definition.code,
            attributeName: definition.name,
            rule: 'url_format',
            message: `${definition.name} must be a valid URL`,
          });
        }
        break;
      }

      case 'email': {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
          errors.push({
            attributeCode: definition.code,
            attributeName: definition.name,
            rule: 'email_format',
            message: `${definition.name} must be a valid email address`,
          });
        }
        break;
      }

      case 'date':
      case 'datetime': {
        if (isNaN(Date.parse(String(value)))) {
          errors.push({
            attributeCode: definition.code,
            attributeName: definition.name,
            rule: 'date_format',
            message: `${definition.name} must be a valid ISO date`,
          });
        }
        break;
      }

      case 'json': {
        if (typeof value !== 'object') {
          try {
            JSON.parse(String(value));
          } catch {
            errors.push({
              attributeCode: definition.code,
              attributeName: definition.name,
              rule: 'json_format',
              message: `${definition.name} must be valid JSON`,
            });
          }
        }
        break;
      }
    }

    return errors;
  }

  /**
   * Validates conditional attribute rules based on product context (e.g. ProductType)
   * Example: Furniture requires material, dimensions, careInstructions
   */
  public static validateConditionalRequirements(
    productType: ProductType,
    attributes: ProductAttributeValue[],
    coreFields: { material?: string; dimensions?: any; careInstructions?: any[] }
  ): AttributeValidationError[] {
    const errors: AttributeValidationError[] = [];
    const lowerType = productType.toLowerCase();

    if (lowerType === 'furniture' || lowerType === 'apparel' || lowerType === 'variable') {
      if (lowerType === 'furniture') {
        if (!coreFields.material && !attributes.some((a) => a.code === 'material' && a.value)) {
          errors.push({
            attributeCode: 'material',
            attributeName: 'Material',
            rule: 'conditional_furniture_material',
            message: 'Furniture product type requires material specifications',
          });
        }
        if (!coreFields.dimensions && !attributes.some((a) => a.code === 'dimensions' && a.value)) {
          errors.push({
            attributeCode: 'dimensions',
            attributeName: 'Dimensions',
            rule: 'conditional_furniture_dimensions',
            message: 'Furniture product type requires dimension measurements (L x W x H)',
          });
        }
      }

      if (lowerType === 'apparel') {
        const hasCare =
          (coreFields.careInstructions && coreFields.careInstructions.length > 0) ||
          attributes.some((a) => a.code === 'care_instructions' && a.value);
        if (!hasCare) {
          errors.push({
            attributeCode: 'care_instructions',
            attributeName: 'Care Instructions',
            rule: 'conditional_apparel_care',
            message: 'Apparel product type requires care instructions',
          });
        }
      }
    }

    return errors;
  }

  /**
   * Validates full set of attributes for a product against all definitions
   */
  public static validateAll(
    definitions: AttributeDefinition[],
    values: ProductAttributeValue[],
    productType: ProductType,
    coreFields: { material?: string; dimensions?: any; careInstructions?: any[] } = {}
  ): { isValid: boolean; errors: AttributeValidationError[] } {
    const errors: AttributeValidationError[] = [];

    const valueMap = new Map<string, any>();
    values.forEach((v) => valueMap.set(v.code, v.value));

    // Validate each definition
    definitions.forEach((def) => {
      const val = valueMap.get(def.code);
      const valErrors = this.validateValue(def, val);
      errors.push(...valErrors);
    });

    // Validate conditional requirements
    const conditionalErrors = this.validateConditionalRequirements(productType, values, coreFields);
    errors.push(...conditionalErrors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
