export const hasPermission =(objectName, permissionType) =>{

// fetchPermission();

const permissions = JSON.parse(sessionStorage.getItem("userPermissions"))
   
console.log(permissions,"inside hasPermission ")
    const permission = permissions.find(p => p.object === objectName);
    if (permission) {
      console.log(permission.permissions,"permission.permissions[permissionType]")
      return permission.permissions[permissionType];
    }
    return false;
}