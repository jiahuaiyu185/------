export default function Formula({ text, note }: { text: string; note?: string }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-center font-mono text-base leading-relaxed text-slate-800">
        {text}
      </div>
      {note && <div className="mt-1 text-center text-xs text-slate-500">{note}</div>}
    </div>
  )
}
