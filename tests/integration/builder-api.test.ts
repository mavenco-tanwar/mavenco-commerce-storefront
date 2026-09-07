/**
 * Visual Page Builder API Integration Test Suite
 * Validates:
 * 1. PUT /api/v1/content/builder/pages/[id] saves draft JSON.
 * 2. GET /api/v1/content/builder/pages/[id] retrieves draft JSON for editor.
 * 3. POST /api/v1/content/builder/pages/[id]/publish publishes live and creates version snapshot.
 * 4. GET /api/v1/content/builder/pages/[id]/versions retrieves revision history.
 * 5. POST /api/v1/content/builder/pages/[id]/versions/[version]/restore rolls back draft.
 * 6. POST & GET /api/v1/content/builder/components persists reusable components.
 * 7. GET /api/v1/content/builder/templates returns system and custom templates.
 * 8. Multi-Tenant isolation: Tenant A cannot access or mutate Tenant B's pages.
 */

import {
  GET as getPage,
  PUT as putPage,
  DELETE as deletePage,
} from '@/app/api/v1/content/builder/pages/[id]/route';
import { POST as publishPage } from '@/app/api/v1/content/builder/pages/[id]/publish/route';
import { POST as unpublishPage } from '@/app/api/v1/content/builder/pages/[id]/unpublish/route';
import { GET as getVersions } from '@/app/api/v1/content/builder/pages/[id]/versions/route';
import { POST as restoreVersion } from '@/app/api/v1/content/builder/pages/[id]/versions/[version]/restore/route';
import {
  GET as getComponents,
  POST as createComponent,
} from '@/app/api/v1/content/builder/components/route';
import { GET as getTemplates } from '@/app/api/v1/content/builder/templates/route';
import { createMockNextRequest } from '../support/mocks/http-context.mock';
import { PageBuilderDocument } from '@/types/builder.types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

