import * as React from "react"

// TODO: revisit the alias problem
// import { cn } from "@/src/lib/utils"
import { cn } from "../../lib/utils"

const HiddenInput = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm ",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
HiddenInput.displayName = "HiddenInput"

export { HiddenInput }
