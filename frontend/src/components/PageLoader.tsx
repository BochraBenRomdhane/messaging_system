import { LoaderIcon } from "lucide-react";
import { PageLoaderProps } from "../types";

function PageLoader({}: PageLoaderProps) {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderIcon className="size-10 animate-spin" />
    </div>
  );
}
export default PageLoader;
