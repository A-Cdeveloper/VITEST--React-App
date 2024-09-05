// import Onboarding from "../components/Onboarding";

import { Toaster } from "react-hot-toast";
// import SearchBox from "../components/SearchBox";
// import TagList from "../components/TagList";
import ToastDemo from "../components/ToastDemo";

const PlaygroundPage = () => {
  return (
    // <SearchBox
    //   onChange={(text: string) => {
    //     console.log(text);
    //   }}
    // />
    // <TagList />
    <>
      <ToastDemo />
      <Toaster />
    </>
  );
};

export default PlaygroundPage;
