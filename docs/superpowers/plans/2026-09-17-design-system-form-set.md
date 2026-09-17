# Design System Form Set Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the §7.1 Form component set (Input, Textarea, Checkbox, Radio Group, Select, Label, Field) on top of the design-system foundation already on `main`, then migrate `RegisterPage` off its hand-rolled native-HTML form onto these components.

**Architecture:** Every component lives flat in `frontend/app/src/components/ui/` (kebab-case, no subfolders, no barrel — spec §2), built with the exact `Button` idiom: `forwardRef`, `cn()` (`@/lib/utils`) wrapping a `cva` variant function (or, for Radix-based components, wrapping the Radix primitive's class list), tokens-only Tailwind classes (no component-level dark-mode branching — dark mode is inherited automatically via `[data-theme="dark"]` token overrides). Each ships a co-located `*.stories.tsx` (all variant/size/state combinations) and `*.test.tsx` (render + interaction + a11y role assertion), per spec §8's Definition of Done.

**Tech Stack:** Same as foundation (React 19, TypeScript strict, Vite 8, Tailwind v4, Vitest + RTL + user-event, Storybook 10). New deps this plan adds: `@radix-ui/react-checkbox`, `@radix-ui/react-radio-group`, `@radix-ui/react-select`.

**Spec:** `docs/design-system/design-spec.md` §7.1. **Prior plan:** `docs/superpowers/plans/2026-09-17-design-system-foundation.md` (Button reference pattern).

## Global Constraints

- All imports use the `@/` alias, never relative paths across directories.
- `ui/` file names are kebab-case; no barrel/`index.ts` file is created.
- No new component/page CSS opens its own `:root` block or hardcodes a color/radius/shadow — always `var(--token-name)` or the Tailwind utility that maps to it.
- Every `ui/` component ships `*.stories.tsx` (all variant/size/state) + `*.test.tsx` (render + interaction + a11y role assertion).
- In-code comments and user-facing copy are Turkish (existing project convention); the plan/spec/commit-message text itself is English.
- Commit messages are English, imperative mood, per `.claude/rules/commit-messages.md`, with `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
- `npm run lint` must pass at the end of every task.
- `AuthField.tsx`/`AuthPasswordField.tsx` and everything under `keycloak-theme/` are **not touched** by this plan (shared with the Keycloak login theme, out of scope).

---

### Task 1: Install Radix dependencies

**Files:** `frontend/app/package.json`, `frontend/app/package-lock.json`

- [ ] **Step 1:** `cd frontend/app && npm install @radix-ui/react-checkbox @radix-ui/react-radio-group @radix-ui/react-select`
- [ ] **Step 2:** Verify: `grep -A1 '"@radix-ui/react-select"' package.json` shows the new entries alongside the existing `@radix-ui/react-label`/`@radix-ui/react-slot`/`@radix-ui/react-dialog`.
- [ ] **Step 3: Commit**
```bash
cd frontend/app && git add package.json package-lock.json
git commit -m "chore(design-system): add Radix Checkbox/RadioGroup/Select dependencies"
```

---

### Task 2: `Label` (rewrite in place)

**Files:**
- Modify: `frontend/app/src/components/ui/label.tsx` (rewrite, no `*-variants.ts` needed — single trivial variant)
- Create: `frontend/app/src/components/ui/label.stories.tsx`, `frontend/app/src/components/ui/label.test.tsx`

**Interfaces:** Produces `Label` (React component, `htmlFor`/native label props + `required?: boolean`). Consumed by `Field` (Task 8) and directly by Checkbox/RadioGroup usage sites (Task 9).

- [ ] **Step 1: Write failing test — `label.test.tsx`**
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Label } from "./label";

describe("Label", () => {
  it("renders the label text and associates via htmlFor", () => {
    render(
      <>
        <Label htmlFor="ad">Ad</Label>
        <input id="ad" />
      </>,
    );
    expect(screen.getByLabelText("Ad")).toBeInTheDocument();
  });

  it("shows a required indicator when required is set", () => {
    render(<Label required>E-posta</Label>);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("clicking the label focuses the associated control", async () => {
    render(
      <>
        <Label htmlFor="email">E-posta</Label>
        <input id="email" />
      </>,
    );
    await userEvent.click(screen.getByText("E-posta"));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });
});
```
Run: `npm run test -- label.test` — Expected FAIL (`./label` has no `required` prop / current file may still pass render but fail the required-indicator assertion).

- [ ] **Step 2: Implement `label.tsx`**
```tsx
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

export type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
  VariantProps<typeof labelVariants> & {
    required?: boolean;
  };

export const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, required, children, ...props }, ref) => (
    <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props}>
      {children}
      {required ? (
        <span className="ml-0.5 text-destructive" aria-hidden="true">
          *
        </span>
      ) : null}
    </LabelPrimitive.Root>
  ),
);
Label.displayName = "Label";
```

- [ ] **Step 3:** Run: `npm run test -- label.test` — Expected PASS (3/3).

- [ ] **Step 4: `label.stories.tsx`**
```tsx
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
```

- [ ] **Step 5:** `npm run lint` — Expected clean.
- [ ] **Step 6: Commit**
```bash
cd frontend/app && git add src/components/ui/label.tsx src/components/ui/label.stories.tsx src/components/ui/label.test.tsx
git commit -m "feat(design-system): add required-indicator support to Label"
```

---

### Task 3: `Input`

**Files:**
- Modify: `frontend/app/src/components/ui/input.tsx` (rewrite)
- Create: `frontend/app/src/components/ui/input.stories.tsx`, `frontend/app/src/components/ui/input.test.tsx`

**Interfaces:** Produces `Input` + `inputVariants` (cva). `type="password"` renders an internal show/hide toggle. `invalid?: boolean` drives an error-state variant. Consumed by `Field` usage sites and RegisterPage (Task 9).

- [ ] **Step 1: Write failing test — `input.test.tsx`**
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "./input";

describe("Input", () => {
  it("renders and accepts typed input", async () => {
    render(<Input aria-label="Ad" />);
    const input = screen.getByRole("textbox", { name: "Ad" });
    await userEvent.type(input, "Ayşe");
    expect(input).toHaveValue("Ayşe");
  });

  it("marks aria-invalid when invalid is set", () => {
    render(<Input aria-label="E-posta" invalid />);
    expect(screen.getByRole("textbox", { name: "E-posta" })).toHaveAttribute("aria-invalid", "true");
  });

  it("toggles password visibility", async () => {
    render(<Input type="password" aria-label="Parola" />);
    const input = screen.getByLabelText("Parola");
    expect(input).toHaveAttribute("type", "password");

    await userEvent.click(screen.getByRole("button", { name: "Parolayı göster" }));
    expect(input).toHaveAttribute("type", "text");
  });

  it("respects disabled", () => {
    render(<Input aria-label="Devre dışı" disabled />);
    expect(screen.getByRole("textbox", { name: "Devre dışı" })).toBeDisabled();
  });
});
```
Run: `npm run test -- input.test` — Expected FAIL (no `invalid` prop / no password toggle on current dead file).

- [ ] **Step 2: Implement `input.tsx`**
```tsx
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const inputVariants = cva(
  "flex h-10 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground shadow-xs " +
    "transition-colors placeholder:text-muted-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      invalid: {
        true: "border-destructive focus-visible:ring-destructive",
        false: "border-divider",
      },
    },
    defaultVariants: { invalid: false },
  },
);

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputVariants>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", invalid, "aria-invalid": ariaInvalid, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword ? (visible ? "text" : "password") : type;

    const input = (
      <input
        ref={ref}
        type={resolvedType}
        className={cn(inputVariants({ invalid }), isPassword && "pr-10", className)}
        aria-invalid={ariaInvalid ?? (invalid || undefined)}
        {...props}
      />
    );

    if (!isPassword) return input;

    return (
      <div className="relative">
        {input}
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Parolayı gizle" : "Parolayı göster"}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    );
  },
);
Input.displayName = "Input";
```

- [ ] **Step 3:** Run: `npm run test -- input.test` — Expected PASS (4/4).

- [ ] **Step 4: `input.stories.tsx`**
```tsx
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
```

- [ ] **Step 5:** `npm run lint` — Expected clean.
- [ ] **Step 6: Commit**
```bash
cd frontend/app && git add src/components/ui/input.tsx src/components/ui/input.stories.tsx src/components/ui/input.test.tsx
git commit -m "feat(design-system): add Input with password-visibility toggle and invalid state"
```

---

### Task 4: `Textarea`

**Files:** Create `frontend/app/src/components/ui/textarea.tsx`, `textarea.stories.tsx`, `textarea.test.tsx`

**Interfaces:** Produces `Textarea` + `textareaVariants`, same `invalid` contract as `Input`. No current consumer (spec: needed for future dashboard forms) — ships standalone like `RadioGroup`/`Select`.

- [ ] **Step 1: Write failing test — `textarea.test.tsx`**
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders and accepts typed input", async () => {
    render(<Textarea aria-label="Not" />);
    const textarea = screen.getByRole("textbox", { name: "Not" });
    await userEvent.type(textarea, "Merhaba");
    expect(textarea).toHaveValue("Merhaba");
  });

  it("marks aria-invalid when invalid is set", () => {
    render(<Textarea aria-label="Açıklama" invalid />);
    expect(screen.getByRole("textbox", { name: "Açıklama" })).toHaveAttribute("aria-invalid", "true");
  });

  it("respects disabled", () => {
    render(<Textarea aria-label="Devre dışı" disabled />);
    expect(screen.getByRole("textbox", { name: "Devre dışı" })).toBeDisabled();
  });
});
```
Run: `npm run test -- textarea.test` — Expected FAIL (file doesn't exist).

- [ ] **Step 2: Implement `textarea.tsx`**
```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex min-h-24 w-full rounded-lg border bg-surface px-3 py-2 text-sm text-foreground shadow-xs " +
    "transition-colors placeholder:text-muted-foreground " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      invalid: {
        true: "border-destructive focus-visible:ring-destructive",
        false: "border-divider",
      },
    },
    defaultVariants: { invalid: false },
  },
);

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  VariantProps<typeof textareaVariants>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, "aria-invalid": ariaInvalid, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(textareaVariants({ invalid }), className)}
      aria-invalid={ariaInvalid ?? (invalid || undefined)}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";
```

- [ ] **Step 3:** Run: `npm run test -- textarea.test` — Expected PASS (3/3).

- [ ] **Step 4: `textarea.stories.tsx`**
```tsx
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
```

- [ ] **Step 5:** `npm run lint` — Expected clean.
- [ ] **Step 6: Commit**
```bash
cd frontend/app && git add src/components/ui/textarea.tsx src/components/ui/textarea.stories.tsx src/components/ui/textarea.test.tsx
git commit -m "feat(design-system): add Textarea component"
```

---

### Task 5: `Checkbox`

**Files:** Create `frontend/app/src/components/ui/checkbox.tsx`, `checkbox.stories.tsx`, `checkbox.test.tsx`

**Interfaces:** Produces `Checkbox` (wraps `@radix-ui/react-checkbox`), supports `disabled` and tri-state `checked` (`true | false | "indeterminate"`). Consumed by RegisterPage (Task 9) for the terms/marketing checkboxes.

- [ ] **Step 1: Write failing test — `checkbox.test.tsx`**
```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("toggles checked state via click", async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Şartları kabul ediyorum" onCheckedChange={onCheckedChange} />);
    await userEvent.click(screen.getByRole("checkbox", { name: "Şartları kabul ediyorum" }));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("supports the indeterminate state", () => {
    render(<Checkbox aria-label="Tümünü seç" checked="indeterminate" />);
    expect(screen.getByRole("checkbox", { name: "Tümünü seç" })).toHaveAttribute(
      "data-state",
      "indeterminate",
    );
  });

  it("respects disabled", () => {
    render(<Checkbox aria-label="Devre dışı" disabled />);
    expect(screen.getByRole("checkbox", { name: "Devre dışı" })).toBeDisabled();
  });
});
```
Run: `npm run test -- checkbox.test` — Expected FAIL (file doesn't exist / package not resolvable until Task 1 is done — Task 1 must land first).

- [ ] **Step 2: Implement `checkbox.tsx`**
```tsx
import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const checkboxVariants = cva(
  "peer size-4 shrink-0 rounded-sm border border-divider bg-surface shadow-xs " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:cursor-not-allowed disabled:opacity-50 " +
    "data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=checked]:text-brand-foreground " +
    "data-[state=indeterminate]:border-brand data-[state=indeterminate]:bg-brand data-[state=indeterminate]:text-brand-foreground",
);

export type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;

export const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, ...props }, ref) => (
    <CheckboxPrimitive.Root ref={ref} className={cn(checkboxVariants(), className)} {...props}>
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {props.checked === "indeterminate" ? <Minus className="size-3" /> : <Check className="size-3" />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  ),
);
Checkbox.displayName = "Checkbox";
```

- [ ] **Step 3:** Run: `npm run test -- checkbox.test` — Expected PASS (3/3).

- [ ] **Step 4: `checkbox.stories.tsx`**
```tsx
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
```

- [ ] **Step 5:** `npm run lint` — Expected clean.
- [ ] **Step 6: Commit**
```bash
cd frontend/app && git add src/components/ui/checkbox.tsx src/components/ui/checkbox.stories.tsx src/components/ui/checkbox.test.tsx
git commit -m "feat(design-system): add Checkbox component on Radix Checkbox"
```

---

### Task 6: `RadioGroup` / `RadioGroupItem`

**Files:** Create `frontend/app/src/components/ui/radio-group.tsx`, `radio-group.stories.tsx`, `radio-group.test.tsx`

**Interfaces:** Produces `RadioGroup` + `RadioGroupItem` (wraps `@radix-ui/react-radio-group`). No RegisterPage consumer in this plan (Checkout's radio buttons are a separate, out-of-scope migration) — ships standalone per spec inventory.

- [ ] **Step 1: Write failing test — `radio-group.test.tsx`**
```tsx
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { RadioGroup, RadioGroupItem } from "./radio-group";

describe("RadioGroup", () => {
  it("selects an item and calls onValueChange", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={onValueChange}>
        <RadioGroupItem value="aylik" aria-label="Aylık" />
        <RadioGroupItem value="yillik" aria-label="Yıllık" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Yıllık" }));
    expect(onValueChange).toHaveBeenCalledWith("yillik");
  });

  it("only one item is checked at a time", () => {
    render(
      <RadioGroup defaultValue="aylik">
        <RadioGroupItem value="aylik" aria-label="Aylık" />
        <RadioGroupItem value="yillik" aria-label="Yıllık" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "Aylık" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "Yıllık" })).toHaveAttribute("aria-checked", "false");
  });
});
```
Run: `npm run test -- radio-group.test` — Expected FAIL (file doesn't exist).

- [ ] **Step 2: Implement `radio-group.tsx`**
```tsx
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const radioGroupItemVariants = cva(
  "aspect-square size-4 shrink-0 rounded-full border border-divider bg-surface shadow-xs " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
    "disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-brand",
);

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn("grid gap-2", className)} {...props} />
));
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item ref={ref} className={cn(radioGroupItemVariants(), className)} {...props}>
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="size-2 rounded-full bg-brand" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";
```

- [ ] **Step 3:** Run: `npm run test -- radio-group.test` — Expected PASS (2/2).

- [ ] **Step 4: `radio-group.stories.tsx`**
```tsx
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
```

- [ ] **Step 5:** `npm run lint` — Expected clean.
- [ ] **Step 6: Commit**
```bash
cd frontend/app && git add src/components/ui/radio-group.tsx src/components/ui/radio-group.stories.tsx src/components/ui/radio-group.test.tsx
git commit -m "feat(design-system): add RadioGroup component on Radix RadioGroup"
```

---

### Task 7: `Select`

**Files:** Create `frontend/app/src/components/ui/select.tsx`, `select.stories.tsx`, `select.test.tsx`

**Interfaces:** Produces `Select` (= `SelectPrimitive.Root`), `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectItem` (wraps `@radix-ui/react-select`). No RegisterPage consumer in this plan — ships for spec completeness / future dashboard use, like `RadioGroup`.

**Note:** Radix `Select`'s popup uses pointer-capture APIs jsdom doesn't implement — the test file polyfills `hasPointerCapture`/`releasePointerCapture`/`scrollIntoView` locally (this is a well-known Radix+jsdom interaction, not specific to this project).

- [ ] **Step 1: Write failing test — `select.test.tsx`**
```tsx
import { beforeAll, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

beforeAll(() => {
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

function Harness() {
  return (
    <Select defaultValue="aylik">
      <SelectTrigger aria-label="Dönem">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="aylik">Aylık</SelectItem>
        <SelectItem value="yillik">Yıllık</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("shows the selected value on the trigger", () => {
    render(<Harness />);
    expect(screen.getByRole("combobox", { name: "Dönem" })).toHaveTextContent("Aylık");
  });

  it("opens the listbox and selects a new option", async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole("combobox", { name: "Dönem" }));
    await userEvent.click(await screen.findByRole("option", { name: "Yıllık" }));
    expect(screen.getByRole("combobox", { name: "Dönem" })).toHaveTextContent("Yıllık");
  });
});
```
Run: `npm run test -- select.test` — Expected FAIL (file doesn't exist).

- [ ] **Step 2: Implement `select.tsx`**
```tsx
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-lg border border-divider bg-surface px-3 " +
        "text-sm text-foreground shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
        "disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="size-4 opacity-60" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        "z-50 overflow-hidden rounded-lg border border-divider bg-surface text-foreground shadow-md",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm " +
        "outline-none focus:bg-muted data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex size-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;
```

- [ ] **Step 3:** Run: `npm run test -- select.test` — Expected PASS (2/2).

- [ ] **Step 4: `select.stories.tsx`**
```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";

const meta: Meta<typeof Select> = {
  title: "ui/Select",
  component: Select,
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="aylik">
      <SelectTrigger aria-label="Dönem" className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="aylik">Aylık</SelectItem>
        <SelectItem value="yillik">Yıllık</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select defaultValue="aylik" disabled>
      <SelectTrigger aria-label="Dönem" className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="aylik">Aylık</SelectItem>
      </SelectContent>
    </Select>
  ),
};
```

- [ ] **Step 5:** `npm run lint` — Expected clean.
- [ ] **Step 6: Commit**
```bash
cd frontend/app && git add src/components/ui/select.tsx src/components/ui/select.stories.tsx src/components/ui/select.test.tsx
git commit -m "feat(design-system): add Select component on Radix Select"
```

---

### Task 8: `Field` (composition wrapper) + delete dead `text-field.tsx`

**Files:**
- Create: `frontend/app/src/components/ui/field.tsx`, `field.stories.tsx`, `field.test.tsx`
- Delete: `frontend/app/src/components/ui/text-field.tsx` (dead, zero consumers — confirmed via grep; superseded by `Field`)

**Interfaces:** Produces `Field` (`htmlFor`, `label`, `hint?`, `error?`, `required?`, `children`). Consumes `Label` (Task 2). Consumed by RegisterPage (Task 9) for Ad/Soyad/E-posta/Parola.

- [ ] **Step 1: Write failing test — `field.test.tsx`**
```tsx
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Field } from "./field";

describe("Field", () => {
  it("renders the label linked to the control via htmlFor", () => {
    render(
      <Field htmlFor="ad" label="Ad">
        <input id="ad" />
      </Field>,
    );
    expect(screen.getByLabelText("Ad")).toBeInTheDocument();
  });

  it("shows the hint when there is no error", () => {
    render(
      <Field htmlFor="pass" label="Parola" hint="en az 10 karakter">
        <input id="pass" />
      </Field>,
    );
    expect(screen.getByText("en az 10 karakter")).toBeInTheDocument();
  });

  it("shows the error with role=alert and hides the hint", () => {
    render(
      <Field htmlFor="mail" label="E-posta" hint="ornek@eposta.com" error="Geçerli bir e-posta adresi gir.">
        <input id="mail" />
      </Field>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Geçerli bir e-posta adresi gir.");
    expect(screen.queryByText("ornek@eposta.com")).not.toBeInTheDocument();
  });

  it("shows a required indicator on the label", () => {
    render(
      <Field htmlFor="soyad" label="Soyad" required>
        <input id="soyad" />
      </Field>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});
```
Run: `npm run test -- field.test` — Expected FAIL (file doesn't exist).

- [ ] **Step 2: Implement `field.tsx`**
```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

import { Label } from "./label";

export type FieldProps = {
  htmlFor: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function Field({ htmlFor, label, hint, error, required, children, className }: FieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      {children}
      {!error && hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 3:** Run: `npm run test -- field.test` — Expected PASS (4/4).

- [ ] **Step 4: `field.stories.tsx`**
```tsx
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
```

- [ ] **Step 5:** Delete `frontend/app/src/components/ui/text-field.tsx` and re-run `grep -rn "text-field\|TextField" frontend/app/src` to confirm zero remaining references before removing.

- [ ] **Step 6:** `npm run lint` and `npm run build` — Expected clean (build catches any stray `TextField` import the grep missed).

- [ ] **Step 7: Commit**
```bash
cd frontend/app && git add src/components/ui/field.tsx src/components/ui/field.stories.tsx src/components/ui/field.test.tsx
git rm src/components/ui/text-field.tsx
git commit -m "feat(design-system): add Field composition wrapper, remove dead TextField"
```

---

### Task 9: Migrate `RegisterPage` to the new Form set

**Files:** Modify `frontend/app/src/pages/Register/RegisterPage.tsx` only. No changes to `AuthShell.tsx`, `auth-shell.css`, `AuthField.tsx` (still used by Keycloak theme pages — do not touch).

**Interfaces:** Consumes `Field`, `Input`, `Checkbox`, `Label` (Tasks 2/3/5/8). Removes the `AuthField`/`AuthPasswordField` import from this file only.

- [ ] **Step 1:** Replace the imports:
```tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
```
Remove `import { AuthField, AuthPasswordField } from "@/components/auth/AuthField";`.

- [ ] **Step 2:** Replace the Ad/Soyad/E-posta `<AuthField>` usages with:
```tsx
<Field htmlFor="ad" label="Ad" required error={errors.ad}>
  <Input
    id="ad"
    type="text"
    name="given-name"
    placeholder="Adın"
    autoComplete="given-name"
    maxLength={60}
    value={firstName}
    onChange={(e) => setFirstName(e.target.value)}
    invalid={!!errors.ad}
  />
</Field>
```
(same shape for `soyad`/`mail`, preserving each field's existing `name`/`placeholder`/`autoComplete`/`maxLength`/`inputMode` props).

- [ ] **Step 3:** Replace `<AuthPasswordField>` with:
```tsx
<Field htmlFor="pass" label="Parola" required hint="en az 10 karakter" error={errors.pass}>
  <Input
    id="pass"
    type="password"
    name="password"
    placeholder="••••••••"
    autoComplete="new-password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    invalid={!!errors.pass}
  />
  <div className={strength ? `meter s${strength}` : "meter"} aria-hidden="true">
    <i />
    <i />
    <i />
    <i />
  </div>
  <p className="meter-txt">{password ? STRENGTH_LABELS[strength] : STRENGTH_LABELS[0]}</p>
</Field>
```
(the strength meter stays exactly as-is — domain-specific, not part of the generic `Input`).

- [ ] **Step 4:** Replace the terms checkbox block. Use the `Label` component (Task 2) as the wrapping element — not a plain `<label>` — since it renders a native `<label>` under the hood (so wrapping the Radix `Checkbox` still gives click-to-toggle) while keeping the component usage consistent with the rest of the migration:
```tsx
<div className="grid gap-1.5" style={{ marginTop: 20 }}>
  <Label className="flex items-start gap-2 font-normal">
    <Checkbox
      checked={terms}
      onCheckedChange={(checked) => setTerms(checked === true)}
      aria-invalid={errors.terms ? true : undefined}
      className="mt-0.5"
    />
    <span className="text-sm">
      <AppLink href="/kullanim-sartlari" target="_blank" rel="noopener">
        Kullanım Şartları
      </AppLink>
      'nı okudum, kabul ediyorum.
    </span>
  </Label>
  {errors.terms ? (
    <p className="text-xs text-destructive" role="alert">
      {errors.terms}
    </p>
  ) : null}
</div>
```
(`font-normal` overrides `Label`'s default `font-medium` — this text isn't a form-field label, it's a checkbox's own inline text, so it shouldn't look bold like "Ad"/"E-posta" do.)

- [ ] **Step 5:** Replace the marketing checkbox block the same way (`<Label>` wrapper, no error paragraph, `onCheckedChange` writes to `marketing`).

- [ ] **Step 6:** Replace the two KVKK/Gizlilik informational blocks (currently `<label className="check"><span>...</span></label>` with no `<input>`) with plain paragraphs — no checkbox, no `<label>`:
```tsx
<p className="text-sm text-muted-foreground" style={{ marginTop: 20 }}>
  Kişisel verilerinizin işlenmesine ilişkin{" "}
  <AppLink href="/kvkk" target="_blank" rel="noopener">
    Kvkk Aydınlatma Metni
  </AppLink>
  'ni inceleyebilirsiniz.
</p>
<p className="text-sm text-muted-foreground" style={{ marginTop: 20 }}>
  <AppLink href="/gizlilik" target="_blank" rel="noopener">
    Gizlilik Politikası
  </AppLink>
  'nı inceleyebilirsiniz.
</p>
```

- [ ] **Step 7: Verify.**
Run: `cd frontend/app && npm run build` — Expected clean (also confirms no other file still needs the removed `AuthField` import from this page).
Run: `cd frontend/app && npm run lint` — Expected clean.
Run: `cd frontend/app && npm run dev`, open `/uye-ol` — manually confirm: typing in each field works, leaving required fields empty and submitting shows the existing Turkish error messages, the password-visibility toggle on the new `Input` works, the strength meter still updates, the terms checkbox blocks submit when unchecked (existing `errors.terms` validation is untouched — only the markup changed), the marketing checkbox is optional and unchecked by default, and the two KVKK/Gizlilik paragraphs render as plain links (no stray checkbox UI).

- [ ] **Step 8: Commit**
```bash
cd frontend/app && git add src/pages/Register/RegisterPage.tsx
git commit -m "refactor(design-system): migrate RegisterPage to Field/Input/Checkbox"
```

---

## Self-Review Notes

- **Spec coverage:** §7.1's full table (Button already shipped in the foundation plan; Input/Textarea/Checkbox/RadioGroup/Select/Label/Field covered here Tasks 2–8) plus the migration payoff (Task 9).
- **Scope discipline:** `AuthField.tsx`, `keycloak-theme/`, `auth-shell.css`, `AuthShell.tsx`, and Checkout's radio/checkbox migration are explicitly out of scope — not touched by any task.
- **Placeholder scan:** none — every step has runnable code or a runnable command.
- **KVKK note:** the two informational (non-consent) blocks are deliberately *not* turned into checkboxes (would be a legal/consent scope change, not a component migration) — see Task 9 Step 6.
