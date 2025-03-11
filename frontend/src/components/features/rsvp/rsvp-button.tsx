import { useThemeStore } from "@/store/use-theme-store";
import { RsvpResponseType } from "@/types/rsvp-response";

type RsvpButtonProps = {
  label: string;
  value: "ACCEPT" | "DECLINE";
  selection: string;
  onClick: (value: RsvpResponseType["status"]) => void;
};

const RsvpButton = ({ label, value, selection, onClick }: RsvpButtonProps) => {
  const { themeColor } = useThemeStore();

  return (
    <button
      type="button"
      className={`flex-1 rounded-lg p-4 font-bold transition-all duration-300 ${
        selection === value
          ? value === "ACCEPT"
            ? "scale-100 transform border-2 border-white/50 text-white"
            : "scale-100 transform border-2 border-white/50 bg-textSub text-white"
          : "scale-95 transform border-2 border-transparent bg-white text-black"
      } box-border`}
      style={{
        backgroundColor:
          selection === value && value === "ACCEPT"
            ? (themeColor ?? undefined)
            : undefined,
      }}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
};

export default RsvpButton;
