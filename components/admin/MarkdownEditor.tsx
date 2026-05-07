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
    <div data-color-mode="dark">
      <MDEditor
        className="ccai-md-editor"
        value={value}
        onChange={(next) => onChange(next ?? "")}
        preview="edit"
        visibleDragbar={false}
        height={320}
        textareaProps={{ placeholder }}
      />
    </div>
  );
}
