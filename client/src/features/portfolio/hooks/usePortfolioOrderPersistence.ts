import { useEffect, useState } from "react";
import type { ManualOrderProfile } from "@/features/portfolio/portfolioData";
import { normalizeManualOrder, resolveStoredOrderProfiles } from "@/lib/manualOrder";
import { getSafeStorage, readStorage, removeStorage, writeStorage } from "@/lib/safeStorage";

type PortfolioOrderPersistenceOptions = {
  repositoryIds: string[];
  predefinedProfiles: ManualOrderProfile[];
};

export function usePortfolioOrderPersistence({
  repositoryIds,
  predefinedProfiles,
}: PortfolioOrderPersistenceOptions) {
  const [manualProjectOrder, setManualProjectOrder] = useState<string[]>(() => {
    if (typeof window === "undefined") return repositoryIds;

    try {
      const stored = JSON.parse(readStorage(getSafeStorage("local"), "pablo-portfolio-manual-order") || "[]");
      return normalizeManualOrder(stored, repositoryIds);
    } catch {
      return repositoryIds;
    }
  });

  const [manualOrderProfiles, setManualOrderProfiles] = useState<ManualOrderProfile[]>(() => {
    if (typeof window === "undefined") return [];
    return resolveStoredOrderProfiles(
      readStorage(getSafeStorage("local"), "pablo-portfolio-order-profiles"),
      predefinedProfiles,
    );
  });

  const [activeOrderProfileId, setActiveOrderProfileId] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : readStorage(getSafeStorage("local"), "pablo-portfolio-active-order-profile"),
  );

  const activeOrderProfile = manualOrderProfiles.find((profile) => profile.id === activeOrderProfileId);

  useEffect(() => {
    writeStorage(getSafeStorage("local"), "pablo-portfolio-manual-order", JSON.stringify(manualProjectOrder));
  }, [manualProjectOrder]);

  useEffect(() => {
    writeStorage(getSafeStorage("local"), "pablo-portfolio-order-profiles", JSON.stringify(manualOrderProfiles));
  }, [manualOrderProfiles]);

  useEffect(() => {
    if (activeOrderProfileId) {
      writeStorage(getSafeStorage("local"), "pablo-portfolio-active-order-profile", activeOrderProfileId);
    } else {
      removeStorage(getSafeStorage("local"), "pablo-portfolio-active-order-profile");
    }
  }, [activeOrderProfileId]);

  useEffect(() => {
    if (!activeOrderProfileId) return;

    setManualOrderProfiles((profiles) =>
      profiles.map((profile) =>
        profile.id === activeOrderProfileId
        && JSON.stringify(profile.order) !== JSON.stringify(manualProjectOrder)
          ? { ...profile, order: manualProjectOrder }
          : profile,
      ),
    );
  }, [activeOrderProfileId, manualProjectOrder]);

  return {
    manualProjectOrder,
    setManualProjectOrder,
    manualOrderProfiles,
    setManualOrderProfiles,
    activeOrderProfileId,
    setActiveOrderProfileId,
    activeOrderProfile,
  } as const;
}
