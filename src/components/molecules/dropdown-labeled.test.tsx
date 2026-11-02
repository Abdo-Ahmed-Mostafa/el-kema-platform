import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { SelectItem } from "@/components/ui/select";
import { DropdownLabeled } from "./dropdown-labeled";

describe("DropdownLabeled", () => {
  it("associates the label with the trigger via htmlFor/id", () => {
    render(
      <DropdownLabeled label="Country" id="country" placeholder="Pick one">
        <SelectItem value="eg">Egypt</SelectItem>
      </DropdownLabeled>,
    );

    const trigger = screen.getByRole("combobox", { name: "Country" });
    expect(trigger).toHaveAttribute("id", "country");
  });
});
