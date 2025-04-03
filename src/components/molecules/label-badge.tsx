interface LabelBadgeProps {
  label: {
    name: string;
    color: string;
  };
  onRemove?: () => void;
  className?: string;
  onClick?: () => void;
}

export function LabelBadge({
  label,
  onRemove,
  className,
  onClick,
}: LabelBadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${className}`}
      style={{
        backgroundColor: `${label.color}20`,
        borderColor: label.color,
        color: label.color,
      }}
      onClick={onClick}
    >
      {label.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 -mr-0.5 hover:opacity-75"
        >
          ×
        </button>
      )}
    </div>
  );
}
