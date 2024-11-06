import { CheckIcon } from "lucide-react";

type ItemListProps = {
    text: string;
}
export default function ItemList({ text }: ItemListProps) {
  return (
    <li className="flex gap-1.5 items-center text-left">
      <CheckIcon className="size-6 shrink-0 text-green-600" />
      {text}
    </li>
  );
}
