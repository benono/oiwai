import { useThemeStore } from "@/store/use-theme-store";
import { RsvpResponseType } from "@/types/rsvp-response";

type RsvpButtonProps = {
  label: string;
  value: RsvpResponseType["status"];
  selection: RsvpResponseType["status"];
  onClick: (value: RsvpResponseType["status"]) => void;
};

const RsvpButton = ({ label, value, selection, onClick }: RsvpButtonProps) => {
  const { themeColor } = useThemeStore();
  const isSelected = selection === value;

  return (
    <button
      type="button"
      className={`box-border flex-1 transform rounded-lg p-4 font-bold transition-all duration-300 ${isSelected ? "scale-100 border-2 border-white/50" : "scale-95 border-2 border-transparent"} ${isSelected ? (value === "ACCEPT" ? "text-white" : "bg-textSub text-white") : "bg-white text-black"} `}
      style={{
        backgroundColor:
          isSelected && value === "ACCEPT" ? themeColor : undefined,
      }}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
};

export default RsvpButton;
