type EmptyStateProps = {
  text: string;
};

export function EmptyState({ text }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}