import { Button } from "@/components/ui/button";
import { Lato } from "next/font/google";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import hostGroupPic1 from "@/public/images/eventhost_group_image1.png";
import hostGroupPic2 from "@/public/images/eventhost_group_image2.png";
import hostGroupPic3 from "@/public/images/eventhost_group_image3.png";
import hostMainPic from "@/public/images/eventhost_main_image.png";
import hostSubPic1 from "@/public/images/eventhost_sub_image1.png";
import hostSubPic2 from "@/public/images/eventhost_sub_image2.png";
import linkedInLogo from "@/public/images/LI-In-Bug.png";
import mainPic from "@/public/images/main_image.png";
import guestMainPic from "@/public/images/participants_main_image.png";
import guestSubPic1 from "@/public/images/participants_sub_image1.png";
import guestSubPic2 from "@/public/images/participants_sub_image2.png";
import Link from "next/link";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  return (
    <div>
      <header className="sticky top-0 z-50 bg-white px-4 py-3">
        <div className="flex items-start justify-between gap-2.5">
          <h1 className="text-text text-xl font-bold">Oiwai</h1>
          <Button className="h-auto rounded-full px-4 py-1.5 text-xs font-bold">
            CREATE EVENT
          </Button>
        </div>
      </header>
      <section className="text-text bg-white px-4">
        <section className="grid justify-items-center gap-6 text-center">
          <h1 className={`text-[32px] font-bold ${lato.className}`}>
            Celebrate & Connect <br />
            with Ease!
          </h1>
          <p className="text-sm">
            Effortlessly plan and manage your child&apos;s birthday or special
            event. Create personalized invitations and share them with friends,
            all in one place!
          </p>
          <Button className="h-auto w-fit rounded-full px-10 py-3 text-base font-bold">
            CREATE EVENT
          </Button>
          <div className="relative h-[300px] w-full">
            <Image src={mainPic} alt="Oiwai image" />
          </div>
        </section>

        <section className="mt-10">
          <Tabs defaultValue="host">
            <TabsList className="w-full">
              <TabsTrigger value="host" className="w-full">
                EVENT HOST
              </TabsTrigger>
              <TabsTrigger value="participants" className="w-full">
                PARTICIPANTS
              </TabsTrigger>
            </TabsList>
            <TabsContent value="host">
              <section className="grid gap-10">
                <div className="grid gap-6">
                  <Image src={hostMainPic} alt="For the event host" />
                  <div className="grid gap-2">
                    <h2
                      className={`text-accentGreen text-2xl font-bold ${lato.className}`}
                    >
                      Create invitations effortlessly
                    </h2>
                    <p className="text-text text-base">
                      Easily create event invitations with a few tap.
                    </p>
                  </div>
                  <div className="text-text grid gap-2 rounded-lg border border-border px-4 py-6">
                    <h3 className={`text-lg font-bold ${lato.className}`}>
                      Get AI-generated venue suggestions
                    </h3>
                    <p className="text-sm">
                      Find recommended spots on the map based on activities.
                    </p>
                    <Image
                      src={hostSubPic1}
                      alt="AI gives recommendations for good places."
                      className="w-full"
                    />
                  </div>
                  <div className="text-text grid gap-2 rounded-lg border border-border px-4 py-6">
                    <h3 className={`text-lg font-bold ${lato.className}`}>
                      Various invitation theme
                    </h3>
                    <p className="text-sm">
                      Find recommended spots on the map based on activities.
                    </p>
                    <Image
                      src={hostSubPic2}
                      alt="Various invitation theme"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="text-text grid gap-6 pb-20">
                  <h2
                    className={`text-center text-2xl font-bold ${lato.className}`}
                  >
                    Make your event even more special with an exclusive group
                    for participants.
                  </h2>
                  <div className="flex gap-4 overflow-x-scroll px-4">
                    <div className="grid min-w-[280px] gap-6">
                      <Image
                        src={hostGroupPic1}
                        alt="AI suggests your schedule"
                      />
                      <div className="grid gap-2">
                        <h3 className={`text-lg font-bold ${lato.className}`}>
                          AI suggests your schedule
                        </h3>
                        <p className="text-sm">
                          Just enter a few details, and your timeline is ready!
                        </p>
                      </div>
                    </div>
                    <div className="grid min-w-[280px] gap-6">
                      <Image src={hostGroupPic2} alt="Manage necessity" />
                      <div className="grid gap-2">
                        <h3 className={`text-lg font-bold ${lato.className}`}>
                          Manage necessity
                        </h3>
                        <p className="text-sm">
                          Share a list of items you want participants to bring.
                        </p>
                      </div>
                    </div>
                    <div className="grid min-w-[280px] gap-6">
                      <Image src={hostGroupPic3} alt="Announcements" />
                      <div className="grid gap-2">
                        <h3 className={`text-lg font-bold ${lato.className}`}>
                          Announcements
                        </h3>
                        <p className="text-sm">
                          Send updates to participants through chat and collect
                          their responses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </TabsContent>
            <TabsContent value="participants">
              <div>
                <Image src={guestMainPic} alt="For the participants" />
                <h2>Easily check information, create special memories</h2>
                <p>
                  Keep scattered info in one place and share photos
                  effortlessly.
                </p>
              </div>
              <div>
                <div>
                  <h3>Check the schedule and necessity</h3>
                  <p>
                    Access host-shared information anytime. Engage with the host
                    on the feed to make the event even more exciting!
                  </p>
                  <Image
                    src={guestSubPic1}
                    alt="Check announcement and necessity."
                  />
                </div>
                <div>
                  <h3>Share and view group memories in one place</h3>
                  <p>
                    Easily find photos of your child with AI-powered sorting.
                  </p>
                  <Image
                    src={guestSubPic2}
                    alt="Easy to find your child photos."
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </section>
      <footer className="text-text grid gap-4 px-4 py-8">
        <div className="flex flex-col gap-6">
          <h1 className="text-xl font-bold">Oiwai</h1>
          <div className="text-textSub grid gap-2 text-xs">
            <Link href="/">Privacy policy</Link>
            <Link href="/">Terms and Conditions</Link>
          </div>
        </div>
        <div className="grid gap-2">
          <p className="text-text text-xs">Created by</p>
          <div className="flex items-center gap-4">
            <Link
              href="https://www.linkedin.com/in/risa-yamamoto-profile/"
              className="flex items-center gap-1"
            >
              <Image src={linkedInLogo} alt="LinkedIn" width={20} height={20} />
              <p className="text-text text-sm">Risa</p>
            </Link>
            <Link
              href="https://www.linkedin.com/in/ben-ono-profile/"
              className="flex items-center gap-1"
            >
              <Image src={linkedInLogo} alt="LinkedIn" width={20} height={20} />
              <p className="text-text text-sm">Ben</p>
            </Link>
            <Link
              href="http://linkedin.com/in/nao-g-55822a2bb"
              className="flex items-center gap-1"
            >
              <Image src={linkedInLogo} alt="LinkedIn" width={20} height={20} />
              <p className="text-text text-sm">Nao</p>
            </Link>
            <Link
              href="https://www.linkedin.com/in/haruka-kakiuchi-profile/"
              className="flex items-center gap-1"
            >
              <Image src={linkedInLogo} alt="LinkedIn" width={20} height={20} />
              <p className="text-text text-sm">Haruka</p>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
