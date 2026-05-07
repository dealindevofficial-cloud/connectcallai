"use client";

import dynamic from "next/dynamic";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/20 bg-slate-950/45">
      <div data-color-mode="dark" className="ccai-md-editor">
        <MDEditor
          value={value}
          onChange={(next) => onChange(next ?? "")}
          preview="live"
          visibleDragbar={false}
          height={320}
          textareaProps={{ placeholder }}
        />
      </div>
    </div>
  );
}
