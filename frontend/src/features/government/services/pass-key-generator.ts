/**
 * Secure Unique Official Government Pass Key Generator
 * Pattern: STATE-DEPT-RANDOM-CODE
 * Examples:
 * - TN-CHE-82374-AX91
 * - TN-GOV-20483-KA91
 * - TN-MDU-88432-ZP11
 * - TN-CHN-11482-QW90
 * - TN-RVL-22981-XA22
 */

const KNOWN_DEPT_CODES: Record<string, string> = {
  "Municipal Administration & Water Supply": "CHE",
  "Public Works Department (PWD)": "PWD",
  "Highways & Minor Ports (Roads)": "ROA",
  "Tamil Nadu Generation & Distribution (TANGEDCO)": "ELE",
  "Health & Family Welfare": "HLT",
  "Solid Waste Management & Sanitation": "SWM",
  "Revenue & Disaster Management": "REV",
  "Town & Country Planning": "TCP",
  "Chennai Municipal Corporation": "CHN",
  "Madurai Municipal Corporation": "MDU",
  "Coimbatore City Municipal Corp": "CBE",
};

const RANDOM_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // omits confusing chars like 0, O, 1, I

export function generateUniquePassKey(
  stateCode = "TN",
  deptOrDistrict = "CHE",
  existingKeys: string[] = []
): string {
  // Normalize dept code to 3-4 alphanumeric uppercase characters
  let deptKey = KNOWN_DEPT_CODES[deptOrDistrict] || deptOrDistrict;
  deptKey = deptKey.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 3) || "GOV";

  let candidateKey = "";
  let attempts = 0;

  do {
    // 5-digit random number (10000 - 99999)
    const randomNum = Math.floor(10000 + Math.random() * 90000);

    // 4-character uppercase alphanumeric code
    let suffix = "";
    for (let i = 0; i < 4; i++) {
      suffix += RANDOM_CHARS.charAt(Math.floor(Math.random() * RANDOM_CHARS.length));
    }

    candidateKey = `${stateCode.toUpperCase()}-${deptKey}-${randomNum}-${suffix}`;
    attempts++;
  } while (existingKeys.includes(candidateKey) && attempts < 100);

  return candidateKey;
}

export function isValidPassKeyFormat(key: string): boolean {
  return /^[A-Z]{2}-[A-Z0-9]{3,4}-[0-9]{4,5}-[A-Z0-9]{4}$/.test(key);
}
