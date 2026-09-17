import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "ui/Checkbox",
  component: Checkbox,
  args: { "aria-label": "Örnek onay kutusu" },
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { checked: true } };
export const Indeterminate: Story = { args: { checked: "indeterminate" } };
export const Disabled: Story = { args: { disabled: true } };
