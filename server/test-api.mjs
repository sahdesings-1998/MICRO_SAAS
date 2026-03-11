// ═══════════════════════════════════════════════════════════
// Micro-SaaS FULL API Test Suite — All 39 Endpoints  (v2)
// ═══════════════════════════════════════════════════════════

const BASE = "http://localhost:5000";
const results = [];

// Known test credentials
const SA_EMAIL = "test-sa@test.com";
const SA_PASS = "TestSuper@123";
const TEST_ADMIN_EMAIL = `apitest-admin-${Date.now()}@test.com`;
const TEST_ADMIN_PASS = "AdminTest@123";
const TEST_MEMBER_EMAIL = `apitest-member-${Date.now()}@test.com`;
const TEST_MEMBER_PASS = "MemberTest@123";

// Tokens & IDs
let superAdminToken = "";
let adminToken = "";
let memberToken = "";
let adminId = "";
let memberId = "";
let subscriptionId = "";
let invoiceId = "";
let testSuperAdminId = "";

// ───── helper ─────
async function req(method, path, body, token) {
    const opts = {
        method,
        headers: { "Content-Type": "application/json" },
    };
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
    if (body) opts.body = JSON.stringify(body);
    try {
        const r = await fetch(`${BASE}${path}`, opts);
        const text = await r.text();
        let data;
        try { data = JSON.parse(text); } catch { data = text; }
        return { status: r.status, data, ok: r.ok };
    } catch (err) {
        return { status: 0, data: { error: err.message }, ok: false };
    }
}

function test(num, name, method, path, status, pass, detail = "") {
    const icon = pass ? "✅" : "❌";
    console.log(`  ${icon}  ${num}. ${name}  [${method} ${path}] → ${status}${detail ? "  | " + detail : ""}`);
    results.push({ num, name, pass, status, detail });
}

