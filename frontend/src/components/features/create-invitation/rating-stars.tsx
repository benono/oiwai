import { Star } from "lucide-react";

type RatingStarsProps = {
  rating: number;
};

const RatingStars = ({ rating }: RatingStarsProps) => {
  const totalStars = 5;
  const fullStars = Math.round(rating);
  const emptyStars = totalStars - fullStars;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, index) => (
        <Star
          key={`full-${index}`}
          className="text-primary"
          size={16}
          fill="currentColor"
        />
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <Star
          key={`empty-${index}`}
          className="text-primary"
          size={16}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

export default RatingStars;
