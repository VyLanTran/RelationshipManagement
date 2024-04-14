import { Skeleton } from "../ui/skeleton";

const SearchLoading = () => {
    return (
        // TODO: make this responsive to different screen sizes
        <div className="flex items-center space-x-4 w-full">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    )
}

export default SearchLoading;