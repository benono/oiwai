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

interface BaseReminderProps {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventId: string;
  eventImage: string;
  reminderDate: string;
  message?: string;
}

export const BaseReminder = ({
  eventName,
  eventDate,
  eventLocation,
  eventId,
  eventImage,
  reminderDate,
  message,
}: BaseReminderProps) => {
  return (
    <Html>
      <Head>
        <title>
          Reminder for {eventName}! ({reminderDate} before)
        </title>
      </Head>
      <Preview>
        {reminderDate === "1 day"
          ? `Just one more day until {eventName}! Are you ready? 🥳`
          : `Can't wait to see you at ${eventName} today!`}
      </Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-5 px-4 max-w-xl">
            <Heading className="text-2xl font-bold text-gray-800 mb-2">
              Oiwai
            </Heading>
            <Hr />
            <Heading className="text-xl font-bold text-gray-800 mb-6">
              {eventName} is{" "}
              {reminderDate === "1 day" ? "starting tomorrow" : "today"}! 🎉
            </Heading>

            {message && <Text className="text-base">{message}</Text>}

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
              <Button
                href={`${URL}/event/${eventId}`}
                className="block bg-[#FF8549] text-white py-3 px-6 rounded-full hover:opacity-70 text-center text-base mt-8 mb-2 h-auto"
              >
                View Event
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
