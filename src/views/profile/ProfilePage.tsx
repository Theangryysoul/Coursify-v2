"use client";

import { useAuthStore } from "@/store/auth.store";
import { motion } from "framer-motion";

import { EditProfileDialog } from "@/components/profile/EditProfileDialog";
import { ChangeAvatarDialog } from "./ChangeAvatarDialog";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <motion.div
      className="mx-auto max-w-6xl space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold sm:text-4xl text-foreground">
          My Profile
        </h1>
      </motion.div>

      <motion.div
        className="lp-clay-card lp-clay-white rounded-3xl p-6 backdrop-blur-xl sm:p-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex flex-col items-center text-center">
          <img
            src={
              // The API serialises a missing avatar as an empty string, so a
              // nullish check is not enough here.
              user?.avatar?.url ||
              "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user?.name ?? "U")
            }
            alt={user?.name}
            className="h-28 w-28 rounded-full border-4 border-[var(--lp-coral)]/20 object-cover sm:h-36 sm:w-36"
          />

          <h2 className="mt-6 text-2xl font-bold sm:text-3xl text-foreground">
            {user?.name}
          </h2>

          <p className="mt-2 text-muted-foreground">
            {user?.email}
          </p>

          {user?.bio && (
            <p className="mt-3 max-w-xl text-center text-muted-foreground">
              {user.bio}
            </p>
          )}

          <div className="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row sm:justify-center">
            <EditProfileDialog />
            <ChangeAvatarDialog />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="lp-clay-card lp-clay-white rounded-3xl p-6 backdrop-blur-xl sm:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="mb-6 text-2xl font-semibold text-foreground">
          Account Information
        </h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <InfoItem
            label="Full Name"
            value={user?.name ?? "-"}
          />

          <InfoItem
            label="Email"
            value={user?.email ?? "-"}
          />

          <InfoItem
            label="Joined"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-"
            }
          />

          <InfoItem
            label="Account Status"
            value="Active"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <motion.div
      className="lp-clay-card lp-clay-white min-w-0 p-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 truncate text-lg font-semibold text-foreground">
        {value}
      </p>
    </motion.div>
  );
}