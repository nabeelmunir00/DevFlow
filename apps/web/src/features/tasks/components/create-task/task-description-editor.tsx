"use client";

import { useRef } from "react";
import {
  Bold,
  Code2,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  Quote,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionEditorProps {
  value: string;
  onChange: (value: string) => void;

  attachments: File[];
  onAddAttachments: (files: File[]) => void;
  onRemoveAttachment: (index: number) => void;

  onAskAI?: () => void;
}

export function TaskDescriptionEditor({
  value,
  onChange,
  attachments,
  onAddAttachments,
  onRemoveAttachment,
  onAskAI,
}: TaskDescriptionEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    onAddAttachments(Array.from(fileList));
  }

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-md border border-input bg-background transition-ui focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {/* Toolbar */}

        <div className="flex min-h-9 flex-wrap items-center gap-0.5 border-b border-border px-1.5 py-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Bold"
          >
            <Bold className="size-3.5" strokeWidth={1.75} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Italic"
          >
            <Italic className="size-3.5" strokeWidth={1.75} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Add link"
          >
            <Link2 className="size-3.5" strokeWidth={1.75} />
          </Button>

          <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Bullet list"
          >
            <List className="size-3.5" strokeWidth={1.75} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Numbered list"
          >
            <ListOrdered className="size-3.5" strokeWidth={1.75} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Code"
          >
            <Code2 className="size-3.5" strokeWidth={1.75} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Quote"
          >
            <Quote className="size-3.5" strokeWidth={1.75} />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="ml-auto h-7 gap-1.5 px-2 text-xs text-primary"
            onClick={onAskAI}
          >
            <Sparkles className="size-3.5" strokeWidth={1.75} />

            <span className="hidden sm:inline">Ask DevFlow AI</span>
          </Button>
        </div>

        {/* Description */}

        <Textarea
          value={value}
          placeholder="Describe the task, add context, or paste links..."
          className="min-h-24 resize-none rounded-none border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(event) => onChange(event.target.value)}
        />

        {/* Attachment action */}

        <div className="flex items-center border-t border-border px-2 py-1.5">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => {
              handleFiles(event.target.files);

              // Allows selecting the same file again after removal.
              event.currentTarget.value = "";
            }}
          />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 px-2 text-xs text-muted-foreground"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="size-3.5" strokeWidth={1.75} />
            Add attachment
          </Button>
        </div>
      </div>

      {/* Selected files */}

      {attachments.length > 0 ? (
        <div className="space-y-1.5">
          {attachments.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className="flex h-8 items-center gap-2 rounded-md border border-border bg-background px-2.5 text-xs"
            >
              <Paperclip
                className="size-3.5 shrink-0 text-muted-foreground"
                strokeWidth={1.75}
              />

              <span className="min-w-0 flex-1 truncate">{file.name}</span>

              <span className="hidden shrink-0 text-muted-foreground sm:inline">
                {formatFileSize(file.size)}
              </span>

              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label={`Remove ${file.name}`}
                onClick={() => onRemoveAttachment(index)}
              >
                <X className="size-3.5" strokeWidth={1.75} />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
