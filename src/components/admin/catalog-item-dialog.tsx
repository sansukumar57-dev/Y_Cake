"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { updateCatalogItemAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FieldHint,
  Input,
  Label,
  Select,
  Textarea,
} from "@/components/ui/form";
import { formatDollarsInput } from "@/lib/utils";
import type { DecorationIcon } from "@/lib/types";

type Kind = "size" | "flavor" | "frosting" | "decoration";

const iconOptions: DecorationIcon[] = [
  "berries",
  "roses",
  "macarons",
  "chocolate",
  "gold",
  "candles",
];

const kindLabels: Record<Kind, string> = {
  size: "size",
  flavor: "flavor",
  frosting: "frosting",
  decoration: "decoration",
};

export function CatalogItemDialog({
  kind,
  itemId,
  name,
  description,
  priceCents,
  sortOrder,
  active,
  tiers,
  servings,
  icon,
}: {
  kind: Kind;
  itemId: string;
  name: string;
  description: string;
  priceCents: number;
  sortOrder: number;
  active: boolean;
  tiers?: number;
  servings?: number;
  icon?: DecorationIcon;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!pending) {
      setOpen(nextOpen);
      if (nextOpen) {
        setError(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextName = String(formData.get("name") ?? "").trim();
    const nextDescription = String(formData.get("description") ?? "").trim();
    const dollars = Number(formData.get("price"));
    const nextSortOrder = Number(formData.get("sortOrder"));
    const nextActive = formData.get("active") === "on";

    if (!nextName || !nextDescription) {
      setError("Add a name and short description.");
      return;
    }
    if (!Number.isFinite(dollars) || dollars < 0) {
      setError("Enter a valid price.");
      return;
    }

    const price = Math.round(dollars * 100);
    let data: Record<string, unknown> = {
      name: nextName,
      description: nextDescription,
      priceCents: price,
      sortOrder: Number.isFinite(nextSortOrder) ? nextSortOrder : 0,
      active: nextActive,
    };

    if (kind === "size") {
      data = {
        name: nextName,
        description: nextDescription,
        basePriceCents: price,
        tiers: Number(formData.get("tiers") ?? 1),
        servings: Number(formData.get("servings") ?? 1),
        sortOrder: Number.isFinite(nextSortOrder) ? nextSortOrder : 0,
        active: nextActive,
      };
    }

    if (kind === "decoration") {
      data = {
        ...data,
        icon: String(formData.get("icon") ?? "berries"),
      };
    }

    setPending(true);
    setError(null);
    try {
      const result = await updateCatalogItemAction({
        kind,
        id: itemId,
        data,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      toast.success("Catalog updated", {
        description: `${nextName} is saved.`,
      });
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => setOpen(true)}
        aria-label={`Edit ${name}`}
        className="h-8 px-3 text-[11px]"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        Edit
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-md">
          <DialogTitle>
            Edit{" "}
            <span className="serif-italic text-rose">
              {kindLabels[kind]}.
            </span>
          </DialogTitle>
          <DialogDescription>
            These details appear in the studio immediately. Saved designs keep
            working, and placed orders keep their snapshot.
          </DialogDescription>

          <form onSubmit={handleSubmit} className="mt-5">
            <div className="space-y-4">
              <div>
                <Label htmlFor={`${kind}-${itemId}-name`}>Name</Label>
                <Input
                  id={`${kind}-${itemId}-name`}
                  name="name"
                  defaultValue={name}
                  maxLength={60}
                  required
                />
              </div>

              <div>
                <Label htmlFor={`${kind}-${itemId}-description`}>
                  Description
                </Label>
                <Textarea
                  id={`${kind}-${itemId}-description`}
                  name="description"
                  defaultValue={description}
                  maxLength={160}
                  rows={2}
                  className="min-h-16"
                  required
                />
                <FieldHint>Up to 160 characters.</FieldHint>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`${kind}-${itemId}-price`}>
                    {kind === "size" ? "Base price (USD)" : "Price (USD)"}
                  </Label>
                  <Input
                    id={`${kind}-${itemId}-price`}
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={formatDollarsInput(priceCents)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`${kind}-${itemId}-sort`}>Sort order</Label>
                  <Input
                    id={`${kind}-${itemId}-sort`}
                    name="sortOrder"
                    type="number"
                    min="0"
                    max="999"
                    defaultValue={sortOrder}
                  />
                </div>
              </div>

              {kind === "size" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`${kind}-${itemId}-tiers`}>Tiers</Label>
                    <Select
                      id={`${kind}-${itemId}-tiers`}
                      name="tiers"
                      defaultValue={tiers ?? 1}
                    >
                      <option value="1">1 tier</option>
                      <option value="2">2 tiers</option>
                      <option value="3">3 tiers</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`${kind}-${itemId}-servings`}>
                      Servings
                    </Label>
                    <Input
                      id={`${kind}-${itemId}-servings`}
                      name="servings"
                      type="number"
                      min="1"
                      max="500"
                      defaultValue={servings ?? 1}
                      required
                    />
                  </div>
                </div>
              ) : null}

              {kind === "decoration" ? (
                <div>
                  <Label htmlFor={`${kind}-${itemId}-icon`}>
                    Studio illustration
                  </Label>
                  <Select
                    id={`${kind}-${itemId}-icon`}
                    name="icon"
                    defaultValue={icon ?? "berries"}
                  >
                    {iconOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </Select>
                </div>
              ) : null}

              <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-sand bg-porcelain/40 p-3">
                <input
                  type="checkbox"
                  name="active"
                  defaultChecked={active}
                  className="mt-0.5 h-4 w-4 rounded border-sand accent-espresso"
                />
                <span>
                  <span className="block text-[12px] font-medium text-espresso">
                    Available in the studio
                  </span>
                  <span className="mt-0.5 block text-[10.5px] leading-relaxed text-mocha">
                    Hidden options stay saved but cannot be chosen for new
                    designs.
                  </span>
                </span>
              </label>
            </div>

            {error ? (
              <div
                role="alert"
                className="mt-3 rounded-xl border border-danger/15 bg-danger-soft/60 px-3.5 py-2.5 text-[12px] leading-relaxed text-danger"
              >
                {error}
              </div>
            ) : null}

            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? (
                  <>
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin"
                      aria-hidden="true"
                    />
                    Saving
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" aria-hidden="true" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
