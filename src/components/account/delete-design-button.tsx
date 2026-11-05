"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteDesignAction } from "@/app/actions/designs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteDesignButton({
  designId,
  designName,
}: {
  designId: string;
  designName: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    try {
      const result = await deleteDesignAction(designId);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      toast.success("Design deleted", {
        description: `"${designName}" has been removed from your account.`,
      });
      router.refresh();
    } catch {
      toast.error("The design could not be deleted. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label={`Delete ${designName}`}
        className="h-9 w-9 shrink-0 text-mocha hover:text-danger"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>

      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (!pending) {
            setOpen(nextOpen);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-danger-soft/70 text-danger">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <DialogTitle className="mt-4">
            Delete this{" "}
            <span className="serif-italic text-rose">design?</span>
          </DialogTitle>
          <DialogDescription>
            “{designName}” will be removed from your saved designs. Any orders
            already placed keep their own copy of the cake, so nothing about
            those changes.
          </DialogDescription>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Keep design
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  Deleting
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete design
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
