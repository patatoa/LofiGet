import Head from "next/head";
import { Container, Card, Row, Text, Image } from "@nextui-org/react";
import { Inter } from "@next/font/google";
import { getLatestFile } from "@/services/storageDataAccess";

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
              <Row justify="center" align="center">
              <Image src={imageUrl} alt="Night" width={500} />
              </Row>
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

export async function getServerSideProps() {
  const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || "";
  const latestSnapshot = await getLatestFile(bucketName)
  const publicUrl = latestSnapshot.publicUrl();
  const date = publicUrl.split("frame")[1].split("(")[0];
  const time = publicUrl.split("(")[1].split(")")[0];
  return {
    props: {
      sky: "night",
      imageUrl: publicUrl,
      latestSnapshotDate: date,
      latestSnapshotTime: time,
    },
  };
}
