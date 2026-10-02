"use client";

import { useEffect, useRef, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Image as ImageIcon,
  Trash2,
  Type,
  Upload,
} from "lucide-react";

import EditorToolbar from "./EditorToolbar";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

/*
 * Extend Tiptap's Image node with an alignment attribute.
 *
 * This lets us store alignment together with the image
 * instead of relying on temporary editor-only state.
 */
const AlignedImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      align: {
        default: "left",

        parseHTML: (element) => {
          return element.getAttribute("data-align") || "left";
        },

        renderHTML: (attributes) => {
          return {
            "data-align": attributes.align || "left",
          };
        },
      },
    };
  },
});
function normalizeInitialContent(value: string) {
  if (!value?.trim()) {
    return "<p></p>";
  }

  // Already HTML.
  if (/<[a-z][\s\S]*>/i.test(value)) {
    return value;
  }

  // Convert old plain-text blog content into paragraphs.
  return value
    .split(/\n\s*\n/)
    .map((paragraph) => {
      const escaped = paragraph
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");

      return `<p>${escaped}</p>`;
    })
    .join("");
}

export default function RichTextEditor({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const replaceImageInputRef = useRef<HTMLInputElement>(null);

  const [imageSelected, setImageSelected] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },

        link: {
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
        },
      }),

      TextStyle,

      Color.configure({
        types: ["textStyle"],
      }),

      Highlight.configure({
        multicolor: true,
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Placeholder.configure({
        placeholder: "Start writing your article...",
      }),

      AlignedImage.configure({
        inline: false,
        allowBase64: false,

        resize: {
          enabled: true,

          directions: [
            "top",
            "right",
            "bottom",
            "left",
            "top-right",
            "top-left",
            "bottom-right",
            "bottom-left",
          ],

          minWidth: 120,
          minHeight: 80,

          alwaysPreserveAspectRatio: true,
        },
      }),
    ],

    content: normalizeInitialContent(value),

    editorProps: {
      attributes: {
        class:
          "tiptap-blog-editor min-h-[500px] w-full px-5 py-5 text-[15px] leading-7 text-[#1b1b23] outline-none",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  /*
   * Track whether the currently selected node is an image.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const updateImageSelection = () => {
      setImageSelected(editor.isActive("image"));
    };

    updateImageSelection();

    editor.on("selectionUpdate", updateImageSelection);

    editor.on("transaction", updateImageSelection);

    return () => {
      editor.off("selectionUpdate", updateImageSelection);

      editor.off("transaction", updateImageSelection);
    };
  }, [editor]);

  /*
   * Keep editor content synchronized with
   * the form value.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const nextContent = normalizeInitialContent(value);

    if (editor.getHTML() !== nextContent) {
      editor.commands.setContent(nextContent, {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  /*
   * Insert a brand-new image.
   */
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  /*
   * Upload image to Cloudinary.
   */
  const uploadImage = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please select an image file.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Image size must be 5MB or less.");
    }

    const formData = new FormData();

    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      throw new Error(data.error || "Image upload failed.");
    }

    return data.secure_url as string;
  };

  /*
   * Insert new image after upload.
   */
  const handleImageSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    // Allow selecting the same image again.
    event.target.value = "";

    if (!file || !editor) {
      return;
    }

    try {
      const imageUrl = await uploadImage(file);

      const defaultAlt = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ");

      const altText = window.prompt("Enter image alt text:", defaultAlt) || "";

      editor
        .chain()
        .focus()
        .setImage({
          src: imageUrl,
          alt: altText,
          title: altText,
        })
        .run();
    } catch (error) {
      console.error("Inline image upload error:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to upload image. Please try again.",
      );
    }
  };

  /*
   * Get the currently selected image attributes.
   */
  const getSelectedImageAttributes = () => {
    if (!editor) {
      return null;
    }

    if (!editor.isActive("image")) {
      return null;
    }

    return editor.getAttributes("image");
  };

  /*
   * Change image alignment.
   */
  const setImageAlignment = (align: "left" | "center" | "right") => {
    if (!editor) return;

    if (!editor.isActive("image")) {
      return;
    }

    editor
      .chain()
      .focus()
      .updateAttributes("image", {
        align,
      })
      .run();
  };

  /*
   * Edit image alt text.
   */
  const editImageAltText = () => {
    if (!editor || !imageSelected) {
      return;
    }

    const attributes = getSelectedImageAttributes();

    if (!attributes) {
      return;
    }

    const currentAlt = attributes.alt || "";

    const altText = window.prompt("Edit image alt text:", currentAlt);

    if (altText === null) {
      return;
    }

    editor
      .chain()
      .focus()
      .updateAttributes("image", {
        alt: altText.trim(),
        title: altText.trim(),
      })
      .run();
  };

  /*
   * Remove selected image.
   */
  const deleteImage = () => {
    if (!editor || !imageSelected) {
      return;
    }

    editor.chain().focus().deleteSelection().run();
  };

  /*
   * Open replace-image picker.
   */
  const handleReplaceImage = () => {
    replaceImageInputRef.current?.click();
  };

  /*
   * Upload replacement image and update
   * the currently selected image node.
   */
  const handleReplaceImageSelected = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file || !editor) {
      return;
    }

    try {
      const imageUrl = await uploadImage(file);

      const attributes = getSelectedImageAttributes();

      const currentAlt = attributes?.alt || "";

      const useNewAlt = window.confirm(
        "Do you want to update the image alt text?",
      );

      let altText = currentAlt;

      if (useNewAlt) {
        const enteredAlt = window.prompt("Enter image alt text:", currentAlt);

        if (enteredAlt !== null) {
          altText = enteredAlt.trim();
        }
      }

      editor
        .chain()
        .focus()
        .updateAttributes("image", {
          src: imageUrl,
          alt: altText,
          title: altText,
        })
        .run();
    } catch (error) {
      console.error("Image replacement error:", error);

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to replace image. Please try again.",
      );
    }
  };

  if (!editor) {
    return (
      <div className="min-h-[500px] animate-pulse rounded-xl bg-black/[0.03]" />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />

      <div className="relative">
        <EditorContent editor={editor} />

        {imageSelected && (
          <div className="flex flex-wrap items-center gap-1 border-t border-black/10 bg-[#fafaf7] px-3 py-2">
            <span className="mr-2 flex items-center gap-1.5 text-xs font-semibold text-black/50">
              <ImageIcon size={14} />
              Image
            </span>

            <div className="h-5 w-px bg-black/10" />

            {/* Alignment */}
            <button
              type="button"
              title="Align image left"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setImageAlignment("left")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/60 transition hover:bg-black/5 hover:text-[#6466e8]"
            >
              <AlignLeft size={15} />
            </button>

            <button
              type="button"
              title="Center image"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setImageAlignment("center")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/60 transition hover:bg-black/5 hover:text-[#6466e8]"
            >
              <AlignCenter size={15} />
            </button>

            <button
              type="button"
              title="Align image right"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setImageAlignment("right")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-black/60 transition hover:bg-black/5 hover:text-[#6466e8]"
            >
              <AlignRight size={15} />
            </button>

            <div className="mx-1 h-5 w-px bg-black/10" />

            {/* Alt text */}
            <button
              type="button"
              title="Edit alt text"
              onMouseDown={(event) => event.preventDefault()}
              onClick={editImageAltText}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-black/60 transition hover:bg-black/5 hover:text-[#6466e8]"
            >
              <Type size={14} />
              Alt text
            </button>

            {/* Replace */}
            <button
              type="button"
              title="Replace image"
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleReplaceImage}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-black/60 transition hover:bg-black/5 hover:text-[#6466e8]"
            >
              <Upload size={14} />
              Replace
            </button>

            {/* Delete */}
            <button
              type="button"
              title="Delete image"
              onMouseDown={(event) => event.preventDefault()}
              onClick={deleteImage}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* New image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelected}
      />

      {/* Replace image upload */}
      <input
        ref={replaceImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleReplaceImageSelected}
      />

      <div className="border-t border-black/10 bg-[#fafaf7] px-4 py-2">
        <p className="text-xs text-black/35">
          Tip: Use Ctrl/Cmd + B for bold, Ctrl/Cmd + I for italic, Ctrl/Cmd + U
          for underline and Ctrl/Cmd + Z to undo.
        </p>
      </div>
    </div>
  );
}