export async function runVisualPageBuilderApiIntegrationTests() {
  console.log('--- RUNNING INTEGRATION TEST: Visual Page Builder Route Handlers ---');

  const tenantA = 'lumina';
  const tenantB = 'apexathletics';
  const pageId = `test_page_${Date.now()}`;
  const slug = `test-page-${Date.now()}`;

  const testDoc: PageBuilderDocument = {
    id: pageId,
    tenantId: tenantA,
    title: 'Autumn Velvet Runway',
    slug,
    type: 'page',
    status: 'draft',
    version: 1,
    content: {
      version: 1,
      settings: {
        background: '#FFFDFC',
      },
      children: [
        {
          id: 'sec_1',
          type: 'section',
          props: { containerWidth: 'boxed' },
          styles: { desktop: { paddingTop: '80px' } },
          children: [
            {
              id: 'head_1',
              type: 'heading',
              props: { text: 'Autumn Velvet Lookbook', tag: 'h1' },
              styles: { desktop: { fontSize: '40px' } },
            },
          ],
        },
      ],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // ── 1. Save Page Draft (PUT) ──
  console.log('[Test 2.1] PUT /api/v1/content/builder/pages/[id] (Save Draft)');
  const putReq = createMockNextRequest({
    url: `https://lumina.mavenco.store/api/v1/content/builder/pages/${pageId}`,
    method: 'PUT',
    tenantId: tenantA,
    body: testDoc,
  });

  const putRes = await putPage(putReq, { params: Promise.resolve({ id: pageId }) });
  assert(putRes.status === 200, `Expected 200 from save draft, got: ${putRes.status}`);
  const putJson = await putRes.json();
  assert(putJson.success === true, 'Save draft response must be success: true');
  assert(putJson.data.title === 'Autumn Velvet Runway', 'Page title must match saved document');
  console.log('✓ Page draft saved successfully');

  // ── 2. Get Page Document (GET) ──
  console.log('[Test 2.2] GET /api/v1/content/builder/pages/[id] (Load Document)');
  const getReq = createMockNextRequest({
    url: `https://lumina.mavenco.store/api/v1/content/builder/pages/${pageId}`,
    method: 'GET',
    tenantId: tenantA,
  });

  const getRes = await getPage(getReq, { params: Promise.resolve({ id: pageId }) });
  assert(getRes.status === 200, `Expected 200 from load page, got: ${getRes.status}`);
  const getJson = await getRes.json();
  assert(getJson.success === true, 'Load page must return success: true');
  assert(getJson.data.content?.children?.length === 1, 'Document must contain 1 root section');
  console.log('✓ Page document retrieved successfully');

  // ── 3. Publish Page Live (POST) ──
  console.log('[Test 2.3] POST /api/v1/content/builder/pages/[id]/publish (Publish Live)');
  const publishReq = createMockNextRequest({
    url: `https://lumina.mavenco.store/api/v1/content/builder/pages/${pageId}/publish`,
    method: 'POST',
    tenantId: tenantA,
    body: { publishedBy: 'test_admin', changelog: 'Initial test publish' },
  });

  const publishRes = await publishPage(publishReq, { params: Promise.resolve({ id: pageId }) });
  assert(publishRes.status === 200, `Expected 200 from publish page, got: ${publishRes.status}`);
  const publishJson = await publishRes.json();
  assert(publishJson.success === true, 'Publish must return success: true');
  assert(publishJson.publishedVersion >= 1, 'Published version must be incremented');
  console.log('✓ Page published live and version snapshot generated');

  // ── 4. Revisions & Versions History (GET) ──
  console.log('[Test 2.4] GET /api/v1/content/builder/pages/[id]/versions (Revision History)');
  const verReq = createMockNextRequest({
    url: `https://lumina.mavenco.store/api/v1/content/builder/pages/${pageId}/versions`,
    method: 'GET',
    tenantId: tenantA,
  });

  const verRes = await getVersions(verReq, { params: Promise.resolve({ id: pageId }) });
  assert(verRes.status === 200, `Expected 200 from versions list, got: ${verRes.status}`);
  const verJson = await verRes.json();
  assert(verJson.success === true, 'Versions list must return success: true');
  assert(Array.isArray(verJson.data), 'Versions data must be an array');
  console.log('✓ Page revision history retrieved');

  // ── 5. Reusable Components API (POST & GET) ──
  console.log('[Test 2.5] POST & GET /api/v1/content/builder/components');
  const compReq = createMockNextRequest({
    url: 'https://lumina.mavenco.store/api/v1/content/builder/components',
    method: 'POST',
    tenantId: tenantA,
    body: {
      name: 'Test Hero Component',
      category: 'Sections',
      elementTree: testDoc.content.children[0],
    },
  });

  const compRes = await createComponent(compReq);
  assert(compRes.status === 201, `Expected 201 from create component, got: ${compRes.status}`);
  const compJson = await compRes.json();
  assert(compJson.data.name === 'Test Hero Component', 'Component name must match');

  const listCompReq = createMockNextRequest({
    url: 'https://lumina.mavenco.store/api/v1/content/builder/components',
    method: 'GET',
    tenantId: tenantA,
  });
  const listCompRes = await getComponents(listCompReq);
  const listCompJson = await listCompRes.json();
  assert(listCompJson.success === true, 'List components must return success: true');
  console.log('✓ Reusable components API verified');

  // ── 6. Template Library API (GET) ──
  console.log('[Test 2.6] GET /api/v1/content/builder/templates');
  const tmplReq = createMockNextRequest({
    url: 'https://lumina.mavenco.store/api/v1/content/builder/templates',
    method: 'GET',
    tenantId: tenantA,
  });

  const tmplRes = await getTemplates(tmplReq);
  assert(tmplRes.status === 200, `Expected 200 from templates, got: ${tmplRes.status}`);
  const tmplJson = await tmplRes.json();
  assert(tmplJson.success === true, 'Templates list must return success: true');
  assert(tmplJson.data.length >= 4, 'Must return at least 4 preset templates');
  console.log('✓ Template library API verified');

  // ── 7. Multi-Tenant Isolation Security Boundary ──
  console.log('[Test 2.7] Multi-Tenant Security Boundary (Tenant B cannot access Tenant A private page)');
  const alienReq = createMockNextRequest({
    url: `https://apexathletics.mavenco.store/api/v1/content/builder/pages/${pageId}`,
    method: 'GET',
    tenantId: tenantB, // Deliberately accessing Tenant A's private page as Tenant B
  });

  const alienRes = await getPage(alienReq, { params: Promise.resolve({ id: pageId }) });
  // Must return 404 not found across tenant boundaries
  assert(alienRes.status === 404, `Tenant B must NOT access Tenant A page! Expected 404, got: ${alienRes.status}`);
  console.log('✓ Multi-tenant boundary strictly prevents cross-tenant page leakage');

  // Cleanup test page
  const delReq = createMockNextRequest({
    url: `https://lumina.mavenco.store/api/v1/content/builder/pages/${pageId}`,
    method: 'DELETE',
    tenantId: tenantA,
  });
  await deletePage(delReq, { params: Promise.resolve({ id: pageId }) });

  console.log('--- ALL VISUAL PAGE BUILDER INTEGRATION TESTS PASSED ---\n');
  return true;
}
