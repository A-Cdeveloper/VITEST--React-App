const ToastDemo = ({ onClick }: { onClick: () => void }) => {
  return (
    <button className="btn" onClick={onClick}>
      Show Toast
    </button>
  );
};

export default ToastDemo;
