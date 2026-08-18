const isAdmin = (profile) => {
    if (!profile) return false;
    return profile.role === "clinic_admin";
}

export default isAdmin