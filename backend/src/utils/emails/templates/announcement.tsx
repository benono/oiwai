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

interface AnnouncementProps {
  eventName: string;
  inviterName: string;
  eventDate: string;
  eventLocation: string;
  eventId: string;
  eventImage: string;
  inviterImage: string;
  announcement: string;
}

export const Announcement = ({
  eventName,
  inviterName,
  eventDate,
  eventLocation,
  eventId,
  eventImage,
  inviterImage,
  announcement,
}: AnnouncementProps) => {
  return (
    <Html>
      <Head>
        <title>【{eventName}】New Message from the host 📣</title>
      </Head>
      <Preview>Check the message from the event host now!</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 px-4 max-w-xl">
            <Heading className="text-2xl font-bold text-gray-800 mb-2">
              Oiwai
            </Heading>
            <Hr />
            <Heading className="text-xl font-bold text-gray-800 mb-6">
              📣 The host has shared an update for {eventName}!
            </Heading>

            <Section>
              <Img
                src={inviterImage}
                alt={inviterName}
                className="w-12 h-12 rounded-full object-cover mb-2 mx-auto"
              />
              <Text className="m-0 text-base font-bold text-gray-800 text-center">
                {inviterName}
              </Text>
              <Text className="m-0 mt-4 mb-8 py-4 px-6 bg-[#F5F5F3] rounded-xl text-base text-gray-700">
                {announcement}
              </Text>
            </Section>

            <Text className="text-base text-gray-700">
              If you have any questions, feel free to reply or check the event
              app.
            </Text>

            <Button
              href={`${URL}/event/${eventId}/announcements`}
              className="block bg-[#FF8549] text-white py-3 px-6 rounded-full hover:opacity-70 text-center text-base mb-2 h-auto"
            >
              View Announcement
            </Button>
            <Text className="text-sm text-red-500 text-center m-0">
              Please note that registration is required to use it.
            </Text>

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
