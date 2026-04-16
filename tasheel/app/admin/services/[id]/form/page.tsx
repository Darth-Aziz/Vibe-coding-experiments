import { redirect } from "next/navigation";

/**
 * Canonical form design lives in the service studio (step 2).
 * Spec: optional redirect from legacy /form URL to studio.
 */
export default async function AdminServiceFormRedirectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/services/${id}/studio`);
}
