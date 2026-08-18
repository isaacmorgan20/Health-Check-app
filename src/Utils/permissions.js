export const ROLES = {
  PATIENT: "patient",
  CLINIC_ADMIN: "clinic_admin",
  DOCTOR: "doctor",
  NURSE: "nurse",
  RECEPTIONIST: "receptionist",
  STAFF: "staff",
};

export const CLINIC_ROLES = [
  ROLES.CLINIC_ADMIN,
  ROLES.DOCTOR,
  ROLES.NURSE,
  ROLES.RECEPTIONIST,
  ROLES.STAFF,
];

export function isClinicRole(profile) {
  return profile && CLINIC_ROLES.includes(profile.role);
}

export function getPermissionScope(profile, action) {
  if (!profile) return false;

  const permissions = {
    [ROLES.PATIENT]: {
      "appointment.view": "own",
      "appointment.create": true,
      "appointment.reschedule": "own",
      "appointment.cancel": "own",
      "appointment.changeStatus": false,
      "profile.view": "own",
      "records.view": "own",
      "records.manage": false,
      "messages.send": "own",
      "packages.view": true,
      "packages.manage": false,
      "settings.manage": false,
      "staff.manage": false,
      "reports.view": false,
    },
    [ROLES.CLINIC_ADMIN]: {
      "appointment.view": "clinic",
      "appointment.create": true,
      "appointment.reschedule": "clinic",
      "appointment.cancel": "clinic",
      "appointment.changeStatus": "clinic",
      "profile.view": "clinic",
      "records.view": "clinic",
      "records.manage": "clinic",
      "messages.send": "clinic",
      "packages.view": true,
      "packages.manage": true,
      "settings.manage": true,
      "staff.manage": true,
      "reports.view": true,
    },
    [ROLES.DOCTOR]: {
      "appointment.view": "clinic",
      "appointment.create": false,
      "appointment.reschedule": "clinic",
      "appointment.cancel": "clinic",
      "appointment.changeStatus": "clinic",
      "profile.view": "clinic",
      "records.view": "clinic",
      "records.manage": "clinic",
      "messages.send": "clinic",
      "packages.view": true,
      "packages.manage": false,
      "settings.manage": false,
      "staff.manage": false,
      "reports.view": "limited",
    },
    [ROLES.NURSE]: {
      "appointment.view": "clinic",
      "appointment.create": false,
      "appointment.reschedule": "clinic",
      "appointment.cancel": "clinic",
      "appointment.changeStatus": "clinic",
      "profile.view": "clinic",
      "records.view": "clinic",
      "records.manage": "clinic",
      "messages.send": "clinic",
      "packages.view": true,
      "packages.manage": false,
      "settings.manage": false,
      "staff.manage": false,
      "reports.view": "limited",
    },
    [ROLES.RECEPTIONIST]: {
      "appointment.view": "clinic",
      "appointment.create": true,
      "appointment.reschedule": "clinic",
      "appointment.cancel": "clinic",
      "appointment.changeStatus": "clinic",
      "profile.view": "clinic",
      "records.view": "clinic",
      "records.manage": false,
      "messages.send": "clinic",
      "packages.view": true,
      "packages.manage": false,
      "settings.manage": false,
      "staff.manage": false,
      "reports.view": "limited",
    },
    [ROLES.STAFF]: {
      "appointment.view": "clinic",
      "appointment.create": false,
      "appointment.reschedule": false,
      "appointment.cancel": false,
      "appointment.changeStatus": false,
      "profile.view": "clinic",
      "records.view": false,
      "records.manage": false,
      "messages.send": false,
      "packages.view": true,
      "packages.manage": false,
      "settings.manage": false,
      "staff.manage": false,
      "reports.view": false,
    },
  };

  const rolePerms = permissions[profile.role] || permissions[ROLES.PATIENT];
  return rolePerms[action] ?? false;
}

export function can(profile, action) {
  const scope = getPermissionScope(profile, action);
  return scope === true || scope === "clinic" || scope === "limited";
}

export function canAccessOwn(profile, action, resourceOwnerUid) {
  const scope = getPermissionScope(profile, action);
  return scope === "own" && profile?.uid === resourceOwnerUid;
}

export function canAccessClinic(profile, action, clinicId) {
  const scope = getPermissionScope(profile, action);
  return (scope === "clinic" || scope === "limited") && profile?.clinicId === clinicId;
}

export function hasAnyAccess(profile, action, resourceOwnerUid, clinicId) {
  return (
    can(profile, action) ||
    canAccessOwn(profile, action, resourceOwnerUid) ||
    canAccessClinic(profile, action, clinicId)
  );
}