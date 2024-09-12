import { Text } from "@radix-ui/themes";
import useLanguage from "../hooks/useLanguage";

const Label = ({ labelId }: { labelId: string }) => {
  const { getLabel } = useLanguage();

  let label;

  try {
    label = getLabel(labelId);
  } catch (error: any) {
    label = error.message as string;
  }

  // if (error) return <Text>{error}</Text>;

  return <Text>{label}</Text>;
};

export default Label;
