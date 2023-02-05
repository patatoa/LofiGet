import Head from 'next/head'
import { Container, Card, Row, Text } from "@nextui-org/react";
import { Inter } from '@next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>LoFi Weather Report</title>
        <meta name="description" content="What's the weather in LoFi Land?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
      <Card>
        <Card.Header>
              LoFi Weather Report
        </Card.Header>
        <Card.Body>
          <Row justify="center" align="center">
            <Text h1 size={15} color="white" css={{ m: 0 }}>
              It is currently <em>night</em>.
            </Text>
            <Text h6 size={15} color="white" css={{ m: 0 }}>
              NextUI gives you the best developer experience with all the features
              you need for building beautiful and modern websites and
              applications.
            </Text>
          </Row>
        </Card.Body>
      </Card>
    </Container>
    </>
  )
}
