import clsx from "clsx";
import React from "react";
import { type ChildrenT } from "~/types/Children";

type Props = {
  className?: string | undefined | null;
} & ChildrenT;

const MainView: React.FC<Props> = ({ className = "", children }: Props) => {
  const styles = {
    wrapper: "z-0 mx-auto md:mt-[var(--header-height)]",
    main: "z-0 flex min-h-screen w-full flex-1 flex-col bg-background md:rounded-lg",
  };

  return (
    // <div className={styles.wrapper}>
      <main className={clsx(styles.main, className)}>{children}</main>
    // </div>
  );
};

export default MainView;
