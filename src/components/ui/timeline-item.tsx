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
    <div className="relative pl-10 md:pl-12">
      {/* Timeline dot */}
      <div className="absolute left-[13px] top-1.5 w-4 h-4 rounded-full bg-[#fca311] border-2 border-white shadow-sm z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
        <h3 className={`font-bold text-[#0a192f] ${isEducation ? 'text-lg' : 'text-xl'}`}>
          {title}
        </h3>
        <span className={`${isEducation ? 'bg-[#fca311]/20' : 'bg-[#0a192f]/5'} text-[#0a192f] px-3 py-1 rounded-full text-xs font-bold`}>
          {period}
        </span>
      </div>

      {/* Company */}
      <h4 className="text-md font-serif italic text-gray-500 mb-3">{company}</h4>

      {/* Description */}
      {description.length > 0 && (
        <div className="text-gray-600 text-sm leading-relaxed mb-3 space-y-1">
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

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
