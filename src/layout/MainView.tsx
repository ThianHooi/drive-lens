import clsx from "clsx";
import React from "react";
import { type ChildrenT } from "~/types/Children";

type Props = {
  className?: string | undefined | null;
} & ChildrenT;

const MainView: React.FC<Props> = ({ className = "", children }: Props) => {
  const styles = {
    wrapper: "z-0 mx-auto md:mt-[var(--header-height)]",
    main: "z-0 flex min-h-screen max-w-screen-xl flex-1 flex-col justify-center items-center mx-auto bg-background md:rounded-lg px-4 xl:px-0 py-8",
  };

  return (
    // <div className={styles.wrapper}>
      <main className={clsx(styles.main, className)}>{children}</main>
    // </div>
  );
};

export default MainView;
