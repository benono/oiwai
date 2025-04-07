import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

const URL = process.env.BASE_URL;

interface GuestAttendingProps {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventId: string;
  eventImage: string;
}

export const GuestAttending = ({
  eventName,
  eventDate,
  eventLocation,
  eventId = "123",
  eventImage = "test",
}: GuestAttendingProps) => {
  return (
    <Html>
      <Head>
        <title>You&apos;re in! {eventName} details inside</title>
      </Head>
      <Preview>
        Check your event and use the app to enjoy a special event!
      </Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 px-4 max-w-xl">
            <Heading className="text-2xl font-bold text-gray-800 mb-2">
              Oiwai
            </Heading>
            <Hr />
            <Heading className="text-xl font-bold text-gray-800 mb-6">
              Your RSVP is confirmed!
            </Heading>

            <Text className="text-gray-700 mb-0 text-base">
              Thank you for confirming your attendance at {eventName}! 🎉 <br />
              <br /> To make your experience even better, we've got a special
              event app where you can:
            </Text>

            <Section className="bg-gray-50 rounded-lg p-6 mb-6">
              <Text className="text-gray-700 mb-4 text-base">
                ✅ Check event details & schedule
                <br />
                ✅ Receive important announcements
                <br />✅ Share your experience after the event
              </Text>
            </Section>

            <Section>
              <Text className="text-base text-gray-700">
                Click below to access the app and get started:
              </Text>
              <Button
                href={`${URL}/event/${eventId}`}
                className="block bg-[#FF8549] text-white py-3 px-6 rounded-full hover:opacity-70 text-center text-base mb-2 h-auto"
              >
                Enter the Event Group
              </Button>
              <Text className="text-sm text-red-500 text-center m-0">
                Please note that registration is required to use it.
              </Text>
            </Section>

            <Hr className="my-8" />
            <Section>
              <Row>
                <Column>
                  <Img
                    src={eventImage}
                    alt={eventName}
                    className="w-2/5 h-auto object-cover rounded-lg"
                  />
                </Column>
                <Column>
                  <Row className="grid gap-2 pl-4">
                    <Text className="text-base font-bold text-gray-700 m-0 mb-3">
                      {eventName}
                    </Text>
                    <Text className="text-sm m-0 mb-2">🗓️ {eventDate}</Text>
                    <Text className="text-sm m-0">📍 {eventLocation}</Text>
                  </Row>
                </Column>
              </Row>
              <Text className="text-gray-500 text-xs m-0 mt-10">
                ※ Please note, this is a no-reply email.
                <br />※ If you did not request this email, please ignore it.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
