"use client";

import { ResponseType } from "@/types/response";
import { useState } from "react";
import GuestInformationForm from "./guest-information-form";
import RsvpButton from "./rsvp-button";

const RsvpForm = () => {
  const [selection, setSelection] = useState<ResponseType["status"]>("ACCEPT");

  const handleSelect = (value: ResponseType["status"]) => {
    setSelection(value);
  };

  return (
    <div className="mt-8 space-y-2 px-4">
      <h2 className="text-lg font-bold">RSVP</h2>
      <div className="flex w-full justify-between gap-2 rounded-lg border border-textBorder bg-white p-2">
        <RsvpButton
          label="Accept"
          value="ACCEPT"
          selection={selection}
          onClick={handleSelect}
        />
        <RsvpButton
          label="Decline"
          value="DECLINE"
          selection={selection}
          onClick={handleSelect}
        />
      </div>
      <GuestInformationForm selection={selection} />
    </div>
  );
};

export default RsvpForm;
