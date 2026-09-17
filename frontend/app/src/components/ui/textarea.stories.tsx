import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "ui/Textarea",
  component: Textarea,
  args: { placeholder: "Notunu yaz..." },
};
export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
