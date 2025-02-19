import Image from "next/image";

const EventInformation = () => {
  return (
    <section className="w-full space-y-4">
      <Image
        src="/sample-thumbnail.png"
        width={200}
        height={200}
        alt="thumbnail"
        className="w-full"
      />
      <div className="space-y-2 px-4">
        <h1 className="text-2xl font-bold">Emily’s Birthday Party🚀</h1>
        <div>
          <p className="font-semibold">Wednesday, February 10</p>
          <p className="text-sm font-medium">0:00 PM - 3:00 PM</p>
        </div>
      </div>
    </section>
  );
};

export default EventInformation;
