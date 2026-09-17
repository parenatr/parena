import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./input";
import { Field } from "./field";

const meta: Meta<typeof Field> = {
  title: "ui/Field",
  component: Field,
  args: { htmlFor: "demo", label: "E-posta adresi" },
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: (args) => (
    <Field {...args}>
      <Input id={args.htmlFor} placeholder="ornek@eposta.com" />
    </Field>
  ),
};

export const WithHint: Story = {
  ...Default,
  args: { ...Default.args, hint: "Doğrulama bağlantısı buraya gelecek." },
};

export const WithError: Story = {
  ...Default,
  args: { ...Default.args, error: "Geçerli bir e-posta adresi gir." },
};

export const Required: Story = {
  ...Default,
  args: { ...Default.args, required: true },
};
