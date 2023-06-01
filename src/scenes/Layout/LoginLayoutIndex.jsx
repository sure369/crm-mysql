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
import PermissionSets from '../permissionSets';
import StaticDashboardIndex from '../home';
import PageNotFound from '../Errors/PageNotFound';
import DynamicHomePage from '../dashboard/dynamicDashBoard'
import Files from '../Files/index'

function LoginLayoutIndex(props) {
  

  return (
    <>
      <Routes>
        <Route path="/" exact element={<StaticDashboardIndex />} />
        <Route path="/list/account" element={<ResponsiveAccounts />} />
        <Route path="/list/contact" element={<ResponsiveContacts />} />
        <Route path="/list/deals" element={<ResponsiveOpportunities />} />
        <Route path="/list/enquiry" element={<ResponsiveLeads />} />
        <Route path="/list/inventory" element={<ResponsiveInventories />} />
        <Route path="/list/event" element={<ResponsiveTasks />} />
        <Route path="/list/user" element={<ResponsiveUsers />} />
        <Route path="/list/role" element={<RoleIndex/>}/>
        <Route path="/list/permissions" element={<PermissionSets/>}/>
        <Route path="/list/file" element={<Files />} />
      <Route path="/list/dashboard" element={<DynamicHomePage />} /> 

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
        <Route path="/permissionDetailPage/:id" element={<PermissionDetailPage/>}/>

        <Route path="/file" element={<FileUploadUpdated />} />    
        <Route path="*" element={<PageNotFound />} />
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