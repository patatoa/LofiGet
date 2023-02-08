import Head from "next/head";
import { Container, Card, Row, Text, Image, Grid } from "@nextui-org/react";
import { Inter } from "@next/font/google";
import { getLatestDuration, getLatestFile, getLatestSnapshot } from "@/services/storageDataAccess";

interface LofiProps {
  sky: "day" | "night";
  imageUrl: string;
  latestSnapshotDate: string;
  skyDuration: string;
}

export default function Home({
  sky,
  imageUrl,
  latestSnapshotDate,
  skyDuration,
}: LofiProps) {
  return (
    <>
      <Head>
        <title>LoFi Weather Report</title>
        <meta name="description" content="What's the weather in LoFi Land?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Row justify="center" align="center">
          <Card>
            <Card.Header>
              <Row justify="center" align="center">
                <Text h1>LoFi Weather Report</Text>
              </Row>
            </Card.Header>
            <Card.Body>
              <Grid.Container justify="center">
                <Grid xs={12} sm={4} direction="column">
                  <Row
                    justify="flex-start"
                    align="center"
                  >
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
        </Row>
      </Container>
    </>
  );
}

export async function getServerSideProps() {
  const frameCollectionName = process.env.NEXT_PUBLIC_FRAME_COLLECTION_NAME || "";
  const durationCollectionName = process.env.NEXT_PUBLIC_DURATION_COLLECTION_NAME || "";
  const latestSnapshot = await getLatestSnapshot(frameCollectionName);
  const latestDuration = await getLatestDuration(durationCollectionName);
  const publicUrl = latestSnapshot.url;
  const latestDateTime = new Date(latestSnapshot.datetime.toDate());
  // latestSnapshot.datetime is a Timesamp. We need to convert it to a Date object
  const currentSky = latestSnapshot.sky;
  const latestTimeChange = new Date(latestDuration.timeStart.toDate());
  const currentDateTimeFormatted = latestDateTime.toUTCString();
  const timeDiffInHours = (
    (new Date().getTime() - latestTimeChange.getTime()) /
    (1000 * 60 * 60)
  ).toFixed(2);

  return {
    props: {
      sky:currentSky,
      imageUrl: publicUrl,
      latestSnapshotDate: currentDateTimeFormatted,
      skyDuration: `${timeDiffInHours} hours`,
    },
  };
}
