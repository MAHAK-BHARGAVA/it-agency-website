"use client";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Eraser,
  Highlighter,
  Image as ImageIcon,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Palette,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Unlink,
} from "lucide-react";

import type { Editor } from "@tiptap/react";

type Props = {
  editor: Editor;
  onImageUpload: () => void;
};

type ToolbarButtonProps = {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({
  title,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={[
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition",
        active
          ? "bg-[#6466e8] text-white"
          : "text-[#45454f] hover:bg-black/5 hover:text-[#6466e8]",
        disabled
          ? "cursor-not-allowed opacity-30 hover:bg-transparent hover:text-[#45454f]"
          : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-6 w-px bg-black/10" />;
}

export default function EditorToolbar({ editor, onImageUpload }: Props) {
  const canUndo = editor.can().chain().focus().undo().run();
  const canRedo = editor.can().chain().focus().redo().run();

  const handleHeadingChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
      return;
    }

    const level = Number(value) as 1 | 2 | 3 | 4;

    editor.chain().focus().toggleHeading({ level }).run();
  };
  const handleLink = () => {
    const previousUrl = editor.getAttributes("link").href;

    const url = window.prompt("Enter URL:", previousUrl || "https://");

    if (url === null) return;

    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    const finalUrl = /^https?:\/\//i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: finalUrl,
        target: "_blank",
        rel: "noopener noreferrer",
      })
      .run();
  };

  const handleTextColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    editor.chain().focus().setColor(event.target.value).run();
  };

  const handleHighlight = (event: React.ChangeEvent<HTMLInputElement>) => {
    editor
      .chain()
      .focus()
      .toggleHighlight({
        color: event.target.value,
      })
      .run();
  };

  return (
    <div className="sticky top-0 z-30 border-b border-black/10 bg-white/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-1 p-2">
        {/* Text style */}
        <select
          aria-label="Text style"
          title="Text style"
          value={
            editor.isActive("heading", { level: 1 })
              ? "1"
              : editor.isActive("heading", { level: 2 })
                ? "2"
                : editor.isActive("heading", { level: 3 })
                  ? "3"
                  : editor.isActive("heading", { level: 4 })
                    ? "4"
                    : "paragraph"
          }
          onChange={handleHeadingChange}
          className="h-9 rounded-lg border border-black/10 bg-white px-2 text-sm font-medium text-[#45454f] outline-none transition hover:border-[#6466e8]/40 focus:border-[#6466e8] focus:ring-2 focus:ring-[#6466e8]/10"
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>

        <Divider />

        {/* Basic formatting */}
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={17} />
        </ToolbarButton>

        <Divider />

        {/* Text color */}
        <label
          title="Text color"
          className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#45454f] transition hover:bg-black/5 hover:text-[#6466e8]"
        >
          <Palette size={17} />

          <input
            type="color"
            aria-label="Text color"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleTextColor}
          />
        </label>

        {/* Highlight */}
        <label
          title="Highlight color"
          className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-[#45454f] transition hover:bg-black/5 hover:text-[#6466e8]"
        >
          <Highlighter size={17} />

          <input
            type="color"
            aria-label="Highlight color"
            defaultValue="#fff59d"
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleHighlight}
          />
        </label>

        <Divider />

        {/* Lists */}
        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Decrease indentation"
          onClick={() => editor.chain().focus().liftListItem("listItem").run()}
        >
          <IndentDecrease size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Increase indentation"
          onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
        >
          <IndentIncrease size={17} />
        </ToolbarButton>

        <Divider />

        {/* Blocks */}
        <ToolbarButton
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Inline code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Horizontal divider"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={17} />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton
          title="Align left"
          active={editor.isActive({
            textAlign: "left",
          })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Align center"
          active={editor.isActive({
            textAlign: "center",
          })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Align right"
          active={editor.isActive({
            textAlign: "right",
          })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Justify"
          active={editor.isActive({
            textAlign: "justify",
          })}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          <AlignJustify size={17} />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton
          title="Add / Edit Link"
          onClick={handleLink}
          active={editor.isActive("link")}
        >
          <LinkIcon size={16} />
        </ToolbarButton>

        <ToolbarButton
          title="Remove link"
          disabled={!editor.isActive("link")}
          onClick={() =>
            editor.chain().focus().extendMarkRange("link").unsetLink().run()
          }
        >
          <Unlink size={17} />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton title="Insert image" onClick={onImageUpload}>
          <ImageIcon size={17} />
        </ToolbarButton>

        <Divider />

        {/* Undo / Redo */}
        <ToolbarButton
          title="Undo"
          disabled={!canUndo}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={17} />
        </ToolbarButton>

        <ToolbarButton
          title="Redo"
          disabled={!canRedo}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={17} />
        </ToolbarButton>

        <Divider />

        {/* Clear formatting */}
        <ToolbarButton
          title="Clear formatting"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          <Eraser size={17} />
        </ToolbarButton>
      </div>
    </div>
  );
}
