import React from 'react'
import { Routes, Route, useNavigate } from "react-router-dom";
import AppNavbar from '../global/AppNavbar';
import ResponsiveAccounts from '../accounts/ResponsiveScreen';
import ResponsiveContacts from '../contacts/ResponsiveScreen';
import ResponsiveInventories from '../inventories/ResponsiveScreen';
import ResponsiveLeads from '../leads/ResponsiveScreen';
import ResponsiveOpportunities from '../opportunities/ResponsiveScreen';
import ResponsiveTasks from '../tasks/ResponsiveScreen';
import ResponsiveUsers from '../users/ResponsiveScreen';
import ContactDetailPage from '../recordDetailPage/ContactDetailPage';
import AccountDetailPage from '../recordDetailPage/AccountDetailPage';
import LeadDetailPage from '../recordDetailPage/LeadDetailPage';
import OpportunityDetailPage from '../recordDetailPage/OpportunityDetailPage';
import InventoryDetailPage from '../recordDetailPage/InventoryDetailPage';
import TaskDetailPage from '../recordDetailPage/TaskDetailPage';
import UserDetailPage from '../recordDetailPage/UserDetailPage';
import FlexAccounts from '../Flex/FlexAccounts';
import FlexInventories from '../Flex/FlexInventory';
import FlexLeads from '../Flex/FlexLeads';
import FlexOpportunities from '../Flex/FlexOpportunities';
import FlexTasks from '../Flex/FlexTasks';
import FileUploadUpdated from '../fileUpload/FileUpdated';
import RoleDetailPage from '../recordDetailPage/RoleDetailPage';
import RoleIndex from '../Roles';
import PermissionDetailPage from '../recordDetailPage/PermissionDetailPage';

function LoginLayoutIndex() {
  return (
    <>
      <AppNavbar />
      <Routes>
        <Route path="/" exact element={<ResponsiveInventories />} />
        <Route path="/accounts" element={<ResponsiveAccounts />} />
        <Route path="/contacts" element={<ResponsiveContacts />} />
        <Route path="/deals" element={<ResponsiveOpportunities />} />
        <Route path="/enquiries" element={<ResponsiveLeads />} />
        <Route path="/inventories" element={<ResponsiveInventories />} />
        <Route path="/task" element={<ResponsiveTasks />} />
        <Route path="/users" element={<ResponsiveUsers />} />
        <Route path="/roles" element={<RoleIndex/>}/>

        <Route path="/new-contacts" element={<ContactDetailPage />} />
        <Route path="/new-users" element={<UserDetailPage />} />
        <Route path="/new-task" element={<TaskDetailPage />} />
        <Route path="/new-inventories" element={<InventoryDetailPage />} />
        <Route path="/new-leads" element={<LeadDetailPage />} />
        <Route path="/new-opportunities" element={<OpportunityDetailPage />} />
        <Route path="/new-accounts" element={<AccountDetailPage />} />
        <Route path="/new-role" element={<RoleDetailPage/>}/>
        <Route path="/new-permission" element={<PermissionDetailPage/>}/>

        <Route path="/accountDetailPage/:id" element={<FlexAccounts />} />
        <Route path="/taskDetailPage/:id" element={<FlexTasks />} />
        <Route path="/inventoryDetailPage/:id" element={<FlexInventories />} />
        <Route path="/contactDetailPage/:id" element={<ContactDetailPage />} />
        <Route path="/userDetailPage/:id" element={<UserDetailPage />} />
        <Route path="/leadDetailPage/:id" element={<FlexLeads />} />
        <Route path="/opportunityDetailPage/:id" element={<FlexOpportunities />} />
        <Route path="/roleDetailPage/:id" element={<RoleDetailPage/>}/>

        <Route path="/file" element={<FileUploadUpdated />} />

        {/* <Route path="/leadDetailPage/:Id" element={<LeadDetailPage/>} /> */}
        {/* <Route path="/accountDetailPage/:id" element={<FlexAccounts/>} /> */}
        {/* <Route path="/dataLoader" element={<DataLoadPage />} /> */}
        {/* <Route path='/mobi' element={<AccountsMobile/>} /> */}
        {/* <Route path='/invmobi' element={<InventoriesMobile/>} />  */}
        {/* <Route path ='/test' element={<ResponsiveScreen/>} />   */}

      </Routes>
    </>
  )
}

export default LoginLayoutIndex