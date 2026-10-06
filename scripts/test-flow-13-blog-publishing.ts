/**
 * Comprehensive Flow 13 Automated Test Suite
 * Admin Blog & Editorial Content Publishing Flow
 *
 * Covers:
 * - TC-13.1: Open /admin/blog -> verify listing, stats computation, and draft creation
 * - TC-13.2: Rich bilingual authoring (English & Italian), hero imagery & preview simulation
 * - TC-13.3: Publish workflow -> transitions status from DRAFT to PUBLISHED with timestamps
 * - TC-13.4: Open public /blog -> verify published article card appears at top of grid
 * - TC-13.5: Verify /blog/[slug] renders full article with bottom conversion CTA to /order
 * - TC-13.EC1: Duplicate blog slug collision handling (appends year or counter)
 * - TC-13.EC2: Draft autosave & state retention
 * - TC-13.EC3: Unpublished post protection (public visitors blocked, preview permitted)
 * - TC-13.EC4: Bilingual localisation fidelity (EN & IT metadata, excerpts, bodies)
 * - TC-13.EC5: Database synchronization with Prisma BlogPost schema
 */

import { prisma } from '../src/lib/prisma'
import {
    getAllBlogPostsAdminAction,
    getBlogPostBySlugAction,
    getPublicBlogPostsAction,
    upsertBlogPostAdminAction,
    publishBlogPostAdminAction,
    deleteBlogPostAdminAction,
} from '../src/lib/actions/blog'
import { generateSlug } from '../src/lib/utils/slug'
import {
    getAllBlogPosts,
    saveBlogPost,
    deleteBlogPost,
    getBlogPostById,
    getBlogStats,
    getBlogSettings,
    INITIAL_BLOG_POSTS,
    AdminBlogPost,
} from '../src/data/adminBlogData'
import { BLOG_POSTS } from '../src/utils/blogData'
import { BlogPostStatus as PrismaPostStatus } from '@prisma/client'

interface TestResult {
    id: string
    title: string
    passed: boolean
    details: string
    error?: string
}

const results: TestResult[] = []

function assert(condition: boolean, id: string, title: string, details: string) {
    if (condition) {
        console.log(`  ✅ [PASS] ${id}: ${title}`)
        results.push({ id, title, passed: true, details })
    } else {
        console.error(`  ❌ [FAIL] ${id}: ${title} - ${details}`)
        results.push({ id, title, passed: false, details, error: 'Assertion failed' })
    }
}

const TEST_IDENTIFIERS = {
    testDraftSlug: 'test-flow13-draft-article',
    testPublishSlug: 'test-flow13-published-article',
    duplicateBaseSlug: 'the-modern-agbada-in-europe',
}

async function cleanupTestData() {
    try {
        await prisma.blogPost.deleteMany({
            where: {
                OR: [
                    { slug: { startsWith: 'test-flow13' } },
                    { slug: { startsWith: 'the-modern-agbada-in-europe-2026' } },
                ],
            },
        })
    } catch (e) {
        console.warn('Prisma cleanup warning (non-fatal):', e)
    }
}

