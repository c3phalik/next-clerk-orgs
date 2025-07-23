"use client";

import { useEffect } from "react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";

export function OrganizationSync() {
  const { org_slug } = useParams<{ org_slug: string }>();
  const router = useRouter();
  const { organization } = useOrganization();
  const { userMemberships, setActive } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  // Set the active organization based on the URL slug
  useEffect(() => {
    const setActiveOrganizationFromSlug = async () => {
      if (!org_slug || !userMemberships.data || userMemberships.data.length === 0) {
        return;
      }

      // Find the organization matching the slug
      const matchingOrg = userMemberships.data.find(
        (membership) => membership.organization.slug === org_slug
      );

      // If found and not already active, set it as active
      if (
        matchingOrg &&
        organization?.id !== matchingOrg.organization.id &&
        setActive
      ) {
        await setActive({ organization: matchingOrg.organization });
      }
    };

    setActiveOrganizationFromSlug();
  }, [org_slug, userMemberships.data, organization, setActive]);

  return null; // This is a utility component that doesn't render anything
}
