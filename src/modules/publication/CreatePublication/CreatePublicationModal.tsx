import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false },
);

const CreatePublicationModal = () => {
  const [value, setValue] = useState<string | undefined>("**Hello world!!!**");

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Create Publication</DialogTitle>
        <DialogDescription>
          Create a new publication to share your thoughts with the world.
        </DialogDescription>
      </DialogHeader>
      <div>
        <MDEditor value={value} onChange={setValue} />
      </div>
    </DialogContent>
  );
};

export default CreatePublicationModal;
