import { useState } from "react";
import CategoryList from '../CategoryList';

export default function CategoryListExample() {
  const [selected, setSelected] = useState("1");
  
  return (
    <div className="p-8 max-w-md">
      <CategoryList selectedId={selected} onSelect={setSelected} />
    </div>
  );
}