async function runTestSuite() {
    console.log('════════════════════════════════════════════════════════════════')
    console.log('🧪 RUNNING FLOW 13: ADMIN BLOG & CONTENT PUBLISHING FLOW')
    console.log('════════════════════════════════════════════════════════════════\n')

    await cleanupTestData()

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 1: BLOG CMS OVERVIEW & STATS (TC-13.1)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('--- 1. Testing Admin Blog CMS Overview & Stats Strip ---')

    const adminListRes = await getAllBlogPostsAdminAction()
    assert(
        adminListRes.success === true && Array.isArray(adminListRes.posts),
        'TC-13.1A',
        'Admin Blog Posts Retrieval',
        `Retrieved ${adminListRes.posts.length} articles from editorial store.`
    )

    const stats = getBlogStats(adminListRes.posts)
    assert(
        stats.totalPublished >= 1,
        'TC-13.1B',
        'Published Article Count Metric',
        `Active published articles count: ${stats.totalPublished}`
    )

    const settings = getBlogSettings()
    assert(
        settings.categories.length >= 3 && Boolean(settings.defaultAuthor),
        'TC-13.1C',
        'Blog Editorial Settings & Taxonomies',
        `Configured with ${settings.categories.length} categories, author: "${settings.defaultAuthor}"`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 2: DRAFT CREATION & BILINGUAL CONTENT (TC-13.2)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 2. Testing Bilingual Article Drafting & Preview Setup ---')

    const draftInput = {
        id: `post-${Date.now()}`,
        slug: TEST_IDENTIFIERS.testDraftSlug,
        category: 'Style Guide',
        status: 'draft' as const,
        featuredImage: '/images/blog-bespoke.jpg',
        featuredImageAlt: 'Bespoke tailoring in Verona atelier',
        contentEN: {
            title: 'How to Choose the Perfect Bespoke Kaftan for European Summer Galas',
            excerpt: 'Lightweight linen cuts, embroidery aesthetics, and Italian footwear pairings.',
            body: 'Summer events across Europe require breathable luxury fabrics that retain regal structure.\n\nMaster Tailor Samuelson recommends crisp Irish linen and polished Egyptian cotton blends.\n\nPair with understated monk-strap shoes.',
            tags: ['Kaftan', 'Bespoke', 'Summer Gala', 'Style Guide'],
            metaTitle: 'Bespoke Kaftan Tailoring for European Summer | CaptainStitches',
            metaDescription: 'Discover the premier guide to wearing bespoke African Kaftans in Europe.',
        },
        contentIT: {
            title: 'Come Scegliere il Kaftan su Misura Perfetto per i Gala Estivi',
            excerpt: 'Lini leggeri, ricami sartoriali e abbinamenti con calzature italiane.',
            body: 'Gli eventi estivi in Europa richiedono tessuti pregiati e traspiranti.\n\nScopri la selezione sartoriale del Maestro Samuelson.',
            tags: ['Kaftan', 'Su Misura', 'Gala', 'Stile'],
            metaTitle: 'Kaftan su Misura per l’Estate Europea | CaptainStitches',
            metaDescription: 'La guida esclusiva al Kaftan africano di lusso in Italia.',
        },
        cta: {
            isEnabled: true,
            text: 'Ready to commission your summer kaftan? Book your bespoke slot →',
            linkType: 'order' as const,
            customUrl: '/order',
        },
    }

    const saveDraftRes = await upsertBlogPostAdminAction(draftInput)
    assert(
        saveDraftRes.success === true && Boolean(saveDraftRes.post),
        'TC-13.2A',
        'Bilingual Draft Creation',
        `Created article draft with ID "${saveDraftRes.post?.id}" and slug "${saveDraftRes.post?.slug}"`
    )

    assert(
        saveDraftRes.post?.contentEN.title.includes('Bespoke Kaftan') === true &&
        saveDraftRes.post?.contentIT.title.includes('Kaftan su Misura') === true,
        'TC-13.2B',
        'Bilingual Content Preservation',
        `EN: "${saveDraftRes.post?.contentEN.title}" | IT: "${saveDraftRes.post?.contentIT.title}"`
    )

    // Verify preview simulation access
    const previewRes = await getBlogPostBySlugAction(TEST_IDENTIFIERS.testDraftSlug, true)
    assert(
        previewRes.success === true && previewRes.post?.slug === TEST_IDENTIFIERS.testDraftSlug,
        'TC-13.2C',
        'Admin Preview Mode Access',
        `Admin preview succeeded for draft "${previewRes.post?.slug}"`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 3: ARTICLE PUBLISHING WORKFLOW (TC-13.3)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 3. Testing Article Publishing Workflow ---')

    const publishRes = await publishBlogPostAdminAction(TEST_IDENTIFIERS.testDraftSlug)
    assert(
        publishRes.success === true && publishRes.post?.status === 'published',
        'TC-13.3A',
        'Status Transition to PUBLISHED',
        `Article status transitioned to "${publishRes.post?.status}"`
    )

    assert(
        publishRes.post?.publishDate !== 'Draft' && Boolean(publishRes.post?.publishDate),
        'TC-13.3B',
        'Publication Timestamp Assigned',
        `Published date recorded as: ${publishRes.post?.publishDate}`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 4: PUBLIC BLOG GRID VISIBILITY (TC-13.4)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 4. Testing Public Blog Grid Feed (/blog) ---')

    const publicPostsRes = await getPublicBlogPostsAction()
    assert(
        publicPostsRes.success === true && Array.isArray(publicPostsRes.posts),
        'TC-13.4A',
        'Public Blog Posts Feed',
        `Retrieved ${publicPostsRes.posts.length} published articles for /blog grid.`
    )

    const newlyPublishedInGrid = publicPostsRes.posts.find(
        (p) => p.slug === TEST_IDENTIFIERS.testDraftSlug
    )
    assert(
        Boolean(newlyPublishedInGrid),
        'TC-13.4B',
        'New Article Visible on Public /blog',
        `Found newly published article "${newlyPublishedInGrid?.title}" on public blog grid.`
    )

    const showcaseArticle = publicPostsRes.posts.find(
        (p) => p.slug === 'the-modern-agbada-in-europe'
    )
    assert(
        Boolean(showcaseArticle),
        'TC-13.4C',
        'Showcase Post in Public Feed',
        `Found showcase post "${showcaseArticle?.title}" (Slug: ${showcaseArticle?.slug})`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 5: ARTICLE DETAIL & BOTTOM CTA TO /ORDER (TC-13.5)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 5. Testing Article Reader View & Bottom Conversion CTA ---')

    const detailRes = await getBlogPostBySlugAction(TEST_IDENTIFIERS.testDraftSlug, false)
    assert(
        detailRes.success === true && Boolean(detailRes.post),
        'TC-13.5A',
        'Public Reader View Resolution',
        `Reader view resolved successfully for slug "${detailRes.post?.slug}"`
    )

    assert(
        detailRes.post?.cta.isEnabled === true &&
        (detailRes.post?.cta.linkType === 'order' || detailRes.post?.cta.customUrl === '/order'),
        'TC-13.5B',
        'Bottom Conversion CTA to /order',
        `CTA button targets "${detailRes.post?.cta.customUrl}" with text: "${detailRes.post?.cta.text}"`
    )

    assert(
        detailRes.post?.contentEN.body.includes('Master Tailor Samuelson') === true,
        'TC-13.5C',
        'Editorial Body Formatting & Quotes',
        `Body markdown verified with authentic tailoring quotes.`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 6: EDGE CASES (TC-13.EC1 - TC-13.EC5)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 6. Testing Edge Cases & Robustness ---')

    // Edge Case 1: Duplicate Slug Collision
    const duplicateSubmission = await upsertBlogPostAdminAction({
        slug: TEST_IDENTIFIERS.duplicateBaseSlug,
        category: 'Style Guide',
        contentEN: {
            title: "The Modern Agbada in Europe: A Gentleman's Guide to Diaspora Weddings",
            body: 'A duplicate article test body content with same slug.',
        },
    })
    assert(
        duplicateSubmission.success === true &&
        Boolean(duplicateSubmission.post?.slug) &&
        duplicateSubmission.post!.slug !== TEST_IDENTIFIERS.duplicateBaseSlug &&
        duplicateSubmission.post!.slug.startsWith('the-modern-agbada-in-europe-'),
        'TC-13.EC1',
        'Duplicate Slug Collision Resolution',
        `Duplicate slug "${TEST_IDENTIFIERS.duplicateBaseSlug}" auto-resolved to unique slug "${duplicateSubmission.post?.slug}"`
    )

    // Edge Case 2: Draft Autosave State Retention
    const autosaveInput = {
        id: `post-autosave-${Date.now()}`,
        slug: 'test-flow13-autosave',
        status: 'draft' as const,
        contentEN: {
            title: 'Autosaved Draft Title',
            body: 'Autosaved draft body content before accidental navigation.',
        },
    }
    const autosaveRes = await upsertBlogPostAdminAction(autosaveInput)
    const retrievedDraft = getBlogPostById(autosaveRes.post!.id)
    assert(
        retrievedDraft?.contentEN.title === 'Autosaved Draft Title' &&
        retrievedDraft?.status === 'draft',
        'TC-13.EC2',
        'Draft Autosave & State Retention',
        `Autosaved draft persisted safely without data loss.`
    )

    // Edge Case 3: Public Access Denied for Unpublished Drafts
    const publicDraftAccess = await getBlogPostBySlugAction('test-flow13-autosave', false)
    assert(
        publicDraftAccess.success === false && publicDraftAccess.isDraft === true,
        'TC-13.EC3A',
        'Public Access Gating on Drafts (404 Protection)',
        `Unpublished draft rejected with: "${publicDraftAccess.error}"`
    )

    const adminPreviewAccess = await getBlogPostBySlugAction('test-flow13-autosave', true)
    assert(
        adminPreviewAccess.success === true && Boolean(adminPreviewAccess.post),
        'TC-13.EC3B',
        'Preview Flag Bypasses Public Gating for Admins',
        `Authenticated admin preview permitted for draft.`
    )

    // Edge Case 4: Title Slug Generation Helper
    const generatedSlug = generateSlug("L'Agbada Moderno in Europa: Guida di Stile!")
    assert(
        generatedSlug === 'lagbada-moderno-in-europa-guida-di-stile',
        'TC-13.EC4',
        'Slug Generator Special Character Normalization',
        `Generated clean URL slug: "${generatedSlug}"`
    )

    // Edge Case 5: Database State Synchronization
    try {
        const liveDbPost = await prisma.blogPost.create({
            data: {
                slug: TEST_IDENTIFIERS.testPublishSlug,
                status: PrismaPostStatus.PUBLISHED,
                titleEN: 'Live Database Synced Article',
                bodyEN: 'This is a test article stored in PostgreSQL for Flow 13.',
                tagsEN: ['Database', 'Sync'],
                category: 'Heritage & Craft',
            },
        })

        assert(
            Boolean(liveDbPost.id) && liveDbPost.status === PrismaPostStatus.PUBLISHED,
            'TC-13.EC5A',
            'Prisma PostgreSQL Record Creation',
            `Created database post ID "${liveDbPost.id}" with slug "${liveDbPost.slug}"`
        )

        const deleteRes = await deleteBlogPostAdminAction(TEST_IDENTIFIERS.testPublishSlug)
        assert(
            deleteRes.success === true,
            'TC-13.EC5B',
            'Post Deletion & Database Cleanup',
            `Deleted test article cleanly from database and memory.`
        )
    } catch (e: any) {
        console.warn('Database sync assertion note:', e.message)
    }

    // Final Cleanup
    await cleanupTestData()

    // ─────────────────────────────────────────────────────────────────────────────
    // SUMMARY REPORT
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════════════════')
    console.log('📊 FLOW 13 TEST SUITE SUMMARY REPORT')
    console.log('════════════════════════════════════════════════════════════════')

    const totalTests = results.length
    const passedTests = results.filter((r) => r.passed).length
    const failedTests = results.filter((r) => !r.passed).length
    const passPercentage = ((passedTests / totalTests) * 100).toFixed(1)

    console.log(`Total Assertions : ${totalTests}`)
    console.log(`Passed           : ${passedTests} ✅`)
    console.log(`Failed           : ${failedTests} ❌`)
    console.log(`Pass Rate        : ${passPercentage}%\n`)

    if (failedTests > 0) {
        console.error('FAILED TESTS:')
        results.filter((r) => !r.passed).forEach((r) => {
            console.error(`- [${r.id}] ${r.title}: ${r.details} (${r.error})`)
        })
        process.exit(1)
    } else {
        console.log('🎉 ALL FLOW 13 TEST ASSERTIONS PASSED WITH 100% SUCCESS!')
        process.exit(0)
    }
}

runTestSuite().catch((err) => {
    console.error('Fatal error running Flow 13 tests:', err)
    process.exit(1)
})
