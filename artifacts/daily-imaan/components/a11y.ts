import type { AccessibilityProps } from "react-native";

type Role = NonNullable<AccessibilityProps["accessibilityRole"]>;

export function a11yButton(
  label: string,
  hint?: string,
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: "button",
    accessibilityLabel: label,
    accessibilityHint: hint,
  };
}

export function a11yLink(label: string, hint?: string): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: "link",
    accessibilityLabel: label,
    accessibilityHint: hint,
  };
}

export function a11yToggle(
  label: string,
  isOn: boolean,
  hint?: string,
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: "switch",
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: { checked: isOn },
  };
}

export function a11yChecked(
  label: string,
  isChecked: boolean,
  hint?: string,
): AccessibilityProps {
  return {
    accessible: true,
    accessibilityRole: "checkbox",
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: { checked: isChecked },
  };
}

export function a11ySelectable(
  label: string,
  isSelected: boolean,
  hint?: string,
  role: Role = "radio",
): AccessibilityProps {
  // For `radio` role, screen readers expect `checked` state (selected is for tabs/cells).
  // For other roles (tab, menuitem, etc.), `selected` is the correct semantic.
  const state =
    role === "radio" ? { checked: isSelected } : { selected: isSelected };
  return {
    accessible: true,
    accessibilityRole: role,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityState: state,
  };
}

export const a11yDecorative: AccessibilityProps = {
  accessibilityElementsHidden: true,
  importantForAccessibility: "no",
};
