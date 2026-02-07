interface TimelineItemProps {
  title: string;
  company: string;
  period: string;
  description: string[];
  tags?: string[];
  isEducation?: boolean;
}

export function TimelineItem({
  title,
  company,
  period,
  description,
  tags = [],
  isEducation = false,
}: TimelineItemProps) {
  return (
    <div className="relative pl-10 md:pl-12 group">
      {/* Timeline dot with pulse on hover */}
      <div 
        className="
          absolute left-[13px] top-1.5 w-4 h-4 rounded-full 
          bg-[var(--color-accent)] border-2 border-white shadow-sm z-10
          group-hover:scale-110 group-hover:shadow-[0_0_12px_rgba(252,163,17,0.5)]
          transition-all duration-300
        " 
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
        <h3 className={`font-bold text-[var(--color-primary)] ${isEducation ? 'text-lg' : 'text-xl'}`}>
          {title}
        </h3>
        <span 
          className={`
            ${isEducation ? 'bg-[var(--color-accent)]/20' : 'bg-[var(--color-primary)]/5'} 
            text-[var(--color-primary)] px-3 py-1 rounded-full text-xs font-bold
            transition-colors duration-200
          `}
        >
          {period}
        </span>
      </div>

      {/* Company */}
      <h4 className="text-md italic text-[var(--color-muted)] mb-3">{company}</h4>

      {/* Description */}
      {description.length > 0 && (
        <div className="text-[var(--color-foreground)]/75 text-sm leading-relaxed mb-3 space-y-1">
          {isEducation ? (
            <p>{description[0]}</p>
          ) : (
            <ul className="list-disc list-outside ml-4 space-y-1">
              {description.slice(0, 3).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Tags with hover effect */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="
                text-xs text-[var(--color-muted)] 
                border border-[var(--color-border)] 
                px-2 py-0.5 rounded
                hover:border-[var(--color-accent)]/50 hover:text-[var(--color-accent)]
                transition-colors duration-200
              "
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
