export const hasPermission =(objectName, permissionType) =>{

// fetchPermission();

const permissions = JSON.parse(sessionStorage.getItem("userPermissions"))
   
console.log(permissions,"inside hasPermission ")
    const permission = permissions.find(p => p.object === objectName);
    if (permission) {
      return permission.permissions[permissionType];
    }
    return false;
}

//   This function takes in an objectName (e.g. "Account", "Contact", etc.) and a permissionType (e.g. "read", "create", "edit", or "delete") and returns true or false depending on whether the user has permission to perform that action on that object.
  
//   In your React component, you can use this function to conditionally render components or functionality based on the user's permissions. For example:
//   sql
//   Copy code
//   function MyComponent() {
//     return (
//       <div>
//         {hasPermission("Account", "create") && (
//           <button>Create Account</button>
//         )}
//         {hasPermission("Contact", "read") && (
//           <table>
//             {/* table rows here */}
//           </table>
//         )}
//         {hasPermission("Opportunity", "edit") ? (
//           <EditableOpportunity />
//         ) : (
//           <ReadOnlyOpportunity />
//         )}
//       </div>
//     );
//   }
//   In this example, the MyComponent function conditionally renders a "Create Account" button if the user has permission to create accounts, a table of contacts if the user has permission to read contacts, and either an editable or read-only version of an opportunity depending on whether the user has permission to edit opportunities.
  
//   By using the hasPermission function to check the user's permissions and conditionally rendering components or functionality based on those permissions, you can restrict a user's CRUD operations on specific objects in your React application.
  
  
  
  
  
  
  