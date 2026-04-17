/**
 * Logged-in admin identity for UI, default workflow actors, and demo seed data.
 */
export const ADMIN_USER_ID = "usr_abdulaziz" as const;

export const ADMIN_PERSONA = {
  id: ADMIN_USER_ID,
  name: "Abdulaziz Alhuwayhsan",
  email: "abdulaziz.alhuwayhsan@tasheel.com",
  initials: "AA",
  jobTitle: "Service Operations Lead",
} as const;
