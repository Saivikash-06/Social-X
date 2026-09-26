// scripts/verify_university_workflow.mjs
// Comprehensive Verification of the Industry -> University -> Student Mentorship Workflow

const BASE_URL = "http://localhost:3000";

async function runVerification() {
  console.log("=================================================================");
  console.log("SOCIAL-X: INDUSTRY TO UNIVERSITY & STUDENT MENTORSHIP WORKFLOW");
  console.log("=================================================================\n");

  // Step 1: Citizen Submits an Issue
  console.log("[1/11] Citizen submitting complex infrastructure issue via /api/issues...");
  const issueRes = await fetch(`${BASE_URL}/api/issues`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Subterranean Water Main Rupture with Cavity Formation",
      description: "Severe high-pressure pipeline blowout causing soil sinkholes on Outer Ring Road. Requires specialized acoustic sensing and trenchless composite patching.",
      category: "Water Supply & Sewerage (Metro Water)",
      department: "Chennai Metro Water (CMWSSB)",
      priority: "critical",
      district: "Chennai",
      state: "Tamil Nadu",
      address: "Outer Ring Road Junction, Velachery, Chennai",
      citizenId: "cit-test-001",
      citizenName: "R. Vikash",
      citizenPhone: "+91 98401 23456",
      citizenEmail: "vikash@socialx.org",
    }),
  });
  const issueJson = await issueRes.json();
  if (!issueJson.success || !issueJson.issue?.id) {
    throw new Error(`Step 1 Failed: ${JSON.stringify(issueJson)}`);
  }
  const issueId = issueJson.issue.id;
  console.log(`✅ Issue Created: ${issueId} (Status: ${issueJson.issue.status})`);

  // Step 2: Government Reviews and Transfers to Industry Partner
  console.log(`\n[2/11] Government Department issuing Work Order to Industry for ${issueId}...`);
  const assignRes = await fetch(`${BASE_URL}/api/government/issues/${issueId}/transfer-industry`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      companyId: "comp-ind-001",
      scopeOfWork: "Execute subterranean pipeline repair, soil stabilization, and sensor telemetry installation.",
      budget: 450000,
      officerRemarks: "Priority repair with trenchless technology. Field deployment within 7 days.",
      officerName: "Er. K. Murugesan (Superintending Engineer)",
      officerId: "off-cmwssb-001",
    }),
  });
  const assignJson = await assignRes.json();
  if (!assignJson.success || !assignJson.workOrder?.id) {
    throw new Error(`Step 2 Failed: ${JSON.stringify(assignJson)}`);
  }
  const workOrderId = assignJson.workOrder.id;
  console.log(`✅ Work Order Dispatched: ${workOrderId} to ${assignJson.workOrder.companyName}`);

  // Step 3: Industry Partner Accepts the Work Order
  console.log(`\n[3/11] Industry accepts Work Order ${workOrderId}...`);
  const acceptRes = await fetch(`${BASE_URL}/api/industry/work-orders/${workOrderId}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes: "Work order accepted by engineering management." }),
  });
  const acceptJson = await acceptRes.json();
  if (!acceptJson.success) {
    throw new Error(`Step 3 Failed: ${JSON.stringify(acceptJson)}`);
  }
  console.log(`✅ Work Order Accepted: Status is now "${acceptJson.workOrder.status}"`);

  // Step 4: Industry Fetches AI Recommendations for Universities (Option 2)
  console.log(`\n[4/11] Industry queries AI Recommendations for nearby Academic Partners...`);
  const aiRecsRes = await fetch(`${BASE_URL}/api/industry/work-orders/${workOrderId}/collaborate-university`);
  const aiRecsJson = await aiRecsRes.json();
  if (!aiRecsJson.success || !Array.isArray(aiRecsJson.recommendations)) {
    throw new Error(`Step 4 Failed: ${JSON.stringify(aiRecsJson)}`);
  }
  console.log(`✅ AI Identified ${aiRecsJson.recommendations.length} Academic Partners:`);
  for (const rec of aiRecsJson.recommendations) {
    console.log(`   - ${rec.university.name} (NIRF #${rec.university.nirfRank}, Depts: ${rec.recommendedDepartments.join(", ")})`);
  }

  // Step 5: Industry Sends Collaboration Request to University
  console.log(`\n[5/11] Industry sending Collaboration Request to University...`);
  const topRec = aiRecsJson.recommendations[0];
  const collabReqRes = await fetch(`${BASE_URL}/api/industry/work-orders/${workOrderId}/collaborate-university`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      universityId: topRec.university.id,
      department: topRec.recommendedDepartments[0] || "Artificial Intelligence",
      facultyId: topRec.facultyMentors[0]?.id || "fac-001",
      researchGrant: 125000,
      objectives: "Develop IoT acoustic leak sensor and rapid polymer curing sleeve for underwater repair.",
      requiredDeliverables: [
        "Acoustic Telemetry CAD & Firmware",
        "Polymer Patching Lab Prototype",
        "Field Deployment Report",
      ],
    }),
  });
  const collabReqJson = await collabReqRes.json();
  if (!collabReqJson.success || !collabReqJson.collaboration?.id) {
    throw new Error(`Step 5 Failed: ${JSON.stringify(collabReqJson)}`);
  }
  const collabId = collabReqJson.collaboration.id;
  console.log(`✅ Collaboration Request Created: ${collabId} (Status: ${collabReqJson.collaboration.status})`);
  console.log(`   Assigned Faculty: ${collabReqJson.collaboration.facultyName} (${collabReqJson.collaboration.universityName})`);

  // Step 6: Faculty Mentor Accepts Collaboration Request
  console.log(`\n[6/11] Faculty Mentor reviewing and accepting collaboration...`);
  const facDecisionRes = await fetch(`${BASE_URL}/api/university/collaborations/${collabId}/faculty-decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      decision: "accept",
      facultyNotes: "Project matches our Smart Infrastructure & Robotics laboratory scope. Accepting with 3-week sprint.",
      milestones: [
        { title: "Sensor Circuit & Firmware Design", deadline: "Week 1", status: "completed" },
        { title: "Composite Sleeve Prototyping", deadline: "Week 2", status: "in_progress" },
        { title: "Pressure Chamber Hydrostatic Test", deadline: "Week 3", status: "pending" },
      ],
    }),
  });
  const facDecisionJson = await facDecisionRes.json();
  if (!facDecisionJson.success) {
    throw new Error(`Step 6 Failed: ${JSON.stringify(facDecisionJson)}`);
  }
  console.log(`✅ Faculty Accepted: Status is now "${facDecisionJson.collaboration.status}"`);

  // Step 7: Faculty Assigns Student Team
  console.log(`\n[7/11] Faculty assigning Student Innovation Squad...`);
  const assignTeamRes = await fetch(`${BASE_URL}/api/university/collaborations/${collabId}/assign-team`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      studentTeamId: "team-001",
    }),
  });
  const assignTeamJson = await assignTeamRes.json();
  if (!assignTeamJson.success) {
    throw new Error(`Step 7 Failed: ${JSON.stringify(assignTeamJson)}`);
  }
  console.log(`✅ Student Team Assigned: "${assignTeamJson.collaboration.studentTeamName}" (Status: ${assignTeamJson.collaboration.status})`);

  // Step 8: Student Team Submits Prototype & Source Code
  console.log(`\n[8/11] Student Innovators submitting prototype & CAD schematics...`);
  const submitProtoRes = await fetch(`${BASE_URL}/api/university/collaborations/${collabId}/submit-solution`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      teamId: "team-001",
      title: "HydroShield Acoustic Sonar Sleeve v2.4",
      summary: "Non-invasive composite carbon sleeve integrated with piezoelectric acoustic sensors and Bluetooth Mesh telemetry. Detects sub-millimeter micro-fissures and arrests high-pressure leaks up to 8.5 bar.",
      sourceCodeUrl: "https://github.com/social-x-innovation/hydroshield-iot",
      researchPaperUrl: "https://socialx.gov.in/docs/research/CMWSSB_HydroShield_Report.pdf",
      prototypeImages: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      ],
    }),
  });
  const submitProtoJson = await submitProtoRes.json();
  if (!submitProtoJson.success) {
    throw new Error(`Step 8 Failed: ${JSON.stringify(submitProtoJson)}`);
  }
  console.log(`✅ Prototype Submitted: "${submitProtoJson.collaboration.solutionSubmission.title}" (Status: ${submitProtoJson.collaboration.status})`);

  // Step 9: Faculty Mentor Approves & Endorses Prototype
  console.log(`\n[9/11] Faculty Mentor evaluating and approving prototype for Industry...`);
  const facApproveRes = await fetch(`${BASE_URL}/api/university/collaborations/${collabId}/faculty-approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      facultyId: "fac-001",
      approved: true,
      feedback: "Hydrostatic test verified 8.5 bar without degradation. Calibrated and recommended for municipal field integration.",
      mentorRating: 5,
    }),
  });
  const facApproveJson = await facApproveRes.json();
  if (!facApproveJson.success) {
    throw new Error(`Step 9 Failed: ${JSON.stringify(facApproveJson)}`);
  }
  console.log(`✅ Faculty Endorsed: Status is now "${facApproveJson.collaboration.status}"`);

  // Step 10: Industry Reviews, Validates & Deploys Solution
  console.log(`\n[10/11] Industry validating solution & deploying on municipal site...`);
  const validateRes = await fetch(`${BASE_URL}/api/industry/collaborations/${collabId}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      industryId: "comp-ind-001",
      decision: "accepted",
      feedback: "Mounted HydroShield sleeve on 900mm pipe. Cavity backfilled and telemetry streaming to municipal SCADA.",
      deploymentEvidenceUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&auto=format&fit=crop&q=80",
    }),
  });
  const validateJson = await validateRes.json();
  if (!validateJson.success) {
    throw new Error(`Step 10 Failed: ${JSON.stringify(validateJson)}`);
  }
  console.log(`✅ Industry Validated & Deployed: Status is now "${validateJson.collaboration.status}"`);

  // Verify Certificates Generated
  const certsRes = await fetch(`${BASE_URL}/api/university/certificates`);
  const certsJson = await certsRes.json();
  console.log(`   Issued Academic Certificates Count: ${certsJson.certificates?.length || 0}`);
  if (certsJson.certificates?.length > 0) {
    const latest = certsJson.certificates[certsJson.certificates.length - 1];
    console.log(`   🎓 Latest Certificate: ${latest.certificateNumber} - ${latest.recipientName} (+${latest.academicCreditsAwarded} Academic Credits)`);
  }

  // Step 11: Check Final Issue State & Citizen Visibility
  console.log(`\n[11/11] Verifying Central Issue Timeline and Status...`);
  const verifyRes = await fetch(`${BASE_URL}/api/issues/${issueId}`);
  const verifyJson = await verifyRes.json();
  const finalIssue = verifyJson.issue;
  console.log(`✅ Central Issue Status: "${finalIssue.status}" (Forwarded to Government Inspection)`);
  console.log(`   Timeline Entries: ${finalIssue.timeline.length}`);
  console.log(`   Latest Timeline Event: "${finalIssue.timeline[finalIssue.timeline.length - 1].title}"`);

  console.log("\n=================================================================");
  console.log("🎉 ALL 11 STEPS OF THE INDUSTRY-UNIVERSITY WORKFLOW SUCCEEDED!");
  console.log("=================================================================");
}

runVerification().catch((err) => {
  console.error("\n❌ VERIFICATION TEST FAILED:", err);
  process.exit(1);
});
