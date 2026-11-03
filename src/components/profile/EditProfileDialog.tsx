"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useAuthStore } from "@/store/auth.store";
import { useUpdateProfile } from "@/hooks/user/useUpdateProfile";

export function EditProfileDialog() {
  const user = useAuthStore((state) => state.user);

  const updateProfile = useUpdateProfile();

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  // Seed the fields from the current profile each time the dialog opens,
  // instead of syncing them in an effect on every user change.
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setName(user?.name ?? "");
      setBio(user?.bio ?? "");
    }

    setOpen(nextOpen);
  };

  const handleSave = () => {
    updateProfile.mutate(
      { name, bio },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="lp-clay-btn lp-clay-btn-secondary w-40 h-10 rounded-xl px-6 text-base font-medium"
        >
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="lp-clay-card lp-clay-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">Edit Profile</DialogTitle>
        </DialogHeader>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <Input
            variant="clay"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            variant="clay"
            placeholder="Tell us about yourself..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="min-h-28 rounded-xl text-base"
          />

          <Button
            type="submit"
            size="lg"
            className="lp-clay-btn lp-clay-btn-primary w-full h-10 rounded-xl px-6 text-base font-medium"
            disabled={updateProfile.isPending}
          >
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}