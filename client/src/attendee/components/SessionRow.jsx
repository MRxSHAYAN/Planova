import { Bookmark } from "lucide-react";
import Badge from "./Badge";

/**
 * SessionRow — schedule agenda item.
 */
export default function SessionRow({ session, onToggleSave, compact = false }) {
  return (
    <div className="flex gap-4 py-3.5 border-b border-[#F1F5F9] last:border-0">
      {/* Time */}
      <div className="shrink-0 w-[72px] text-right">
        <span className="text-[12px] font-semibold text-[#3478F6]">{session.timeStart}</span>
        <span className="block text-[11px] text-[#7A8AA5]">–{session.timeEnd}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-[13.5px] font-semibold text-[#09152E] leading-snug mb-1 line-clamp-2">
              {session.title}
            </h4>
            <p className="text-[12px] text-[#3E506D] mb-1.5">
              {session.speaker}
              {session.speakerRole && (
                <span className="text-[#7A8AA5]"> · {session.speakerRole}</span>
              )}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge label={session.category} variant="category" />
              {!compact && (
                <span className="text-[11px] text-[#7A8AA5]">📍 {session.room}</span>
              )}
            </div>
          </div>
          <button
            onClick={() => onToggleSave?.(session.id)}
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#F5F7FA] transition-colors"
            aria-label={session.saved ? "Remove from saved" : "Save session"}
          >
            <Bookmark
              size={13}
              className={session.saved ? "text-[#3478F6] fill-[#3478F6]" : "text-[#7A8AA5]"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
