import HeaderView from "./HeaderView";
import { type ChildrenT } from "~/types/Children";
import MainView from "./MainView";

type Props = ChildrenT;

const MainLayout: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="bg-background">
      <HeaderView />
      <MainView>{children}</MainView>
    </div>
  );
};

export default MainLayout;
