"use client";

import { useTransition } from "react";
import { deletePost, deleteThread, toggleThreadFlag } from "./actions";

function ConfirmButton({ label, onConfirm, className = "" }: { label: string; onConfirm: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        const b = e.currentTarget;
        if (b.dataset.armed !== "1") {
          b.dataset.armed = "1";
          b.textContent = "Säker?";
          setTimeout(() => {
            b.dataset.armed = "";
            b.textContent = label;
          }, 3000);
          return;
        }
        onConfirm();
      }}
      className={className}
    >
      {label}
    </button>
  );
}

export function DeletePostButton({ id }: { id: number }) {
  const [pending, start] = useTransition();
  return (
    <ConfirmButton
      label="Ta bort"
      onConfirm={() => start(() => deletePost(id))}
      className={`text-xs text-mute transition hover:text-loss ${pending ? "opacity-50" : ""}`}
    />
  );
}

export function ThreadAdminBar({ id, pinned, locked }: { id: number; pinned: boolean; locked: boolean }) {
  const [pending, start] = useTransition();
  const btn = "rounded-full border border-line px-3 py-1.5 text-xs transition hover:bg-white/5";
  return (
    <div className={`flex flex-wrap gap-2 ${pending ? "opacity-50" : ""}`}>
      <button className={btn} onClick={() => start(() => toggleThreadFlag(id, "pinned"))}>{pinned ? "Lossa" : "Fäst överst"}</button>
      <button className={btn} onClick={() => start(() => toggleThreadFlag(id, "locked"))}>{locked ? "Lås upp" : "Lås tråden"}</button>
      <ConfirmButton label="Ta bort tråden" onConfirm={() => start(() => deleteThread(id))} className={`${btn} border-loss/30 text-loss hover:bg-loss/10`} />
    </div>
  );
}
