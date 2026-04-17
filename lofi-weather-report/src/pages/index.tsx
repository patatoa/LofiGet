import Head from "next/head";
import dynamic from "next/dynamic";
import { Container, Card, Row, Text, Image, Grid } from "@nextui-org/react";
import { getDurations, getLatestSnapshot } from "@/services/storageDataAccess";
import { SkyDuration } from "@/types/skyDuration";
import { BsSunFill, BsMoon } from "react-icons/bs";
import ExplainerCard from "@/components/ExplainerCard";
import CreditsCard from "@/components/CreditsCard";
import getCreditYearRange from "@/services/getCreditsYearRange";

const SkyDonutChart = dynamic(() => import("@/components/SkyDonutChart"), { ssr: false });

interface SkyStats {
  dayPercent: number;
  nightPercent: number;
  totalTransitions: number;
  avgDayHours: number;
  avgNightHours: number;
  longestDayDays: number;
  longestNightDays: number;
}

interface LofiProps {
  sky: "day" | "night";
  imageUrl: string;
  latestSnapshotDate: string;
  skyDuration: string;
  recentDurations: SkyDuration[];
  stats: SkyStats;
  yearRange: string;
}

function computeStats(durations: SkyDuration[]): SkyStats {
  const toHours = (d: SkyDuration) => d.days * 24 + d.hours + d.minutes / 60;
  const dayDurations = durations.filter((d) => d.sky === "day");
  const nightDurations = durations.filter((d) => d.sky === "night");
  const dayHours = dayDurations.reduce((s, d) => s + toHours(d), 0);
  const nightHours = nightDurations.reduce((s, d) => s + toHours(d), 0);
  const total = dayHours + nightHours || 1;
  const avgDay = dayDurations.length ? dayHours / dayDurations.length : 0;
  const avgNight = nightDurations.length ? nightHours / nightDurations.length : 0;
  const longestDay = dayDurations.reduce((m, d) => Math.max(m, toHours(d)), 0);
  const longestNight = nightDurations.reduce((m, d) => Math.max(m, toHours(d)), 0);
  return {
    dayPercent: Math.round((dayHours / total) * 100),
    nightPercent: Math.round((nightHours / total) * 100),
    totalTransitions: durations.length,
    avgDayHours: Math.round(avgDay),
    avgNightHours: Math.round(avgNight),
    longestDayDays: Math.round(longestDay / 24),
    longestNightDays: Math.round(longestNight / 24),
  };
}

export default function Home({
  sky,
  imageUrl,
  latestSnapshotDate,
  skyDuration,
  recentDurations,
  stats,
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
        <Row css={{ mb: "2rem" }} justify="center" align="center">
          <Text small>Tracking the skys on LoFi land since Feb. 3 2023.</Text>
        </Row>

        {/* Current status */}
        <Card css={cardStyle}>
          <Card.Body>
            <Grid.Container justify="center">
              <Grid xs={12} sm={4} direction="column">
                <Row justify="flex-start" align="center">
                  <Text size={15}>
                    It is currently <em>{sky}</em>. It has been {sky} for {skyDuration}.
                  </Text>
                </Row>
                <Row justify="center" align="center">
                  <Text h2>Most recent snapshot</Text>
                </Row>
                <Row justify="center" align="center">
                  <Image src={imageUrl} alt="Latest snapshot" width={500} />
                </Row>
                <Row justify="center" align="center">
                  Snapshot taken on {latestSnapshotDate}
                </Row>
              </Grid>
            </Grid.Container>
          </Card.Body>
        </Card>

        {/* Stats */}
        <Card css={cardStyle}>
          <Card.Header>
            <Row justify="center" align="center">
              <Text h2>All-time stats</Text>
            </Row>
          </Card.Header>
          <Card.Body>
            <Grid.Container justify="center" gap={2}>
              <Grid xs={12} sm={6}>
                <SkyDonutChart
                  dayPercent={stats.dayPercent}
                  nightPercent={stats.nightPercent}
                />
              </Grid>
              <Grid xs={12} sm={6} direction="column" justify="center">
                <Text size={16} css={{ mb: "0.5rem" }}>
                  <BsSunFill style={{ display: "inline", marginRight: 6, color: "#F5A524" }} />
                  <strong>{stats.dayPercent}%</strong> day &nbsp;·&nbsp;
                  <BsMoon style={{ display: "inline", marginRight: 6, color: "#7828C8" }} />
                  <strong>{stats.nightPercent}%</strong> night
                </Text>
                <Text size={15} css={{ mb: "0.25rem" }}>Total transitions: <strong>{stats.totalTransitions}</strong></Text>
                <Text size={15} css={{ mb: "0.25rem" }}>Avg day: <strong>~{stats.avgDayHours}h</strong></Text>
                <Text size={15} css={{ mb: "0.25rem" }}>Avg night: <strong>~{stats.avgNightHours}h</strong></Text>
                <Text size={15} css={{ mb: "0.25rem" }}>Longest day: <strong>{stats.longestDayDays} days</strong></Text>
                <Text size={15}>Longest night: <strong>{stats.longestNightDays} days</strong></Text>
              </Grid>
            </Grid.Container>
          </Card.Body>
        </Card>

        {/* Recent history */}
        <Card css={cardStyle}>
          <Card.Header>
            <Row justify="center" align="center">
              <Text h2>Recent history</Text>
            </Row>
          </Card.Header>
          <Card.Body>
            <Grid.Container justify="center">
              <Grid xs={12} sm={6} direction="column">
                {recentDurations.map((duration) => (
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
  const frameCollectionName = process.env.NEXT_PUBLIC_FRAME_COLLECTION_NAME || "";
  const durationCollectionName = process.env.NEXT_PUBLIC_DURATION_COLLECTION_NAME || "";

  const latestSnapshot = await getLatestSnapshot(frameCollectionName);
  const latestDateTime = new Date(latestSnapshot.datetime.toDate());
  const currentSky = latestSnapshot.sky;

  const allDurations = await getDurations(durationCollectionName);
  const latestDuration = allDurations[0];
  const timeDiffStr =
    (latestDuration.months ? `${latestDuration.months} months ` : "") +
    `${latestDuration.days} days ${latestDuration.hours} hours ${latestDuration.minutes} minutes ${latestDuration.seconds} seconds`;

  const stats = computeStats(allDurations);
  const recentDurations = allDurations.slice(0, 10);
  const yearRange = getCreditYearRange();

  return {
    props: {
      sky: currentSky,
      imageUrl: latestSnapshot.url,
      latestSnapshotDate: latestDateTime.toUTCString(),
      skyDuration: timeDiffStr,
      recentDurations,
      stats,
      yearRange,
    },
  };
}
