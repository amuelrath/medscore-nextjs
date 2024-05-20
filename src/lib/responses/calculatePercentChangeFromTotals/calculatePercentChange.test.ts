import { calculatePercentChangeFromTotals } from "./index";
import { expect, it, describe } from "@jest/globals";

describe("calculatePercentChangeFromTotals", () => {
  it("returns null when totals array has less than 2 elements", () => {
    const totals = [{ createdAt: new Date(), score: 100, versionId: "v1" }];
    const currentVersionId = "v1";
    expect(
      calculatePercentChangeFromTotals(totals, currentVersionId),
    ).toBeNull();
  });

  it("returns null when currentVersionId is not found in totals array", () => {
    const totals = [
      { createdAt: new Date(), score: 100, versionId: "v1" },
      { createdAt: new Date(), score: 200, versionId: "v2" },
    ];
    const currentVersionId = "v3";
    expect(
      calculatePercentChangeFromTotals(totals, currentVersionId),
    ).toBeNull();
  });

  it("returns null when currentVersionIndex is 0", () => {
    const totals = [
      { createdAt: new Date(), score: 100, versionId: "v1" },
      { createdAt: new Date(), score: 200, versionId: "v2" },
    ];
    const currentVersionId = "v1";
    expect(
      calculatePercentChangeFromTotals(totals, currentVersionId),
    ).toBeNull();
  });

  it("calculates percent change correctly", () => {
    const totals = [
      { createdAt: new Date(), score: 100, versionId: "v1" },
      { createdAt: new Date(), score: 200, versionId: "v2" },
      { createdAt: new Date(), score: 300, versionId: "v3" },
    ];
    const currentVersionId = "v3";
    expect(calculatePercentChangeFromTotals(totals, currentVersionId)).toEqual({
      percentChangeFromPrevious: 50,
      percentChangeFromFirst: 200,
    });
  });

  it("handles negative percent change correctly", () => {
    const totals = [
      { createdAt: new Date(), score: 300, versionId: "v1" },
      { createdAt: new Date(), score: 200, versionId: "v2" },
      { createdAt: new Date(), score: 100, versionId: "v3" },
    ];
    const currentVersionId = "v3";
    expect(calculatePercentChangeFromTotals(totals, currentVersionId)).toEqual({
      percentChangeFromPrevious: -50,
      percentChangeFromFirst: -66.66666666666666,
    });
  });

  it("handles zero percent change correctly", () => {
    const totals = [
      { createdAt: new Date(), score: 100, versionId: "v1" },
      { createdAt: new Date(), score: 100, versionId: "v2" },
      { createdAt: new Date(), score: 100, versionId: "v3" },
    ];
    const currentVersionId = "v3";
    expect(calculatePercentChangeFromTotals(totals, currentVersionId)).toEqual({
      percentChangeFromPrevious: 0,
      percentChangeFromFirst: 0,
    });
  });
});
