import React, { ReactNode, useEffect, useState } from "react";
import { PermissionManager } from "@/utils/permissionManager"; // Assuming PermissionManager is imported correctly

interface CheckPageAccessProps {
  pageName: string;
  children: ReactNode;
}

const CheckPageAccess: React.FC<CheckPageAccessProps> = ({
  pageName,
  children,
}) => {
  const [hasPageAccess, setHasPageAccess] = useState(false);

  useEffect(() => {
    console.log("TESTER");

    const checkPageAccess = async () => {
      const permissionMan = new PermissionManager();
      await permissionMan.init();

      // Check if the user has access to the page
      const accessGranted = await permissionMan.hasPageAccess(pageName);
      setHasPageAccess(accessGranted);
    };

    checkPageAccess();
    console.log(hasPageAccess);
  }, [pageName]);

  return hasPageAccess ? <>{children}</> : null;
};

export default CheckPageAccess;
