export const AccountInitialValues = {
  accountName: "",
  accountNumber: "",
  annualRevenue: "",
  rating: "",
  type: "",
  phone: "",
  industry: "",
  billingAddress: "",
  billingCountry: "",
  billingCity: "",
  createdbyId: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
  InventoryId: "",
};

export const AccountSavedValues = (singleAccount) => {
  return {
    accountName: singleAccount?.accountName ?? "",
    accountNumber: singleAccount?.accountNumber ?? "",
    annualRevenue: singleAccount?.annualRevenue ?? "",
    rating: singleAccount?.rating ?? "",
    type: singleAccount?.type ?? "",
    phone: singleAccount?.phone ?? "",
    industry: singleAccount?.industry ?? "",
    billingAddress: singleAccount?.billingAddress ?? "",
    billingCountry: singleAccount?.billingCountry ?? "",
    billingCity: singleAccount?.billingCity ?? "",
    createdbyId: singleAccount?.createdbyId ?? "",
    createdDate: new Date(singleAccount?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleAccount?.modifiedDate).toLocaleString(),
    _id: singleAccount?._id ?? "",
    inventoryDetails: singleAccount?.InventoryDetails ?? "",
    InventoryId: singleAccount?.InventoryId ?? "",
    InventoryName: singleAccount?.InventoryName ?? "",
    createdBy: (() => {
      try {
        return JSON.parse(singleAccount?.createdBy);
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return JSON.parse(singleAccount?.modifiedBy);
      } catch {
        return "";
      }
    })(),
  };
};