// ═══════════════════════════════════════
async function run() {
    console.log("╔═══════════════════════════════════════════════════════════╗");
    console.log("║     MICRO-SAAS — FULL API TEST SUITE (39 APIs)  v2     ║");
    console.log("╚═══════════════════════════════════════════════════════════╝");

    // ────────────────────────────────────────
    // SECTION 1: HEALTH CHECK  (1 endpoint)
    // ────────────────────────────────────────
    console.log("\n┌─────────────────────────────────────┐");
    console.log("│  1 — HEALTH CHECK                   │");
    console.log("└─────────────────────────────────────┘");
    {
        const { status, data } = await req("GET", "/");
        test(1, "Health Check", "GET", "/", status, status === 200 && data === "API running");
    }

    // ────────────────────────────────────────
    // SECTION 2: AUTH  (2 endpoints)
    // ────────────────────────────────────────
    console.log("\n┌─────────────────────────────────────┐");
    console.log("│  2 — AUTH (2 endpoints)             │");
    console.log("└─────────────────────────────────────┘");

    // Login as SuperAdmin
    {
        const { status, data } = await req("POST", "/api/auth/login", { email: SA_EMAIL, password: SA_PASS });
        test(2, "Login (superadmin)", "POST", "/api/auth/login", status, status === 200 && data?.token, `role=${data?.user?.role}`);
        if (data?.token) superAdminToken = data.token;
    }

    // GET /api/auth/me
    {
        const { status, data } = await req("GET", "/api/auth/me", null, superAdminToken);
        test(3, "GET /api/auth/me", "GET", "/api/auth/me", status, status === 200 && data?.email === SA_EMAIL);
    }

    // Validation tests
    {
        const { status } = await req("POST", "/api/auth/login", {});
        test("2v1", "Login — missing fields → 401", "POST", "/api/auth/login", status, status === 401);
    }
    {
        const { status } = await req("POST", "/api/auth/login", { email: "x@x.com", password: "wrong" });
        test("2v2", "Login — wrong creds → 401", "POST", "/api/auth/login", status, status === 401);
    }
    {
        const { status } = await req("GET", "/api/auth/me");
        test("2v3", "GET /me — no token → 401", "GET", "/api/auth/me", status, status === 401);
    }
    {
        const { status } = await req("GET", "/api/auth/me", null, "faketoken");
        test("2v4", "GET /me — bad token → 401", "GET", "/api/auth/me", status, status === 401);
    }

    // ────────────────────────────────────────
    // SECTION 3: SUPERADMIN  (14 endpoints)
    // ────────────────────────────────────────
    console.log("\n┌─────────────────────────────────────┐");
    console.log("│  3 — SUPERADMIN (14 endpoints)      │");
    console.log("└─────────────────────────────────────┘");

    // 4: Create Admin
    {
        const { status, data } = await req("POST", "/api/superadmin/admins", {
            name: "API Test Admin",
            email: TEST_ADMIN_EMAIL,
            password: TEST_ADMIN_PASS,
            mobile: "9999888800",
            companyName: "TestCo"
        }, superAdminToken);
        test(4, "Create Admin", "POST", "/api/superadmin/admins", status, status === 201 || status === 200);
        if (data?.admin?._id) adminId = data.admin._id;
        // fallback: search list  
        if (!adminId && data?._id) adminId = data._id;
    }

    // 5: Get All Admins
    {
        const { status, data } = await req("GET", "/api/superadmin/admins", null, superAdminToken);
        const list = data?.admins ?? data ?? [];
        test(5, "Get All Admins", "GET", "/api/superadmin/admins", status, status === 200, `count=${list.length}`);
        if (!adminId && list.length) adminId = list[list.length - 1]._id;
    }

    // 6: Toggle Admin Status
    if (adminId) {
        const { status, data } = await req("PATCH", `/api/superadmin/admins/${adminId}/status`, { reason: "Test deactivation" }, superAdminToken);
        test(6, "Toggle Admin Status", "PATCH", "/api/superadmin/admins/:id/status", status, status === 200, `isActive=${data?.admin?.isActive}`);
        // Reactivate
        await req("PATCH", `/api/superadmin/admins/${adminId}/status`, { reason: "Reactivate" }, superAdminToken);
    }

    // 7: Get Admin Details
    if (adminId) {
        const { status } = await req("GET", `/api/superadmin/admins/${adminId}/details`, null, superAdminToken);
        test(7, "Get Admin Details", "GET", "/api/superadmin/admins/:id/details", status, status === 200);
    }

    // 8: Get Client (alias)
    if (adminId) {
        const { status } = await req("GET", `/api/superadmin/client/${adminId}`, null, superAdminToken);
        test(8, "Get Client (alias)", "GET", "/api/superadmin/client/:id", status, status === 200);
    }

    // 9: Create SuperAdmin
    {
        const { status, data } = await req("POST", "/api/superadmin/super-admins", {
            name: "Test SA 2",
            email: `apitest-sa2-${Date.now()}@test.com`,
            password: "TestSA2@123",
            mobile: "1111222233"
        }, superAdminToken);
        test(9, "Create SuperAdmin", "POST", "/api/superadmin/super-admins", status, status === 201 || status === 200);
        testSuperAdminId = data?.superAdmin?._id ?? data?._id ?? null;
    }

    // 10: Get All SuperAdmins
    {
        const { status, data } = await req("GET", "/api/superadmin/super-admins", null, superAdminToken);
        const list = data?.superAdmins ?? data ?? [];
        test(10, "Get All SuperAdmins", "GET", "/api/superadmin/super-admins", status, status === 200, `count=${list.length}`);
        if (!testSuperAdminId && list.length > 1) testSuperAdminId = list[list.length - 1]._id;
    }

    // 11: Update SuperAdmin
    if (testSuperAdminId) {
        const { status } = await req("PUT", `/api/superadmin/super-admins/${testSuperAdminId}`, { name: "Updated SA2" }, superAdminToken);
        test(11, "Update SuperAdmin", "PUT", "/api/superadmin/super-admins/:id", status, status === 200);
    }

    // 12: Soft-Delete SuperAdmin
    if (testSuperAdminId) {
        const { status } = await req("PATCH", `/api/superadmin/super-admins/${testSuperAdminId}/soft-delete`, { reason: "cleanup" }, superAdminToken);
        test(12, "Soft-Delete SuperAdmin", "PATCH", "/api/superadmin/super-admins/:id/soft-delete", status, status === 200);
    }

    // 13: Stats
    {
        const { status } = await req("GET", "/api/superadmin/stats", null, superAdminToken);
        test(13, "SuperAdmin Stats", "GET", "/api/superadmin/stats", status, status === 200);
    }

    // 14: Dashboard
    {
        const { status } = await req("GET", "/api/superadmin/dashboard", null, superAdminToken);
        test(14, "SuperAdmin Dashboard", "GET", "/api/superadmin/dashboard", status, status === 200);
    }

    // 15: Clients By Month
    {
        const { status } = await req("GET", "/api/superadmin/clients-by-month", null, superAdminToken);
        test(15, "Clients By Month", "GET", "/api/superadmin/clients-by-month", status, status === 200);
    }

    // 16: Reports
    {
        const { status } = await req("GET", "/api/superadmin/reports", null, superAdminToken);
        test(16, "SuperAdmin Reports", "GET", "/api/superadmin/reports", status, status === 200);
    }

    // Role guard
    {
        const { status } = await req("GET", "/api/superadmin/admins", null, "badtoken");
        test("3v1", "SA route — bad token → 401", "GET", "/api/superadmin/admins", status, status === 401);
    }

    // ── Login as Admin ──
    {
        const { status, data } = await req("POST", "/api/auth/login", { email: TEST_ADMIN_EMAIL, password: TEST_ADMIN_PASS });
        if (status === 200) {
            adminToken = data.token;
            console.log(`\n  🔑 Admin login OK: ${TEST_ADMIN_EMAIL}`);
        } else {
            console.log(`\n  ⚠️  Admin login failed: ${status} — ${JSON.stringify(data)}`);
        }
    }

    // ────────────────────────────────────────
    // SECTION 4: SUBSCRIPTIONS  (4 endpoints)
    //   ↑ Must create plan BEFORE member (required by createMember)
    // ────────────────────────────────────────
    console.log("\n┌─────────────────────────────────────┐");
    console.log("│  4 — SUBSCRIPTIONS (4 endpoints)    │");
    console.log("└─────────────────────────────────────┘");

    // 17: Create Subscription
    {
        const { status, data } = await req("POST", "/api/subscription", {
            planName: "API Test Plan",
            amount: 1500,
            duration: 6,
            description: "Six-month test plan"
        }, adminToken);
        test(17, "Create Subscription", "POST", "/api/subscription", status, status === 200 || status === 201, `id=${data?.plan?._id?.substring(0, 8)}`);
        if (data?.plan?._id) subscriptionId = data.plan._id;
    }

    // 18: Get Subscriptions
    {
        const { status, data } = await req("GET", "/api/subscription", null, adminToken);
        test(18, "Get Subscriptions", "GET", "/api/subscription", status, status === 200, `count=${data?.plans?.length}`);
        if (!subscriptionId && data?.plans?.length) subscriptionId = data.plans[0]._id;
    }

    // 19: Update Subscription
    if (subscriptionId) {
        const { status } = await req("PUT", `/api/subscription/${subscriptionId}`, { planName: "Updated Plan", amount: 2000 }, adminToken);
        test(19, "Update Subscription", "PUT", "/api/subscription/:id", status, status === 200);
    }

    // 20: DELETE at cleanup

    // ────────────────────────────────────────
    // SECTION 5: MEMBERS  (5 endpoints)
    // ────────────────────────────────────────
    console.log("\n┌─────────────────────────────────────┐");
    console.log("│  5 — MEMBERS (5 endpoints)          │");
    console.log("└─────────────────────────────────────┘");

    // 20: Create Member (now with subscriptionPlanId)
    if (subscriptionId) {
        const { status, data } = await req("POST", "/api/admin/members", {
            name: "API Test Member",
            email: TEST_MEMBER_EMAIL,
            password: TEST_MEMBER_PASS,
            mobile: "7777766666",
            companyName: "MemberCo",
            subscriptionPlanId: subscriptionId
        }, adminToken);
        test(20, "Create Member", "POST", "/api/admin/members", status, status === 200 || status === 201, `id=${data?.member?._id?.substring(0, 8)}`);
        if (data?.member?._id) memberId = data.member._id;
    }

    // 21: Get My Members
    {
        const { status, data } = await req("GET", "/api/admin/members", null, adminToken);
        test(21, "Get My Members", "GET", "/api/admin/members", status, status === 200, `count=${data?.members?.length}`);
        if (!memberId && data?.members?.length) memberId = data.members[0]._id;
    }

    // 22: Update Member
    if (memberId) {
        const { status } = await req("PUT", `/api/admin/members/${memberId}`, { name: "Updated Member", mobile: "5555544444" }, adminToken);
        test(22, "Update Member", "PUT", "/api/admin/members/:id", status, status === 200);
    }

    // 23: Toggle Member Status
    if (memberId) {
        const { status } = await req("PATCH", `/api/admin/members/${memberId}/status`, { reason: "Test toggle" }, adminToken);
        test(23, "Toggle Member Status", "PATCH", "/api/admin/members/:id/status", status, status === 200);
        // Reactivate
        await req("PATCH", `/api/admin/members/${memberId}/status`, { reason: "Reactivate" }, adminToken);
    }

    // 24: Soft-delete at cleanup

    // ────────────────────────────────────────
    // SECTION 6: INVOICES  (5 endpoints)
    // ────────────────────────────────────────
    console.log("\n┌─────────────────────────────────────┐");
    console.log("│  6 — INVOICES (5 endpoints)         │");
    console.log("└─────────────────────────────────────┘");

    // 24: Create Invoice
    if (memberId && subscriptionId) {
        const { status, data } = await req("POST", "/api/admin/invoices", {
            memberId,
            subscriptionPlanId: subscriptionId,
            date: new Date().toISOString(),
            status: "Unpaid"
        }, adminToken);
        test(24, "Create Invoice", "POST", "/api/admin/invoices", status, status === 200 || status === 201, `id=${data?.invoice?._id?.substring(0, 8)}`);
        if (data?.invoice?._id) invoiceId = data.invoice._id;
    }

    // 25: Get All Invoices
    {
        const { status, data } = await req("GET", "/api/admin/invoices", null, adminToken);
        test(25, "Get All Invoices", "GET", "/api/admin/invoices", status, status === 200, `count=${data?.invoices?.length}`);
        if (!invoiceId && data?.invoices?.length) invoiceId = data.invoices[0]._id;
    }

    // 26: Update Invoice
    if (invoiceId) {
        const { status } = await req("PUT", `/api/admin/invoices/${invoiceId}`, { status: "Paid" }, adminToken);
        test(26, "Update Invoice", "PUT", "/api/admin/invoices/:id", status, status === 200);
    }

    // 27: Toggle Invoice Status
    if (invoiceId) {
        const { status, data } = await req("PATCH", `/api/admin/invoices/${invoiceId}/status`, null, adminToken);
        test(27, "Toggle Invoice Status", "PATCH", "/api/admin/invoices/:id/status", status, status === 200, `now=${data?.invoice?.status}`);
    }

    // 28: Soft-delete at cleanup

    // ────────────────────────────────────────
    // SECTION 7: DASHBOARD & PROFILE  (6 endpoints)
    // ────────────────────────────────────────
    console.log("\n┌─────────────────────────────────────┐");
    console.log("│  7 — DASHBOARD & PROFILE (6)        │");
    console.log("└─────────────────────────────────────┘");

    // 28
    {
        const { status } = await req("GET", "/api/admin/stats", null, adminToken);
        test(28, "Admin Stats", "GET", "/api/admin/stats", status, status === 200);
    }
    // 29
    {
        const { status } = await req("GET", "/api/admin/dashboard", null, adminToken);
        test(29, "Admin Dashboard", "GET", "/api/admin/dashboard", status, status === 200);
    }
    // 30
    {
        const { status } = await req("GET", "/api/admin/reports", null, adminToken);
        test(30, "Admin Reports", "GET", "/api/admin/reports", status, status === 200);
    }
    // 31
    {
        const { status } = await req("GET", "/api/admin/revenue-by-month", null, adminToken);
        test(31, "Revenue By Month", "GET", "/api/admin/revenue-by-month", status, status === 200);
    }
    // 32
    {
        const { status, data } = await req("GET", "/api/admin/profile", null, adminToken);
        test(32, "Get Admin Profile", "GET", "/api/admin/profile", status, status === 200, `name=${data?.admin?.name ?? data?.name}`);
    }
    // 33
    {
        const { status } = await req("PUT", "/api/admin/profile", { mobile: "1010101010" }, adminToken);
        test(33, "Update Admin Profile", "PUT", "/api/admin/profile", status, status === 200);
    }

    // ── Login as Member ──
    {
        const { status, data } = await req("POST", "/api/auth/login", { email: TEST_MEMBER_EMAIL, password: TEST_MEMBER_PASS });
        if (status === 200) {
            memberToken = data.token;
            console.log(`\n  🔑 Member login OK: ${TEST_MEMBER_EMAIL}`);
        } else {
            console.log(`\n  ⚠️  Member login failed: ${status} — ${JSON.stringify(data)}`);
        }
    }

    // ────────────────────────────────────────
    // SECTION 8: MEMBER  (2 endpoints)
    // ────────────────────────────────────────
    console.log("\n┌─────────────────────────────────────┐");
    console.log("│  8 — MEMBER (2 endpoints)           │");
    console.log("└─────────────────────────────────────┘");

    if (!memberToken) {
        console.log("  ⚠️  Skipping — no member token");
    } else {
        // 34
        {
            const { status, data } = await req("GET", "/api/member/profile", null, memberToken);
            test(34, "Get Member Profile", "GET", "/api/member/profile", status, status === 200, `invoices=${data?.totalInvoices}`);
        }
        // 35
        {
            const { status } = await req("PUT", "/api/member/profile", { mobile: "9998887776" }, memberToken);
            test(35, "Update Member Profile", "PUT", "/api/member/profile", status, status === 200);
        }
    }

    // ────────────────────────────────────────
    // SECTION 9: ROLE GUARD TESTS
    // ────────────────────────────────────────
    console.log("\n┌─────────────────────────────────────┐");
    console.log("│  9 — ROLE GUARD TESTS               │");
    console.log("└─────────────────────────────────────┘");

    if (memberToken) {
        const { status } = await req("GET", "/api/admin/members", null, memberToken);
        test(36, "Member → Admin route → 403", "GET", "/api/admin/members", status, status === 403);
    }
    if (memberToken) {
        const { status } = await req("GET", "/api/superadmin/admins", null, memberToken);
        test(37, "Member → SA route → 403", "GET", "/api/superadmin/admins", status, status === 403);
    }
    if (adminToken) {
        const { status } = await req("GET", "/api/superadmin/admins", null, adminToken);
        test(38, "Admin → SA route → 403", "GET", "/api/superadmin/admins", status, status === 403);
    }
    if (adminToken) {
        const { status } = await req("GET", "/api/member/profile", null, adminToken);
        test(39, "Admin → Member route → 403", "GET", "/api/member/profile", status, status === 403);
    }

    // ────────────────────────────────────────
    // SECTION 10: CLEANUP
    // ────────────────────────────────────────
    console.log("\n┌─────────────────────────────────────┐");
    console.log("│  10 — CLEANUP                       │");
    console.log("└─────────────────────────────────────┘");

    // Soft-delete invoice
    if (invoiceId && adminToken) {
        const { status } = await req("PATCH", `/api/admin/invoices/${invoiceId}/soft-delete`, { reason: "cleanup" }, adminToken);
        test("C1", "Soft-Delete Invoice", "PATCH", "/api/admin/invoices/:id/soft-delete", status, status === 200);
    }

    // Delete subscription
    if (subscriptionId && adminToken) {
        const { status } = await req("DELETE", `/api/subscription/${subscriptionId}`, null, adminToken);
        test("C2", "Delete Subscription", "DELETE", "/api/subscription/:id", status, status === 200);
    }

    // Soft-delete member
    if (memberId && adminToken) {
        const { status } = await req("PATCH", `/api/admin/members/${memberId}/soft-delete`, { reason: "cleanup" }, adminToken);
        test("C3", "Soft-Delete Member", "PATCH", "/api/admin/members/:id/soft-delete", status, status === 200);
    }

    // Soft-delete admin
    if (adminId && superAdminToken) {
        const { status } = await req("PATCH", `/api/superadmin/admins/${adminId}/soft-delete`, { reason: "cleanup" }, superAdminToken);
        test("C4", "Soft-Delete Admin", "PATCH", "/api/superadmin/admins/:id/soft-delete", status, status === 200);
    }

    // ════════════════════════════════════════
    // FINAL SUMMARY
    // ════════════════════════════════════════
    const passed = results.filter(r => r.pass).length;
    const failed = results.filter(r => !r.pass).length;
    const total = results.length;

    console.log("\n╔═══════════════════════════════════════════════════════════╗");
    console.log("║                 FINAL TEST RESULTS                      ║");
    console.log("╠═══════════════════════════════════════════════════════════╣");
    console.log(`║  Total Tests:   ${String(total).padStart(3)}                                    ║`);
    console.log(`║  ✅ Passed:     ${String(passed).padStart(3)}                                    ║`);
    console.log(`║  ❌ Failed:     ${String(failed).padStart(3)}                                    ║`);
    console.log(`║  📊 Pass Rate:  ${((passed / total) * 100).toFixed(1).padStart(5)}%                                 ║`);
    console.log("╠═══════════════════════════════════════════════════════════╣");
    console.log(`║  SA=${superAdminToken ? "✅" : "❌"}  Admin=${adminToken ? "✅" : "❌"}  Member=${memberToken ? "✅" : "❌"}                       ║`);
    console.log("╚═══════════════════════════════════════════════════════════╝");

    if (failed > 0) {
        console.log("\n  ❌ FAILED TESTS:");
        results.filter(r => !r.pass).forEach(r => {
            console.log(`     ${r.num}. ${r.name}  → ${r.status}  ${r.detail || ""}`);
        });
    }
    console.log("");
}

run().catch(console.error);
