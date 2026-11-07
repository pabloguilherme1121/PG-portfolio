import { expect, test } from "@playwright/test";

test("cases preservam provas e explicam decisões sem overflow em 320 px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto("/#estudos-de-caso");
  const cases = page.locator('[data-case-study="true"]');
  await expect(cases).toHaveCount(2);
  for (const study of await cases.all()) {
    await study.locator("summary").click();
    for (const detail of ["problema", "objetivo", "decisões", "resultado"]) {
      await expect(
        study.locator(`[data-case-detail="${detail}"]`)
      ).toBeVisible();
    }
    await expect(study.locator('[data-case-stage="true"]')).toBeVisible();
    const caseId = await study.getAttribute("data-case-id");
    if (caseId === "CIV.01") {
      await expect(study.locator('[data-case-evidence="true"]')).toHaveCount(3);
    } else {
      expect(caseId).toBe("AV.02");
      await expect(study.locator('[data-case-evidence="true"]')).toHaveCount(0);
      await expect(study).toContainText("Publicações, autorização de uso e resultados comerciais");
    }
  }
  await expect(page.locator('[data-case-evidence="true"]')).toHaveCount(3);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  await page.goto("/#qualidade");
  await expect(page.locator('[data-quality-pipeline="true"]')).toHaveAttribute(
    "href",
    "https://github.com/pabloguilherme1121/PG-portfolio/actions/workflows/pages.yml"
  );
});
