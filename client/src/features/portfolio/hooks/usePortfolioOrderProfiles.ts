import { useEffect, useState } from "react";
import { normalizeManualOrder } from "@/lib/manualOrder";
import { usePortfolioOrderPersistence } from "@/features/portfolio/hooks/usePortfolioOrderPersistence";
import type { ManualOrderProfile } from "@/features/portfolio/portfolioData";

type UsePortfolioOrderProfilesOptions = {
  repositoryIds: string[];
  predefinedProfiles: ManualOrderProfile[];
};

export function usePortfolioOrderProfiles({
  repositoryIds,
  predefinedProfiles,
}: UsePortfolioOrderProfilesOptions) {
  const {
    manualProjectOrder,
    setManualProjectOrder,
    manualOrderProfiles,
    setManualOrderProfiles,
    activeOrderProfileId,
    setActiveOrderProfileId,
    activeOrderProfile,
  } = usePortfolioOrderPersistence({ repositoryIds, predefinedProfiles });
  const [manualOrderStatus, setManualOrderStatus] = useState("");
  const [profileNameDraft, setProfileNameDraft] = useState("");
  const [previewOrderProfileId, setPreviewOrderProfileId] = useState<string | null>(null);
  const [recentlyActivatedOrderProfileId, setRecentlyActivatedOrderProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (!recentlyActivatedOrderProfileId) return;
    const timer = window.setTimeout(() => setRecentlyActivatedOrderProfileId(null), 1500);
    return () => window.clearTimeout(timer);
  }, [recentlyActivatedOrderProfileId]);

  function createOrderProfile() {
    const name = profileNameDraft.trim();
    if (!name) return;
    const profile: ManualOrderProfile = {
      id: `profile-${Date.now()}`,
      name,
      order: manualProjectOrder,
    };
    setManualOrderProfiles((profiles) => [...profiles, profile]);
    setActiveOrderProfileId(profile.id);
    setRecentlyActivatedOrderProfileId(profile.id);
    setProfileNameDraft("");
    setManualOrderStatus(`Perfil ${name} salvo e ativado.`);
  }

  function selectOrderProfile(profile: ManualOrderProfile) {
    setManualProjectOrder(normalizeManualOrder(profile.order, repositoryIds));
    setActiveOrderProfileId(profile.id);
    setRecentlyActivatedOrderProfileId(profile.id);
    setProfileNameDraft(profile.preset ? "" : profile.name);
    setManualOrderStatus(`Perfil ${profile.name} ativado.`);
  }

  function toggleOrderProfilePreview(profileId: string) {
    setPreviewOrderProfileId((currentId) => (currentId === profileId ? null : profileId));
  }

  function duplicateOrderProfile(profile: ManualOrderProfile) {
    const duplicatedProfile: ManualOrderProfile = {
      id: `profile-${Date.now()}`,
      name: `${profile.name} — cópia`,
      order: [...profile.order],
    };
    setManualOrderProfiles((profiles) => [...profiles, duplicatedProfile]);
    setActiveOrderProfileId(duplicatedProfile.id);
    setRecentlyActivatedOrderProfileId(duplicatedProfile.id);
    setProfileNameDraft(duplicatedProfile.name);
    setManualProjectOrder(normalizeManualOrder(duplicatedProfile.order, repositoryIds));
    setManualOrderStatus(`Perfil ${profile.name} duplicado como ${duplicatedProfile.name}.`);
  }

  function renameActiveOrderProfile() {
    const name = profileNameDraft.trim();
    if (!activeOrderProfileId || activeOrderProfile?.preset || !name) return;
    setManualOrderProfiles((profiles) =>
      profiles.map((profile) =>
        profile.id === activeOrderProfileId ? { ...profile, name } : profile,
      ),
    );
    setProfileNameDraft("");
    setManualOrderStatus(`Perfil renomeado para ${name}.`);
  }

  function deleteActiveOrderProfile() {
    if (!activeOrderProfileId || activeOrderProfile?.preset) return;
    const deletedProfile = manualOrderProfiles.find(
      (profile) => profile.id === activeOrderProfileId,
    );
    setManualOrderProfiles((profiles) =>
      profiles.filter((profile) => profile.id !== activeOrderProfileId),
    );
    setActiveOrderProfileId(null);
    setProfileNameDraft("");
    setManualOrderStatus(
      deletedProfile ? `Perfil ${deletedProfile.name} excluído.` : "Perfil excluído.",
    );
  }

  return {
    manualProjectOrder,
    manualOrderProfiles,
    activeOrderProfileId,
    activeOrderProfile,
    manualOrderStatus,
    profileNameDraft,
    setProfileNameDraft,
    previewOrderProfileId,
    recentlyActivatedOrderProfileId,
    createOrderProfile,
    selectOrderProfile,
    toggleOrderProfilePreview,
    duplicateOrderProfile,
    renameActiveOrderProfile,
    deleteActiveOrderProfile,
  };
}
