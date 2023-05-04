import { hasPermission } from "./hasPermission";

export const getPermissions = (objectType) => {
    const hasCreate = hasPermission(objectType, "create");
    const hasEdit = hasPermission(objectType, "edit");
    const hasRead = hasPermission(objectType, "read");
    const hasDelete = hasPermission(objectType, "delete");
  
    return { create: hasCreate, read: hasRead, edit: hasEdit, delete: hasDelete };
  };