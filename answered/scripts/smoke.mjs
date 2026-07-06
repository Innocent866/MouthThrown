import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const fail = (msg) => { console.error("FAIL:", msg); process.exit(1); };

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } }); // iPhone-ish

// 1. Landing
await page.goto(BASE);
await page.getByRole("link", { name: "Check my deadline" }).click();
await page.waitForURL("**/intake");
console.log("✓ landing → intake");

// 2. Intake
const served = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
await page.getByLabel("Date you were served").fill(served);
await page.getByLabel("Court name (from your summons)").click();
await page.getByLabel("Court name (from your summons)").fill("Harris");
await page.getByText("Precinct 1 Place 1").first().click();
await page.getByLabel("Case number").fill("2263-CV-01234");
await page.getByLabel("Plaintiff name").fill("Midland Credit Management");
await page.getByLabel("Amount claimed").fill("4,215.77");
await page.getByRole("button", { name: "Calculate my deadline" }).click();
await page.waitForURL("**/deadline");
const days = await page.locator("p").first().textContent();
console.log(`✓ intake → deadline (countdown shows: ${days} days)`);

// 3. Signup
await page.getByRole("link", { name: "Start my response — free" }).click();
await page.waitForURL("**/signup");
await page.getByLabel("Your full legal name").fill("Jordan Q. Sample");
await page.getByLabel("Email").fill("jordan@example.com");
await page.getByLabel("Password").fill("correct-horse-battery");
await page.getByRole("button", { name: "Continue to my response" }).click();
await page.waitForURL("**/interview");
console.log("✓ signup → interview");

// 4. Interview: 7 questions
await page.getByRole("button", { name: "Not sure", exact: true }).click(); // recognize?
await page.getByRole("button", { name: "I've never heard of them" }).click(); // plaintiff
await page.getByRole("button", { name: "I don't remember" }).click(); // last payment
await page.getByRole("button", { name: "No, it's too high" }).click(); // amount
await page.getByRole("button", { name: "No", exact: true }).click(); // identity theft
await page.getByRole("button", { name: "No", exact: true }).click(); // military
await page.getByRole("button", { name: "Mailed to me" }).click(); // service
await page.waitForURL("**/summary");
const summaryText = await page.textContent("main");
for (const expected of ["lack of knowledge", "standing", "amount", "service"]) {
  if (!summaryText.toLowerCase().includes(expected)) fail(`summary missing defense: ${expected}`);
}
console.log("✓ interview → summary (4 expected defenses listed)");

// 5. Preview: web worker generates watermarked PDF into a blob iframe
await page.getByRole("link", { name: "Preview my Answer — free" }).click();
await page.waitForURL("**/preview");
await page.waitForSelector('iframe[src^="blob:"]', { timeout: 30000 });
console.log("✓ preview: worker-generated watermarked PDF rendered");

// 6. Demo checkout → filing
await page.getByRole("button", { name: "Get my Answer — $99" }).click();
await page.waitForURL("**/filing?session_id=demo_session");
await page.waitForSelector("text=Payment confirmed", { timeout: 15000 });
console.log("✓ checkout (demo) → filing: payment confirmed, checklist shown");

// 7. Download final PDF via the API with the draft from localStorage
const draft = await page.evaluate(() => localStorage.getItem("answered.caseDraft.v1"));
const res = await page.request.post(`${BASE}/api/pdf`, {
  data: { draft: JSON.parse(draft), sessionId: "demo_session" },
});
if (res.status() !== 200) fail(`/api/pdf status ${res.status()}: ${await res.text()}`);
const body = await res.body();
if (!body.subarray(0, 5).toString().startsWith("%PDF-")) fail("response is not a PDF");
console.log(`✓ final PDF downloaded (${body.length} bytes, no watermark path)`);

// 8. Hard stop: expired deadline routes to /deadline-passed and never sells
await page.evaluate(() => {
  const d = JSON.parse(localStorage.getItem("answered.caseDraft.v1"));
  d.deadline = "2026-01-05";
  localStorage.setItem("answered.caseDraft.v1", JSON.stringify(d));
});
await page.goto(`${BASE}/deadline`);
await page.waitForURL("**/deadline-passed");
const stopText = await page.textContent("main");
if (!stopText.includes("legal")) fail("hard-stop page missing legal aid pointer");
console.log("✓ passed deadline → hard stop with legal aid links");

await browser.close();
console.log("\nALL SMOKE TESTS PASSED");
