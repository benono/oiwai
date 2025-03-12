import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

const URL = process.env.BASE_URL;

interface AfterEventProps {
  eventName: string;
  eventId: string;
}

export const AfterEvent = ({ eventName, eventId }: AfterEventProps) => {
  return (
    <Html>
      <Head>
        <title>✨ Thanks for joining {eventName}! ✨</title>
      </Head>
      <Preview>Leave a review and share your experience with the host!</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 px-4 max-w-xl">
            <Heading className="text-2xl font-bold text-gray-800 mb-2">
              Oiwai
            </Heading>
            <Hr />
            <Heading className="text-xl font-bold text-gray-800 mb-6">
              We loved having you at {eventName}!🎉
            </Heading>

            <Text className="text-base text-gray-700">
              We hope you had a great time!
            </Text>
            <Text className="text-base text-gray-700">
              We'd love to hear what you thought!
              <br />
              Share your experience and let others know how it went.
            </Text>

            <Section>
              <Button
                href={`${URL}/event/${eventId}`}
                className="block bg-[#FF8549] text-white py-3 px-6 rounded-full hover:opacity-70 text-center text-base mt-8 mb-2 h-auto"
              >
                Share your experience
              </Button>
              <Text className="text-sm text-gray-500 text-center m-0">
                You need to log in Oiwai app to check the event information.
              </Text>
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
