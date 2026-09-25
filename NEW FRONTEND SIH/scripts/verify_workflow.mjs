// Automated Verification Script for Citizen Grievance Submission to Government Portal
const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== STARTING END-TO-END ISSUE SUBMISSION & GOVERNMENT WORKFLOW VERIFICATION ===\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // Step 1: Initial list of issues
    console.log("--- Step 1: Fetch Central Issues List ---");
    const initRes = await fetch(`${BASE_URL}/api/issues`);
    assert(initRes.ok, "GET /api/issues responded with 200 OK");
    const initData = await initRes.json();
    assert(Array.isArray(initData.items), `Issues count in DB before test: ${initData.items.length}`);

    // Step 2: Citizen submits a new complaint
    console.log("\n--- Step 2: Citizen Submits Complaint with AI Routing ---");
    const submissionPayload = {
      title: "Ruptured high-pressure water pipe and road cave-in",
      description: "Severe underground water main burst near the junction. Deep crater formed in tarmac, potential threat to pedestrians and vehicles.",
      category: "", // left blank for AI auto-routing
      priority: "", // left blank for AI auto-routing
      address: "Anna Salai, Mount Road, Chennai Central, Ward 114",
      landmark: "Opposite Higginbothams",
      location: {
        lat: 13.0827,
        lng: 80.2707,
        address: "Anna Salai, Chennai, Ward 114",
      },
      attachments: [
        {
          name: "water_leak_crater.jpg",
          type: "image/jpeg",
          url: "https://images.unsplash.com/photo-1541888946425-d0fbb18f13f7?w=800",
        },
      ],
      isAnonymous: false,
    };

    const submitRes = await fetch(`${BASE_URL}/api/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissionPayload),
    });

    assert(submitRes.ok, "POST /api/issues succeeded with 201 Created");
    const submitResult = await submitRes.json();
    const createdIssue = submitResult.issue;

    assert(Boolean(createdIssue?.id), `Issue created with ID: ${createdIssue?.id}`);
    assert(/^SOC-2026-\d{6}$/.test(createdIssue?.id), `Issue ID format matches SOC-2026-XXXXXX: ${createdIssue?.id}`);
    assert(createdIssue?.status === "submitted", `Initial status is "submitted": actual = ${createdIssue?.status}`);
    
    // AI Routing validations
    console.log("\n--- Step 3: AI Routing Verification ---");
    assert(
      createdIssue?.category === "Water Supply & Drainage",
      `AI detected category correctly: "${createdIssue?.category}"`
    );
    assert(
      createdIssue?.priority === "critical" || createdIssue?.priority === "high",
      `AI detected priority as critical/high based on urgency: "${createdIssue?.priority}"`
    );
    assert(
      createdIssue?.assignedDepartment === "Municipal Administration & Water Supply",
      `AI assigned department correctly: "${createdIssue?.assignedDepartment}"`
    );
    assert(
      Boolean(createdIssue?.assignedOfficer),
      `AI assigned nodal officer: "${createdIssue?.assignedOfficer}"`
    );
    assert(
      createdIssue?.district?.includes("Chennai") || createdIssue?.address?.includes("Chennai"),
      `District detected as Chennai: "${createdIssue?.district || createdIssue?.address}"`
    );

    const targetIssueId = createdIssue.id;

    // Step 4: Verify Government Dashboard sees the new issue
    console.log("\n--- Step 4: Verify Government Influx & Queue ---");
    const govtIssuesRes = await fetch(`${BASE_URL}/api/issues`);
    const govtIssuesData = await govtIssuesRes.json();
    const foundInGovt = govtIssuesData.items.find((item) => item.id === targetIssueId);
    assert(Boolean(foundInGovt), `Grievance #${targetIssueId} appears immediately in Government Queue`);

    const statsRes = await fetch(`${BASE_URL}/api/government/stats`);
    const statsData = await statsRes.json();
    const stats = statsData.stats || statsData.data || {};
    assert(stats.totalAssignedCases >= 1, `Government total cases telemetry: ${stats.totalAssignedCases}`);

    // Step 5: Government updates status to "in_progress"
    console.log("\n--- Step 5: Government Progresses Status to 'in_progress' ---");
    const inProgressRes = await fetch(`${BASE_URL}/api/issues/${targetIssueId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "in_progress",
        notes: "Field engineer dispatched with pipeline repair kit and municipal backhoe excavator.",
        updatedBy: "Executive Engineer - Metro Water",
      }),
    });
    assert(inProgressRes.ok, "POST /api/issues/[id]/status to in_progress succeeded");
    const inProgressData = await inProgressRes.json();
    assert(
      inProgressData.issue?.status === "in_progress",
      `Grievance status transitioned to: ${inProgressData.issue?.status}`
    );

    // Step 6: Government resolves the complaint
    console.log("\n--- Step 6: Government Resolves Grievance ---");
    const resolveRes = await fetch(`${BASE_URL}/api/issues/${targetIssueId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "resolved",
        notes: "Main pipeline weld completed, road resurfaced, pressure test verified normal.",
        resolutionDetails: "Pipelock clamp installed and tarmac repaved.",
        updatedBy: "Chief Zonal Engineer",
      }),
    });
    assert(resolveRes.ok, "POST /api/issues/[id]/status to resolved succeeded");
    const resolveData = await resolveRes.json();
    assert(
      resolveData.issue?.status === "resolved",
      `Grievance status transitioned to: ${resolveData.issue?.status}`
    );

    // Step 7: Citizen Portal Synchronization
    console.log("\n--- Step 7: Citizen Portal Status Synchronization ---");
    const citizenCheckRes = await fetch(`${BASE_URL}/api/issues/${targetIssueId}`);
    assert(citizenCheckRes.ok, `GET /api/issues/${targetIssueId} responded 200`);
    const citizenCheckData = await citizenCheckRes.json();
    assert(
      citizenCheckData.issue?.status === "resolved",
      `Citizen portal reflects synchronized status 'resolved': ${citizenCheckData.issue?.status}`
    );
    assert(
      citizenCheckData.issue?.timeline?.length >= 3,
      `Audit timeline logs preserved: ${citizenCheckData.issue?.timeline?.length} events recorded`
    );

    // Step 8: Citizen Notifications Verification
    console.log("\n--- Step 8: Citizen Notifications Verification ---");
    const notifRes = await fetch(`${BASE_URL}/api/citizen/notifications`);
    assert(notifRes.ok, "GET /api/citizen/notifications responded 200");
    const notifJson = await notifRes.json();
    const notifs = notifJson.data || notifJson.items || [];
    const relatedNotifs = notifs.filter((n) => n.issueId === targetIssueId);

    assert(
      relatedNotifs.length >= 2,
      `Received ${relatedNotifs.length} real-time notifications for #${targetIssueId}`
    );
    const hasResolvedOrFeedback = relatedNotifs.some(
      (n) => n.type === "resolution" || n.type === "feedback_request" || n.message.includes("resolved")
    );
    assert(hasResolvedOrFeedback, "Citizen received Resolution / Feedback notification");

    console.log("\n=======================================================");
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log("=======================================================\n");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error("Test execution error:", err);
    process.exit(1);
  }
}

runTests();
