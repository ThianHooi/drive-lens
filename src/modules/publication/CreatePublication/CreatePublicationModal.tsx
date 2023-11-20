/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ExternalLink } from "lucide-react";
import { LocalPublicationType } from "../enum";
import * as commands from "@uiw/react-md-editor/commands";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false },
);

type CreatePublicationModalProps = {
  publicationType: LocalPublicationType;
  createPublicationHandler: (content: string) => void;
};

const DEFAULT_CONTENT = `**Hello world!!!**`;

const ModalContent = {
  [LocalPublicationType.TEXT]: {
    title: "Post something...",
    description: "Share your thoughts with the world.",
  },
  [LocalPublicationType.DRIVE]: {
    title: "Share a drive...",
    description: "Share your drive with the world.",
  },
  [LocalPublicationType.COMMENT]: {
    title: "Comment on this post...",
    description: "Share your comment.",
  },
};

const CreatePublicationModal = ({
  createPublicationHandler,
  publicationType,
}: CreatePublicationModalProps) => {
  const [value, setValue] = useState<string | undefined>(DEFAULT_CONTENT);

  const onPostClick = () => {
    if (!value) {
      return;
    }

    createPublicationHandler(value);
    setValue(DEFAULT_CONTENT);
  };

  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>{ModalContent[publicationType].title}</DialogTitle>
        <DialogDescription>
          {ModalContent[publicationType].description}
        </DialogDescription>
      </DialogHeader>
      <div>
        <MDEditor
          data-color-mode="light"
          value={value}
          onChange={setValue}
          commands={[
            commands.bold,
            commands.title,
            commands.italic,
            commands.divider,
            commands.fullscreen,
            commands.divider,
            commands.code,
            commands.divider,
            commands.link,
            commands.divider,
            commands.quote,
            commands.unorderedListCommand,
            commands.orderedListCommand,
            commands.checkedListCommand,
            commands.strikethrough,
            commands.quote,
          ]}
        />
        <DialogDescription className="italic">
          Markdown is supported.{" "}
          <a
            className="underline"
            href="https://www.markdownguide.org/"
            target="_blank"
          >
            Know more <ExternalLink className="inline-block h-3 w-3" />
          </a>
        </DialogDescription>
      </div>

      <DialogFooter className="flex flex-row items-center justify-between">
        {publicationType === LocalPublicationType.DRIVE && (
          <p className=" italic text-slate-500">
            Currently, the data for driving journey is generated randomly.
          </p>
        )}
        <Button
          disabled={!value}
          onClick={onPostClick}
          variant="default"
          title="Post Now"
          aria-label="Post Now"
        >
          Post Now
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreatePublicationModal;
