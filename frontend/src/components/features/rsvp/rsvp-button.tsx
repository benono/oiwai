type RsvpButtonType = {
  label: string;
  value: string;
  selection: string;
  onClick: (value: string) => void;
};

const RsvpButton = ({ label, value, selection, onClick }: RsvpButtonType) => {
  return (
    <button
      type="button"
      className={`p-4 flex-1 rounded-lg font-bold transition-all duration-300
        ${selection === value
          ? value === 'accept'
            ? 'bg-primary text-white transform scale-100 border-2 border-white/50'
            : 'bg-textSub text-white transform scale-100 border-2 border-white/50'
          : 'bg-white text-black transform scale-95 border-2 border-transparent'}
        box-border`}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
};

export default RsvpButton;
