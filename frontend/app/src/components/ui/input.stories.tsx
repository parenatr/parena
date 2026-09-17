import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "ui/Input",
  component: Input,
  args: { placeholder: "ornek@eposta.com" },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Text: Story = { args: { type: "text", placeholder: "Adın" } };
export const Email: Story = { args: { type: "email" } };
export const Password: Story = { args: { type: "password", placeholder: "••••••••" } };
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
export const PasswordDisabled: Story = {
  args: { type: "password", placeholder: "••••••••", disabled: true },
};
