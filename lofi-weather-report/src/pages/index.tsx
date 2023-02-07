import Head from "next/head";
import { Container, Card, Row, Text, Image, Grid } from "@nextui-org/react";
import { Inter } from "@next/font/google";
import { getLatestFile } from "@/services/storageDataAccess";

interface LofiProps {
  sky: "day" | "night";
  imageUrl: string;
  latestSnapshotDate: string;
  latestSnapshotTime: string;
  skyDuration: string;
}

export default function Home({
  sky,
  imageUrl,
  latestSnapshotDate,
  latestSnapshotTime,
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
      <Container md>
        <Row justify="center" align="center">
          <Card>
            <Card.Header>
              <Row justify="center" align="center">
                <Text h1>LoFi Weather Report</Text>
              </Row>
            </Card.Header>
            <Card.Body>
              <Grid.Container gap={2} justify="center">
                <Grid xs={12} sm={4} direction="column">
                  <Row
                    justify="flex-start"
                    align="center"
                    css={{ marginLeft: "$lg: 3rem" }}
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
                    Snapshot taken on {latestSnapshotDate} at{" "}
                    {latestSnapshotTime}
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
  const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || "";
  const latestSnapshot = await getLatestFile(bucketName);
  const publicUrl = latestSnapshot.publicUrl(); //https://storage.googleapis.com/lofigirlframes/frame04-Feb-2023%20(04%3A26%3A38.662277).jpg
  const urlDecoded = decodeURIComponent(publicUrl);
  const date = urlDecoded.split("frames/frame")[1].split(" ")[0];
  const time = urlDecoded.split("(")[1].split(".")[0];
  const timeWithAmPm =
    parseInt(time.split(":")[0]) < 12 ? `${time} am` : `${time} pm`;
  // make actual datetime object
  const datetime = new Date(`${date} ${time}`);
  const earliestTime = new Date(`07-Feb-2023 4:00 am`);
  const timeDiffInHours = (
    (datetime.getTime() - earliestTime.getTime()) /
    (1000 * 60 * 60)
  ).toFixed(2);
  console.log({ date, timeWithAmPm });
  return {
    props: {
      sky: "day",
      imageUrl: publicUrl,
      latestSnapshotDate: date,
      latestSnapshotTime: timeWithAmPm,
      skyDuration: `${timeDiffInHours} hours`,
    },
  };
}
