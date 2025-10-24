import { useState } from "react";
import AuthModal from '../AuthModal';
import { Button } from "@/components/ui/button";

export default function AuthModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Open Auth Modal</Button>
      <AuthModal open={open} onOpenChange={setOpen} />
    </div>
  );
}
