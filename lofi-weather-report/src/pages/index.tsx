import Head from "next/head";
import { Container, Card, Row, Text, Image, Grid } from "@nextui-org/react";
import { Gorditas, Inter } from "@next/font/google";
import { getDurations, getLatestSnapshot } from "@/services/storageDataAccess";
import { SkyDuration } from "@/types/skyDuration";
import { BsSunFill, BsMoon } from "react-icons/bs";
import ExplainerCard from "@/components/ExplainerCard";
import getCreditYearRange from "@/services/getCreditsYearRange";
import CreditsCard from "@/components/CreditsCard";

interface LofiProps {
  sky: "day" | "night";
  imageUrl: string;
  latestSnapshotDate: string;
  skyDuration: string;
  skyDurations: SkyDuration[];
  yearRange: string;
}

export default function Home({
  sky,
  imageUrl,
  latestSnapshotDate,
  skyDuration,
  skyDurations,
  yearRange,
}: LofiProps) {
  const cardStyle = { mb: "2rem", pb: "1rem" };
  return (
    <>
      <Head>
        <title>LoFi Weather Report</title>
        <meta name="description" content="What's the weather in LoFi Land?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container gap={2}>
          <Row justify="center" align="center">
            <Text h1>LoFi Weather Report</Text>
          </Row>
                <Row css={{mb: "2rem"}} justify="center" align="center">
                  <Text small>
                    Tracking the skys on LoFi land since Feb. 3 2023.
                  </Text>
                </Row>
        <Card css={cardStyle}>
          <Card.Body>
            <Grid.Container justify="center">
              <Grid xs={12} sm={4} direction="column">
                <Row justify="flex-start" align="center">
                  <Text size={15}>
                    It is currently <em>{sky}</em>. It has been {sky} for{" "}
                    {skyDuration}.
                  </Text>
                </Row>
                <Row justify="center" align="center">
                  <Text h2>Most recent snapshot</Text>
                </Row>
                <Row justify="center" align="center">
                  <Image src={imageUrl} alt="Night" width={500} />
                </Row>
                <Row justify="center" align="center">
                  Snapshot taken on {latestSnapshotDate}
                </Row>
              </Grid>
            </Grid.Container>
          </Card.Body>
        </Card>
        <Card css={cardStyle}>
          <Card.Header>
            <Row justify="center" align="center">
              <Text h2>History</Text>
            </Row>
          </Card.Header>
          <Card.Body>
            <Grid.Container justify="center">
              <Grid xs={12} sm={6} direction="column">
                {skyDurations.map((duration) => (
                  <Grid.Container
                    justify="center"
                    key={duration.timeStart + duration.sky}
                  >
                    <Grid xs={1}>
                      {duration.sky === "day" ? (
                        <BsSunFill size={30} />
                      ) : (
                        <BsMoon size={30} />
                      )}
                    </Grid>
                    <Grid xs={4}>
                      <Text h3>
                        {duration.sky} of {duration.timeStart}
                      </Text>
                    </Grid>
                    <Grid xs={6}>
                      <Text h4>
                        {duration.months ? duration.months + " months " : ""}
                        {duration.days} days {duration.hours} hours{" "}
                        {duration.minutes} minutes {duration.seconds} seconds
                      </Text>
                    </Grid>
                  </Grid.Container>
                ))}
              </Grid>
            </Grid.Container>
          </Card.Body>
        </Card>
        <ExplainerCard css={cardStyle} />
        <CreditsCard css={cardStyle} yearRange={yearRange} />
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const frameCollectionName =
    process.env.NEXT_PUBLIC_FRAME_COLLECTION_NAME || "";
  const durationCollectionName =
    process.env.NEXT_PUBLIC_DURATION_COLLECTION_NAME || "";
  const latestSnapshot = await getLatestSnapshot(frameCollectionName);
  const publicUrl = latestSnapshot.url;
  const latestDateTime = new Date(latestSnapshot.datetime.toDate());
  // latestSnapshot.datetime is a Timesamp. We need to convert it to a Date object
  const currentSky = latestSnapshot.sky;
  const currentDateTimeFormatted = latestDateTime.toUTCString();
  const skyDurations = await getDurations(durationCollectionName);
  const latestDuration = skyDurations[0];
  const timeDiffStr =
    (latestDuration.months ? `${latestDuration.months} months ` : "") +
    `${latestDuration.days} days ${latestDuration.hours} hours ${latestDuration.minutes} minutes ${latestDuration.seconds} seconds`;
  const yearRange = getCreditYearRange();
  return {
    props: {
      sky: currentSky,
      imageUrl: publicUrl,
      latestSnapshotDate: currentDateTimeFormatted,
      skyDuration: timeDiffStr,
      skyDurations,
      yearRange,
    },
  };
}
