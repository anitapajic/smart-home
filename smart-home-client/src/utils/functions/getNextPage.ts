export function getNext(role: string): string {
    switch (role) {
        case "USER":
            return "/user-home-page";
        case "ADMIN":
            return "/admin-home-page";
        case "SUPERADMIN":
            return "/admin-home-page";
        default:
            return ""
    }
}