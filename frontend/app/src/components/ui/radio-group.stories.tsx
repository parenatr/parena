import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta: Meta<typeof RadioGroup> = {
  title: "ui/RadioGroup",
  component: RadioGroup,
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="aylik" className="grid gap-3">
      <label className="flex items-center gap-2">
        <RadioGroupItem value="aylik" id="aylik" />
        <Label htmlFor="aylik">Aylık</Label>
      </label>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="yillik" id="yillik" />
        <Label htmlFor="yillik">Yıllık</Label>
      </label>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="aylik" disabled className="grid gap-3">
      <label className="flex items-center gap-2">
        <RadioGroupItem value="aylik" id="aylik-disabled" />
        <Label htmlFor="aylik-disabled">Aylık</Label>
      </label>
      <label className="flex items-center gap-2">
        <RadioGroupItem value="yillik" id="yillik-disabled" />
        <Label htmlFor="yillik-disabled">Yıllık</Label>
      </label>
    </RadioGroup>
  ),
};
