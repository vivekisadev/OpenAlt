import SkeletonCard from "@/components/SkeletonCard";

export default function DirectorySkeleton() {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {[...Array(9)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
