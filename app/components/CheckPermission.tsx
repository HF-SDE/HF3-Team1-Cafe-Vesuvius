import React, { ReactNode, useEffect, useState } from "react";
import { PermissionManager } from "@/utils/permissionManager";

interface CheckPermissionProps {
  requiredPermission: string[];
  children: ReactNode;
}

const CheckPermission: React.FC<CheckPermissionProps> = ({
  requiredPermission,
  children,
}) => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const permissionMan = new PermissionManager();
      await permissionMan.init();

      // Check if the user has any of the required permissions
      const permission = permissionMan.hasAllPermissions(requiredPermission);

      // If any permission is granted, set hasPermission to true
      setHasPermission(permission);
    };

    checkPermissions();
  }, [requiredPermission]);

  return hasPermission ? <>{children}</> : null;
};

export default CheckPermission;
