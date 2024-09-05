// import Onboarding from "../components/Onboarding";

import toast, { Toaster } from "react-hot-toast";
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
      <ToastDemo onClick={() => toast.success("Success")} />
      <Toaster />
    </>
  );
};

export default PlaygroundPage;
