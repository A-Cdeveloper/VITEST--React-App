// import Onboarding from "../components/Onboarding";

//import toast, { Toaster } from "react-hot-toast";
// import SearchBox from "../components/SearchBox";
// import TagList from "../components/TagList";
// import ToastDemo from "../components/ToastDemo";
import OrderStatusSelector from "../components/OrderStatusSelector";

const PlaygroundPage = () => {
  return (
    // <SearchBox
    //   onChange={(text: string) => {
    //     console.log(text);
    //   }}
    // />
    // <TagList />
    // <>
    //   <ToastDemo onClick={() => toast.success("Success")} />
    //   <Toaster />
    // </>
    <OrderStatusSelector onChange={console.log} />
  );
};

export default PlaygroundPage;
