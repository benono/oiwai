import { Button } from "@/components/ui/button";
import { Lato } from "next/font/google";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Footer from "@/components/layouts/Footer";
import hostGroupPic1 from "@/public/images/eventhost_group_image1.png";
import hostGroupPic2 from "@/public/images/eventhost_group_image2.png";
import hostGroupPic3 from "@/public/images/eventhost_group_image3.png";
import hostMainPic from "@/public/images/eventhost_main_image.png";
import hostSubPic1 from "@/public/images/eventhost_sub_image1.png";
import hostSubPic2 from "@/public/images/eventhost_sub_image2.png";
import mainPic from "@/public/images/main_image.png";
import guestMainPic from "@/public/images/participants_main_image.png";
import guestSubPic1 from "@/public/images/participants_sub_image1.png";
import guestSubPic2 from "@/public/images/participants_sub_image2.png";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

const lato = Lato({
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  return (
    <>
      <section className="text-text max-w-md bg-white px-4 pb-20 pt-10 md:mx-auto">
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
          <SignUpButton>
            <Button className="h-auto w-fit rounded-full px-10 py-3 text-base font-bold">
              CREATE EVENT
            </Button>
          </SignUpButton>
          <div className="relative w-full">
            <Image src={mainPic} alt="Oiwai image" />
          </div>
        </section>

        <section className="mt-10">
          <Tabs defaultValue="host">
            <div className="sticky top-[52px] bg-white py-2">
              <TabsList className="border-textBorder h-auto w-full border bg-white p-2">
                <TabsTrigger
                  value="host"
                  className="data-[state=active]:border-accentGreen data-[state=active]:text-accentGreen w-full border border-white data-[state=active]:border data-[state=active]:bg-white data-[state=active]:shadow-none hover:opacity-70"
                >
                  EVENT HOST
                </TabsTrigger>
                <TabsTrigger
                  value="participants"
                  className="data-[state=active]:border-accentGreen data-[state=active]:text-accentGreen w-full border border-white data-[state=active]:border data-[state=active]:bg-white data-[state=active]:shadow-none hover:opacity-70"
                >
                  PARTICIPANTS
                </TabsTrigger>
              </TabsList>
            </div>
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
                <div className="text-text grid gap-6">
                  <h2
                    className={`text-center text-2xl font-bold ${lato.className}`}
                  >
                    Make your event even more special with an exclusive group
                    for participants.
                  </h2>
                  <div className="flex gap-4 overflow-x-scroll px-4 pb-6">
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
              <section className="grid gap-10 pb-20">
                <div className="grid gap-6">
                  <Image src={guestMainPic} alt="For the participants" />
                  <div className="grid gap-2">
                    <h2
                      className={`text-accentGreen text-2xl font-bold ${lato.className}`}
                    >
                      Easily check information, create special memories
                    </h2>
                    <p className="text-text text-base">
                      Keep scattered info in one place and share photos
                      effortlessly.
                    </p>
                  </div>
                </div>
                <div className="text-text grid gap-2 rounded-lg border border-border px-4 py-6">
                  <h3 className={`text-lg font-bold ${lato.className}`}>
                    Check the schedule and necessity
                  </h3>
                  <p className="text-sm">
                    Access host-shared information anytime. Engage with the host
                    on the feed to make the event even more exciting!
                  </p>
                  <Image
                    src={guestSubPic1}
                    alt="Check announcement and necessity."
                  />
                </div>
                <div className="text-text grid gap-2 rounded-lg border border-border px-4 py-6">
                  <h3 className={`text-lg font-bold ${lato.className}`}>
                    Share and view group memories in one place
                  </h3>
                  <p className="text-sm">
                    Easily find photos of your child with AI-powered sorting.
                  </p>
                  <Image
                    src={guestSubPic2}
                    alt="Easy to find your child photos."
                  />
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </section>
        <section className="mt-10 flex justify-between gap-4 text-sm">
          <SignInButton>
            <Button
              variant="outline"
              className="h-auto w-full rounded-full border-2 border-primary bg-white py-3 font-bold text-primary hover:bg-primary hover:text-white"
            >
              Log in
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button className="h-auto w-full rounded-full py-3 font-bold">
              CREATE EVENT
            </Button>
          </SignUpButton>
        </section>
      </section>
      <Footer />
    </>
  );
}
