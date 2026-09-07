import {
  PageBuilderElement,
  ResponsiveDevice,
  ResponsiveStyles,
} from '@/types/builder.types';

/**
 * Recursively searches for an element by its unique ID within an element tree.
 */
export function findElementById(
  elements: PageBuilderElement[],
  id: string
): PageBuilderElement | null {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children && el.children.length > 0) {
      const found = findElementById(el.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Recursively searches for the parent element and index of a given child ID.
 */
export function findParentAndIndex(
  elements: PageBuilderElement[],
  childId: string
): { parent: PageBuilderElement | null; index: number } | null {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].id === childId) {
      return { parent: null, index: i };
    }
    if (elements[i].children && elements[i].children!.length > 0) {
      for (let j = 0; j < elements[i].children!.length; j++) {
        if (elements[i].children![j].id === childId) {
          return { parent: elements[i], index: j };
        }
      }
      const nested = findParentAndIndex(elements[i].children!, childId);
      if (nested) return nested;
    }
  }
  return null;
}

/**
 * Immutably updates an element in the tree matching the target ID.
 */
export function updateElementInTree(
  elements: PageBuilderElement[],
  targetId: string,
  updater: (el: PageBuilderElement) => PageBuilderElement
): PageBuilderElement[] {
  return elements.map((el) => {
    if (el.id === targetId) {
      return updater({ ...el });
    }
    if (el.children && el.children.length > 0) {
      return {
        ...el,
        children: updateElementInTree(el.children, targetId, updater),
      };
    }
    return el;
  });
}

/**
 * Immutably removes an element from the tree matching the target ID.
 */
export function removeElementFromTree(
  elements: PageBuilderElement[],
  targetId: string
): PageBuilderElement[] {
  return elements
    .filter((el) => el.id !== targetId)
    .map((el) => {
      if (el.children && el.children.length > 0) {
        return {
          ...el,
          children: removeElementFromTree(el.children, targetId),
        };
      }
      return el;
    });
}

/**
 * Regenerates unique IDs recursively for an element and all of its children.
 * Crucial for safe duplication and copy/paste without ID collisions.
 */
export function regenerateElementIds(element: PageBuilderElement): PageBuilderElement {
  const newId = `el_${element.type}_${Math.random().toString(36).substring(2, 9)}`;
  const cloned: PageBuilderElement = {
    ...element,
    id: newId,
    label: element.label ? `${element.label} (Copy)` : undefined,
    props: JSON.parse(JSON.stringify(element.props || {})),
    styles: JSON.parse(JSON.stringify(element.styles || {})),
    advanced: element.advanced ? JSON.parse(JSON.stringify(element.advanced)) : undefined,
  };

  if (element.children && element.children.length > 0) {
    cloned.children = element.children.map((child) => regenerateElementIds(child));
  }

  return cloned;
}

/**
 * Inserts a new element at a specific drop position relative to a target element or container.
 */
export function insertElementInTree(
  elements: PageBuilderElement[],
  elementToInsert: PageBuilderElement,
  targetId: string | null,
  position: 'inside' | 'before' | 'after' = 'inside'
): PageBuilderElement[] {
  // If no target, append to root
  if (!targetId) {
    return [...elements, elementToInsert];
  }

  // Position 'inside' container target
  if (position === 'inside') {
    return elements.map((el) => {
      if (el.id === targetId) {
        return {
          ...el,
          children: [...(el.children || []), elementToInsert],
        };
      }
      if (el.children && el.children.length > 0) {
        return {
          ...el,
          children: insertElementInTree(el.children, elementToInsert, targetId, position),
        };
      }
      return el;
    });
  }

  // Position 'before' or 'after' target element
  const result: PageBuilderElement[] = [];
  for (const el of elements) {
    if (el.id === targetId) {
      if (position === 'before') {
        result.push(elementToInsert);
        result.push(el);
      } else {
        result.push(el);
        result.push(elementToInsert);
      }
    } else {
      if (el.children && el.children.length > 0) {
        result.push({
          ...el,
          children: insertElementInTree(el.children, elementToInsert, targetId, position),
        });
      } else {
        result.push(el);
      }
    }
  }

  return result;
}

/**
 * Moves an element from its current position to a new location in the tree.
 */
export function moveElementInTree(
  elements: PageBuilderElement[],
  sourceId: string,
  targetId: string,
  position: 'inside' | 'before' | 'after' = 'after'
): PageBuilderElement[] {
  const elementToMove = findElementById(elements, sourceId);
  if (!elementToMove) return elements;

  // Prevent moving a container inside itself
  if (sourceId === targetId) return elements;

  // 1. Remove from source
  const cleaned = removeElementFromTree(elements, sourceId);

  // 2. Insert into target
  return insertElementInTree(cleaned, elementToMove, targetId, position);
}

/**
 * Compiles combined responsive styles for an element based on the active device.
 * Desktop values serve as base; tablet overrides desktop; mobile overrides tablet & desktop.
 */
export function resolveResponsiveStyles(
  styles: ResponsiveStyles,
  device: ResponsiveDevice
): React.CSSProperties {
  const desktop = styles?.desktop || {};
  const tablet = styles?.tablet || {};
  const mobile = styles?.mobile || {};

  let merged: Record<string, any> = { ...desktop };

  if (device === 'tablet' || device === 'mobile') {
    merged = { ...merged, ...tablet };
  }

  if (device === 'mobile') {
    merged = { ...merged, ...mobile };
  }

  return merged as React.CSSProperties;
}

/**
 * Resolves dynamic data placeholders in strings.
 * Example: "Welcome to {{ store.name }}! Best {{ product.title }} at {{ product.price }}."
 */
export function resolveDynamicBindings(
  text: string,
  context: {
    product?: Record<string, any>;
    category?: Record<string, any>;
    store?: Record<string, any>;
    user?: Record<string, any>;
  } = {}
): string {
  if (!text || typeof text !== 'string') return text;

  return text.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (_, path: string) => {
    const parts = path.split('.');
    const scope = parts[0];
    const field = parts.slice(1).join('.');

    let targetObj: any = null;
    if (scope === 'product') targetObj = context.product;
    else if (scope === 'category') targetObj = context.category;
    else if (scope === 'store') targetObj = context.store;
    else if (scope === 'user') targetObj = context.user;

    if (!targetObj) return `{{ ${path} }}`;

    // Lookup nested field
    let val = targetObj;
    for (const p of parts.slice(1)) {
      if (val && typeof val === 'object') {
        val = val[p];
      } else {
        val = undefined;
        break;
      }
    }

    if (val === undefined || val === null) {
      return `{{ ${path} }}`;
    }

    return String(val);
  });
}

/**
 * Basic XSS sanitization for user-entered raw HTML or custom attributes.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') return '';

  return dirtyHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}
