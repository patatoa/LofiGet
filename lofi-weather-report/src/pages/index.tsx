import Head from "next/head";
import { Container, Card, Row, Text, Image } from "@nextui-org/react";
import { Inter } from "@next/font/google";

interface LofiProps {
  sky: "day" | "night";
  imageUrl: string;
  latestSnapshotDate: string;
  latestSnapshotTime: string;
}

export default function Home({
  sky,
  imageUrl,
  latestSnapshotDate,
  latestSnapshotTime,
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
          <Card css={{ mw: "50%" }}>
            <Card.Header>
              <Row justify="center" align="center">
                <Text h1>LoFi Weather Report</Text>
              </Row>
            </Card.Header>
            <Card.Body>
              <Text size={15} css={{ m: 0 }}>
                It is currently <em>{sky}</em>.
              </Text>
            </Card.Body>
          </Card>
        </Row>
        <Row justify="center" align="center">
          <Card css={{ mw: "50%" }}>
            <Card.Header>
              <Row justify="center" align="center">
                <Text h2>Most recent snapshot</Text>
              </Row>
            </Card.Header>
            <Card.Body>
              <Image src={imageUrl} alt="Night" width={500} />
              <Row justify="center" align="center">
                Snapshot  taken on {latestSnapshotDate} at {latestSnapshotTime}
              </Row>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </>
  );
}

export function getStaticProps() {
  return {
    props: {
      sky: "night",
      imageUrl:
        "https://storage.googleapis.com/lofigirlframes/frame05-Feb-2023%20(02%3A00%3A08.509107).jpg",
      latestSnapshotDate: "02/05/2023",
      latestSnapshotTime: "20:00:08",
    },
  };
}
