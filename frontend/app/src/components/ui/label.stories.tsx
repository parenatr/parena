import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";

const meta: Meta<typeof Label> = {
  title: "ui/Label",
  component: Label,
  args: { children: "E-posta adresi" },
};
export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {};
export const Required: Story = { args: { required: true } };
