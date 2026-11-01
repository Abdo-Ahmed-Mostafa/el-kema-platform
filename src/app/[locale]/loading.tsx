import { Spinner } from "@/components/shared/spinner";

/**
 * Top-level loading fallback for the locale subtree. Shown while a segment's
 * server work streams in. Must be deterministic (no request/random data) so it
 * is safe in the prerendered shell under Cache Components.
 */
export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center p-12">
      <Spinner className="size-8" />
    </div>
  );
}
