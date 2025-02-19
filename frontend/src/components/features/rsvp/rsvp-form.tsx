'use client'

import { useState } from "react";
import RsvpButton from "./rsvp-button";

const RsvpForm = () => {
  const [selection, setSelection] = useState('accept');

  const handleSelect = (value: string) => {
    setSelection(value);
  };

  return (
    <section className="px-4 space-y-2 mt-8">
      <h2 className="font-bold text-lg">RSVP</h2>
      <div className="flex justify-between gap-2 w-full border border-textBorder rounded-lg p-2 bg-white">
        <RsvpButton
          label="Accept"
          value="accept"
          selection={selection}
          onClick={handleSelect}
        />
        <RsvpButton
          label="Decline"
          value="decline"
          selection={selection}
          onClick={handleSelect}
        />
      </div>
    </section>
  );
};

export default RsvpForm;
