// Automated end-to-end verification of Government to Industry Collaboration Workflow
const BASE_URL = "http://localhost:3000";

async function runTest() {
  console.log("================================================================================");
  console.log("GOVERNMENT TO INDUSTRY COLLABORATION WORKFLOW - E2E VERIFICATION");
  console.log("================================================================================\n");

  // --------------------------------------------------------------------------------
  // STEP 1: Citizen Submits Issue
  // --------------------------------------------------------------------------------
  console.log("[TEST 1] Citizen submits a new civic issue...");
  const issuePayload = {
    title: "High-Pressure Main Pipeline Rupture Flooding Sub-Station",
    description: "Massive underground water main burst near the electrical sub-station. Pours 5000L/min. Municipal crew lacks trenchless robotic welding equipment.",
    category: "Water Supply & Sanitation",
    department: "Tamil Nadu Water Supply & Drainage Board",
    district: "Chennai",
    location: "Koyambedu Wholesale Complex, Near Sub-Station 4",
    coordinates: { lat: 13.0694, lng: 80.1948 },
    citizenName: "Karthik Subramanian",
    citizenPhone: "+91 98401 23456",
    citizenEmail: "karthik.sub@example.com",
    priority: "critical",
    media: [
      {
        url: "https://images.unsplash.com/photo-1541888946425-d0fbb18f13f7",
        type: "image",
        label: "Burst pipeline cross section"
      }
    ]
  };

  const submitRes = await fetch(`${BASE_URL}/api/issues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(issuePayload)
  });
  const submitData = await submitRes.json();
  if (!submitData.success || !submitData.issue) {
    throw new Error(`Failed to submit issue: ${JSON.stringify(submitData)}`);
  }
  const issue1 = submitData.issue;
  console.log(`✓ Issue created: ${issue1.id} - Status: ${issue1.status}`);

  // --------------------------------------------------------------------------------
  // STEP 2: Option 1 - Government Can Solve Internally
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 2] Testing Option 1: Government Handles Internally (No Industry)...");
  const handleInternalRes = await fetch(`${BASE_URL}/api/government/issues/${issue1.id}/handle-internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      officerId: "off-tn-004",
      officerName: "Er. K. Ramanathan, SE",
      notes: "Assigned to Ward 107 emergency road maintenance squad.",
      targetStatus: "in_progress"
    })
  });
  const handleInternalData = await handleInternalRes.json();
  if (!handleInternalData.success) {
    throw new Error(`Handle internally failed: ${JSON.stringify(handleInternalData)}`);
  }
  console.log(`✓ Handled Internally: Issue ${issue1.id} resolutionMode: ${handleInternalData.issue.resolutionMode}, Status: ${handleInternalData.issue.status}`);
  console.log(`  Assigned Officer: ${handleInternalData.issue.assignedOfficer}`);
  console.log(`  Industry Involvement: NONE (${handleInternalData.issue.assignedCompanyId || "None"})`);

  // --------------------------------------------------------------------------------
  // STEP 3: Create Second Issue for Option 2 (Transfer to Industry)
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 3] Citizen submits complex technical issue requiring Industry expertise...");
  const complexIssuePayload = {
    title: "High-Tech IoT Leakage & Deep Submersible Pump Motor Overhaul",
    description: "Deep bore water well system sensor array failure and structural crack requiring specialized sonar ultrasonic inspection and robotic repair.",
    category: "Water Supply & Sanitation",
    department: "Tamil Nadu Water Supply & Drainage Board",
    district: "Coimbatore",
    location: "Peelamedu Tech Park Zone, Ward 22",
    coordinates: { lat: 11.0287, lng: 77.0267 },
    citizenName: "Dr. Ananya Sundaram",
    citizenPhone: "+91 97890 55432",
    citizenEmail: "ananya.sundaram@techpark.in",
    priority: "high",
    media: [
      {
        url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758",
        type: "image",
        label: "Sonar fault sensor readings"
      }
    ]
  };

  const submitComplexRes = await fetch(`${BASE_URL}/api/issues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(complexIssuePayload)
  });
  const complexData = await submitComplexRes.json();
  const issue2 = complexData.issue;
  console.log(`✓ Issue created: ${issue2.id} - Status: ${issue2.status}`);

  // --------------------------------------------------------------------------------
  // STEP 4: Government gets AI Partner Recommendations
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 4] Government queries AI Recommendations for Industry Partners...");
  const recRes = await fetch(`${BASE_URL}/api/government/issues/${issue2.id}/transfer-industry`);
  const recData = await recRes.json();
  if (!recData.success || !recData.recommendations || recData.recommendations.length === 0) {
    throw new Error(`AI recommendations failed: ${JSON.stringify(recData)}`);
  }
  console.log(`✓ AI Recommended ${recData.recommendations.length} vetted companies:`);
  recData.recommendations.slice(0, 3).forEach((r) => {
    console.log(`  - [${r.company.id}] ${r.company.name} | Match: ${r.matchScore}% | ESG: ${r.company.esgGrade} | Reasons: ${(r.matchReasons || []).join("; ")}`);
  });

  const selectedPartner = recData.recommendations[0].company;
  console.log(`  Selected Partner for Work Order: ${selectedPartner.name} (${selectedPartner.id})`);

  // --------------------------------------------------------------------------------
  // STEP 5: Government generates Work Order and Transfers to Industry
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 5] Government generates Work Order and transfers case to Industry...");
  const transferRes = await fetch(`${BASE_URL}/api/government/issues/${issue2.id}/transfer-industry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId: selectedPartner.id,
      budget: 375000,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      scopeOfWork: "Deploy robotic pipe inspection camera, seal leak with food-grade epoxy composite, calibrate flow sensors.",
      officerId: "off-cbe-002",
      officerName: "Dr. K. Vijayakumar, Superintending Engineer"
    })
  });
  const transferData = await transferRes.json();
  if (!transferData.success || !transferData.workOrder) {
    throw new Error(`Transfer to industry failed: ${JSON.stringify(transferData)}`);
  }
  const workOrder = transferData.workOrder;
  console.log(`✓ Work Order Generated: ${workOrder.id}`);
  console.log(`  Contract Value: ₹${workOrder.budget.toLocaleString("en-IN")}`);
  console.log(`  Contract Status: ${workOrder.status}`);
  console.log(`  Grievance Status: ${transferData.issue.status} (Resolution Mode: ${transferData.issue.resolutionMode})`);

  // --------------------------------------------------------------------------------
  // STEP 6: Industry Portal retrieves Work Orders
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 6] Industry Portal views assigned Work Orders...");
  const industryListRes = await fetch(`${BASE_URL}/api/industry/work-orders?companyId=${selectedPartner.id}`);
  const industryListData = await industryListRes.json();
  const workOrderList = industryListData.workOrders || industryListData.items || industryListData.data || [];
  const fetchedWo = workOrderList.find((w) => w.id === workOrder.id);
  if (!fetchedWo) {
    throw new Error(`Work order ${workOrder.id} not found in Industry listing: ${JSON.stringify(industryListData)}`);
  }
  console.log(`✓ Industry verified Work Order in their dashboard: ${fetchedWo.id} - ${fetchedWo.issueTitle}`);

  // --------------------------------------------------------------------------------
  // STEP 7: Industry Accepts Work Order
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 7] Industry accepts the Work Order...");
  const acceptRes = await fetch(`${BASE_URL}/api/industry/work-orders/${workOrder.id}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId: selectedPartner.id,
      notes: "Mobilizing specialized robotics crew from Coimbatore tech hub."
    })
  });
  const acceptData = await acceptRes.json();
  if (!acceptData.success || acceptData.workOrder.status !== "accepted") {
    throw new Error(`Accept work order failed: ${JSON.stringify(acceptData)}`);
  }
  console.log(`✓ Work Order Status: ${acceptData.workOrder.status}`);

  // --------------------------------------------------------------------------------
  // STEP 8: Industry Submits Solution Plan
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 8] Industry submits Solution Plan & Milestones...");
  const planRes = await fetch(`${BASE_URL}/api/industry/work-orders/${workOrder.id}/solution-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId: selectedPartner.id,
      technicalApproach: "Phase 1: Sonar scan. Phase 2: Trenchless epoxy sleeve deployment. Phase 3: Pressure test at 12 bar.",
      equipmentDeployed: ["Acoustic Correlator", "Robotic Sleeve Expander", "Digital Pressure Rig"],
      milestones: [
        { title: "Sonar Acoustic Inspection", targetDate: "Day 1", percentage: 25 },
        { title: "Robotic Sleeve Installation", targetDate: "Day 3", percentage: 70 },
        { title: "Water Quality & Flow Calibration", targetDate: "Day 5", percentage: 100 }
      ]
    })
  });
  const planData = await planRes.json();
  if (!planData.success) {
    throw new Error(`Submit solution plan failed: ${JSON.stringify(planData)}`);
  }
  console.log(`✓ Solution Plan Submitted: ${planData.workOrder.solutionPlan.milestones.length} milestones registered.`);

  // --------------------------------------------------------------------------------
  // STEP 9: Industry Submits Progress Report
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 9] Industry logs field Progress Report...");
  const progressRes = await fetch(`${BASE_URL}/api/industry/work-orders/${workOrder.id}/progress-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId: selectedPartner.id,
      progressPercentage: 65,
      description: "Robotic welding sleeve installed. Sonar confirms zero leakage at 10 bar.",
      evidenceUrls: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd"]
    })
  });
  const progressData = await progressRes.json();
  if (!progressData.success) {
    throw new Error(`Progress report failed: ${JSON.stringify(progressData)}`);
  }
  console.log(`✓ Progress Report Recorded: Progress is at ${progressData.workOrder.progressReports[0].progressPercentage}%`);

  // --------------------------------------------------------------------------------
  // STEP 10: Industry Submits Final Completion Report
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 10] Industry submits Final Completion Report...");
  const compRes = await fetch(`${BASE_URL}/api/industry/work-orders/${workOrder.id}/completion-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId: selectedPartner.id,
      completionSummary: "Robotic structural sleeve curing complete. Tested at 12 bar for 2 hours with 0 pressure loss. Area restored.",
      evidenceUrls: [
        "https://example.gov.in/docs/pressure_certificate.pdf",
        "https://images.unsplash.com/photo-1541888946425-d0fbb18f13f7"
      ],
      testResults: "Hydrostatic test passed at 12 bar."
    })
  });
  const compData = await compRes.json();
  if (!compData.success || compData.workOrder.status !== "submitted") {
    throw new Error(`Completion report failed: ${JSON.stringify(compData)}`);
  }
  console.log(`✓ Completion Report Submitted: Work Order Status: ${compData.workOrder.status}`);

  // --------------------------------------------------------------------------------
  // STEP 11: Government Site Inspection & Approval
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 11] Government conducts official Site Inspection & approves work...");
  const inspectRes = await fetch(`${BASE_URL}/api/government/work-orders/${workOrder.id}/inspect-approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      officerId: "off-cbe-002",
      officerName: "Dr. K. Vijayakumar, Superintending Engineer",
      inspectionRemarks: "Inspected at 15:30. Water pressure restored to normal 4.2 bar. No seepage detected. Road patched smoothly."
    })
  });
  const inspectData = await inspectRes.json();
  if (!inspectData.success || inspectData.workOrder.status !== "approved") {
    throw new Error(`Site inspection approval failed: ${JSON.stringify(inspectData)}`);
  }
  console.log(`✓ Site Inspection Approved: Work Order Status: ${inspectData.workOrder.status}`);
  console.log(`  Inspection Details: ${inspectData.workOrder.completionReport.inspectionRemarks}`);

  // --------------------------------------------------------------------------------
  // STEP 12: Government Authorizes and Releases Payment
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 12] Government authorizes and releases payment to Industry...");
  const payRes = await fetch(`${BASE_URL}/api/government/work-orders/${workOrder.id}/approve-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      officerId: "off-cbe-002",
      officerName: "Dr. K. Vijayakumar, Superintending Engineer",
      notes: "Verified completion certificate and SLA compliance. Full payment disbursed."
    })
  });
  const payData = await payRes.json();
  if (!payData.success || !payData.payment) {
    throw new Error(`Approve payment failed: ${JSON.stringify(payData)}`);
  }
  const payment = payData.payment;
  console.log(`✓ Payment Authorized by Government:`);
  console.log(`  Invoice Reference: ${payment.invoiceRef}`);
  console.log(`  Amount: ₹${payment.amount.toLocaleString("en-IN")}`);
  console.log(`  Payment Status: ${payment.status}`);
  console.log(`  Approving Officer: ${payment.approvedBy}`);
  console.log(`  Transaction Hash: ${payment.transactionHash}`);

  // --------------------------------------------------------------------------------
  // STEP 13: Admin Audit & Governance Verification
  // --------------------------------------------------------------------------------
  console.log("\n[TEST 13] Admin checks collaboration audit telemetry...");
  const auditRes = await fetch(`${BASE_URL}/api/admin/industry-audits`);
  const auditData = await auditRes.json();
  if (!auditData.success) {
    throw new Error(`Admin audit fetch failed: ${JSON.stringify(auditData)}`);
  }
  console.log(`✓ Admin Audit Metrics:`);
  console.log(`  Total Registered Companies: ${auditData.companies.length}`);
  console.log(`  Total Work Orders: ${auditData.totalOutsourced}`);
  console.log(`  Total Payments Disbursed: ₹${auditData.totalBudgetDisbursed.toLocaleString("en-IN")}`);
  console.log(`  Active Collaborations: ${auditData.activeCollaborationsCount}`);

  console.log("\n================================================================================");
  console.log("ALL 13 TESTS PASSED PERFECTLY!");
  console.log("Government-to-Industry Collaboration Workflow is 100% verified and operational.");
  console.log("================================================================================");
}

runTest().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