export const ContactInitialValues = {
  AccountId: "",
  salutation: "",
  firstName: "",
  lastName: "",
  fullName: "",
  dob: "",
  phone: "",
  department: "",
  leadSource: "",
  email: "",
  fullAddress: "",
  description: "",
  createdbyId: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const ContactSavedValues = (singleContact) => {
  return {
    AccountId: singleContact?.AccountId ?? "",
    salutation: singleContact?.salutation ?? "",
    firstName: singleContact?.firstName ?? "",
    lastName: singleContact?.lastName ?? "",
    fullName: singleContact?.fullName ?? "",
    phone: singleContact?.phone ?? "",
    dob:
      new Date(singleContact?.dob).getUTCFullYear() +
        "-" +
        ("0" + (new Date(singleContact?.dob).getUTCMonth() + 1)).slice(-2) +
        "-" +
        ("0" + (new Date(singleContact?.dob).getUTCDate() + 1)).slice(-2) || "",

    department: singleContact?.department ?? "",
    leadSource: singleContact?.leadSource ?? "",
    email: singleContact?.email ?? "",
    fullAddress: singleContact?.fullAddress ?? "",
    description: singleContact?.description ?? "",
    createdbyId: singleContact?.createdbyId ?? "",
    createdDate: new Date(singleContact?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleContact?.modifiedDate).toLocaleString(),
    _id: singleContact?._id ?? "",
    accountDetails: singleContact?.accountDetails ?? "",
    createdBy: (() => {
      try {
        return JSON.parse(singleContact?.createdBy);
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return JSON.parse(singleContact?.modifiedBy);
      } catch {
        return "";
      }
    })(),
  };
};

export const EmailInitialValues = {
  subject: "",
  htmlBody: "",
  recordsData: "",
  attachments: "",
};

export const InventoryInitialValues = {
  projectName: "",
  propertyName: "",
  propertyUnitNumber: "",
  type: "",
  tower: "",
  country: "",
  city: "",
  floor: "",
  status: "",
  totalArea: "",
  createdbyId: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const InventorySavedValues = (singleInventory) => {
  return {
    projectName: singleInventory?.projectName ?? "",
    propertyName: singleInventory?.propertyName ?? "",
    propertyUnitNumber: singleInventory?.propertyUnitNumber ?? "",
    type: singleInventory?.type ?? "",
    tower: singleInventory?.tower ?? "",
    country: singleInventory?.country ?? "",
    city: singleInventory?.city ?? "",
    floor: singleInventory?.floor ?? "",
    status: singleInventory?.status ?? "",
    totalArea: singleInventory?.totalArea ?? "",
    createdbyId: singleInventory?.createdbyId ?? "",
    createdDate: new Date(singleInventory?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleInventory?.modifiedDate).toLocaleString(),
    _id: singleInventory?._id ?? "",
    createdBy: (() => {
      try {
        return JSON.parse(singleInventory?.createdBy);
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return JSON.parse(singleInventory?.modifiedBy);
      } catch {
        return "";
      }
    })(),
  };
};

export const LeadInitialValues = {
  fullName: "",
  companyName: "",
  designation: "",
  phone: "",
  leadSource: "",
  industry: "",
  leadStatus: "",
  email: "",
  linkedinProfile: "",
  location: "",
  appointmentDate: "",
  demo: "",
  month: "",
  remarks: "",
  primaryPhone: "",
  secondaryPhone: "",
  createdDate: "",
  modifiedDate: "",
  createdBy: "",
  modifiedBy: "",
};

export const LeadSavedValues = (singleLead) => {
  return {
    fullName: singleLead?.fullName ?? "",
    companyName: singleLead?.companyName ?? "",
    designation: singleLead?.designation ?? "",
    phone: singleLead?.phone ?? "",
    leadSource: singleLead?.leadSource ?? "",
    industry: singleLead?.industry ?? "",
    leadStatus: singleLead?.leadStatus ?? "",
    email: singleLead?.email ?? "",
    linkedinProfile: singleLead?.linkedinProfile ?? "",
    location: singleLead?.location ?? "",
    primaryPhone: singleLead?.primaryPhone ?? "",
    secondaryPhone: singleLead?.secondaryPhone ?? "",
    appointmentDate:
      new Date(singleLead?.appointmentDate).getUTCFullYear() +
        "-" +
        ("0" + (new Date(singleLead?.appointmentDate).getUTCMonth() + 1)).slice(
          -2
        ) +
        "-" +
        ("0" + new Date(singleLead?.appointmentDate).getUTCDate()).slice(-2) ||
      "",
    demo: singleLead?.demo ?? "",
    month: singleLead?.month ?? "",
    remarks: singleLead?.remarks ?? "",
    createdDate: new Date(singleLead?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleLead?.modifiedDate).toLocaleString(),
    _id: singleLead?._id ?? "",
    createdBy: (() => {
      try {
        return JSON.parse(singleLead?.createdBy);
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return JSON.parse(singleLead?.modifiedBy);
      } catch {
        return "";
      }
    })(),
  };
};

export const OpportunityInitialValues = {
  LeadId: "",
  InventoryId: "",
  opportunityName: "",
  type: "",
  leadSource: "",
  amount: "",
  closeDate: "",
  stage: "",
  description: "",
  createdbyId: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const OpportunitySavedValues = (singleOpportunity) => {
  return {
    LeadId: singleOpportunity?.LeadId ?? "",
    InventoryId: singleOpportunity?.InventoryId ?? "",
    opportunityName: singleOpportunity?.opportunityName ?? "",
    type: singleOpportunity?.type ?? "",
    leadSource: singleOpportunity?.leadSource ?? "",
    amount: singleOpportunity?.amount ?? "",
    closeDate:
      new Date(singleOpportunity?.closeDate).getUTCFullYear() +
        "-" +
        (
          "0" +
          (new Date(singleOpportunity?.closeDate).getUTCMonth() + 1)
        ).slice(-2) +
        "-" +
        ("0" + (new Date(singleOpportunity?.closeDate).getUTCDate() + 1)).slice(
          -2
        ) || "",
    stage: singleOpportunity?.stage ?? "",
    description: singleOpportunity?.description ?? "",
    createdbyId: singleOpportunity?.createdbyId ?? "",
    createdDate: new Date(singleOpportunity?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleOpportunity?.modifiedDate).toLocaleString(),
    _id: singleOpportunity?._id ?? "",
    inventoryDetails: singleOpportunity?.inventoryDetails ?? "",
    leadDetails: singleOpportunity?.leadDetails ?? "",
    createdBy: (() => {
      try {
        return JSON.parse(singleOpportunity?.createdBy);
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return JSON.parse(singleOpportunity?.modifiedBy);
      } catch {
        return "";
      }
    })(),
  };
};

export const TaskInitialValues = {
  subject: "",
  relatedTo: "",
  assignedTo: "",
  StartDate: "",
  EndDate: "",
  description: "",
  // attachments: null,
  object: "",
  // AccountId: '',
  // LeadId: '',
  // OpportunityId: '',
  createdBy: "",
  modifiedBy: "",
  createdbyId: "",
  createdDate: "",
  modifiedDate: "",
};

export const TaskSavedValues = (singleTask) => {
  return {
    subject: singleTask?.subject ?? "",
    relatedto: singleTask?.relatedto ?? "",
    assignedTo: singleTask?.assignedTo ?? "",
    description: singleTask?.description ?? "",
    // attachments: singleTask?.attachments ?? "",
    object: singleTask?.object ?? "",
    // AccountId: singleTask?.AccountId ?? "",
    // LeadId: singleTask?.LeadId ?? "",
    // OpportunityId: singleTask?.OpportunityId ?? "",
    createdbyId: singleTask?.createdbyId ?? "",
    createdDate: new Date(singleTask?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleTask?.modifiedDate).toLocaleString(),
    _id: singleTask?._id ?? "",
    StartDate: new Date(singleTask?.StartDate),
    EndDate: new Date(singleTask?.EndDate),
    // StartDate:new Date(singleTask?.StartDate).getUTCFullYear()
    // + '-' +  ('0'+ (new Date(singleTask?.StartDate).getUTCMonth() + 1)).slice(-2)
    // + '-' + ('0'+ ( new Date(singleTask?.StartDate).getUTCDate())).slice(-2) ||'',
    // EndDate:  new Date(singleTask?.EndDate).getUTCFullYear()
    // + '-' +  ('0'+ (new Date(singleTask?.EndDate).getUTCMonth() + 1)).slice(-2)
    // + '-' + ('0'+ ( new Date(singleTask?.EndDate).getUTCDate())).slice(-2) ||'',

    accountDetails: singleTask?.accountDetails ?? "",
    leadDetails: singleTask?.leadDetails ?? "",
    opportunityDetails: singleTask?.opportunityDetails ?? "",
    createdBy: (() => {
      try {
        return JSON.parse(singleTask?.createdBy);
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return JSON.parse(singleTask?.modifiedBy);
      } catch {
        return "";
      }
    })(),
  };
};

export const UserInitialValues = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  phone: "",
  departmentName: "",
  roleDetails: "",
  access: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const UserSavedValues = (singleUser) => {
  return {
    firstName: singleUser?.firstName ?? "",
    lastName: singleUser?.lastName ?? "",
    fullName: singleUser?.fullName ?? "",
    userName: singleUser?.userName ?? "",
    email: singleUser?.email ?? "",
    phone: singleUser?.phone ?? "",
    departmentName: singleUser?.departmentName ?? "",
    role: singleUser?.role ?? "",
    access: singleUser?.access ?? "",
    createdbyId: singleUser?.createdbyId ?? "",
    createdDate: new Date(singleUser?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleUser?.modifiedDate).toLocaleString(),
    _id: singleUser?._id ?? "",
    roleDetails: (() => {
      try {
        return JSON.parse(singleUser?.roleDetails);
      } catch {
        return "";
      }
    })(),
    createdBy: (() => {
      try {
        return JSON.parse(singleUser?.createdBy);
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return JSON.parse(singleUser?.modifiedBy);
      } catch {
        return "";
      }
    })(),
  };
};

export const RoleInitialValues = {
  roleName: "",
  departmentName: "",
  createdBy: "",
  modifiedBy: "",
  createdDate: "",
  modifiedDate: "",
};

export const RoleSavedValues = (singleRole) => {
  return {
    roleName: singleRole?.roleName ?? "",
    departmentName: singleRole?.departmentName ?? "",
    createdDate: new Date(singleRole?.createdDate).toLocaleString(),
    modifiedDate: new Date(singleRole?.modifiedDate).toLocaleString(),
    _id: singleRole?._id ?? "",
    createdBy: (() => {
      try {
        return JSON.parse(singleRole?.createdBy);
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return JSON.parse(singleRole?.modifiedBy);
      } catch {
        return "";
      }
    })(),
  };
};

export const PermissionSetInitialValues = {
  permissionName: "",
  userDetails: "",
  permissionSets: [
    {
      object: "Account",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
    {
      object: "Contact",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
    {
      object: "Opportunity",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
    {
      object: "Lead",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
    {
      object: "Inventory",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
    {
      object: "Task",
      permissions: {
        read: false,
        create: false,
        edit: false,
        delete: false,
      },
      permissionLevel: 0,
    },
  ],

  createdDate: "",
  modifiedDate: "",
  createdBy: "",
  modifiedBy: "",
};

export const PermissionSavedValues = (singlePermission) => {
  return {
    permissionName: singlePermission?.permissionName ?? "",
    department: singlePermission?.department ?? "",
    createdDate: new Date(singlePermission?.createdDate).toLocaleString(),
    modifiedDate: new Date(singlePermission?.modifiedDate).toLocaleString(),
    _id: singlePermission?._id ?? "",
    roleDetails: (() => {
      try {
        return JSON.parse(singlePermission?.roleDetails);
      } catch {
        return "";
      }
    })(),
    userDetails: (() => {
      try {
        return JSON.parse(singlePermission?.userDetails);
      } catch {
        return "";
      }
    })(),
    createdBy: (() => {
      try {
        return JSON.parse(singlePermission?.createdBy);
      } catch {
        return "";
      }
    })(),
    modifiedBy: (() => {
      try {
        return JSON.parse(singlePermission?.modifiedBy);
      } catch {
        return "";
      }
    })(),
    permissionSets: (() => {
      try {
        return JSON.parse(singlePermission?.permissionSets);
      } catch {
        return "";
      }
    })(),
  };
};
