import React, { ReactNode, useEffect, useState } from "react";
import { PermissionManager } from "@/utils/permissionManager";
import { TouchableOpacity } from "react-native";
import Button from "@/components/DefaultButton";
import TextInput from "@/components/TextInput";
import QuantityInput from "@/components/QuantityInput";
import Switch from "@/components/Switch";

function disableChildrenRecursively(
  children: ReactNode,
  disabled: boolean
): ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    // Handle interactive elements like TouchableOpacity and Button
    if (
      child.type === TouchableOpacity ||
      child.type === Button ||
      child.type === TextInput ||
      child.type === QuantityInput ||
      child.type === Switch
    ) {
      return React.cloneElement(child, {
        disabled,
        editable: !disabled,
        onPress: disabled ? undefined : child.props.onPress,
      });
    }

    // For other elements, process their children recursively
    if (child.props?.children) {
      return React.cloneElement(child, {
        children: disableChildrenRecursively(child.props.children, disabled),
      });
    }

    return child;
  });
}

interface CheckPermissionProps {
  requiredPermission: string[];
  showIfNotPermitted?: boolean;
  children: ReactNode;
}

const CheckPermission: React.FC<CheckPermissionProps> = ({
  requiredPermission,
  showIfNotPermitted = false,
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

  if (hasPermission) {
    return <>{children}</>;
  }
  if (showIfNotPermitted) {
    return disableChildrenRecursively(children, true);
  }
  return null;
};

export default CheckPermission;
