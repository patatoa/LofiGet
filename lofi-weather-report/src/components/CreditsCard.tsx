import { Card, Row, Spacer, Text, CSS } from "@nextui-org/react"

interface CreditsCardProps {
	css?: CSS | undefined;
	yearRange: string;
}
const ExplainerCard = ({css, yearRange}: CreditsCardProps) => {
	return (
		<Card css={{mb: "2rem", pb: "1rem"}}>
			<Card.Header>
				<Row justify="center" align="center">
					<Text h2>Credits</Text>
				</Row>
			</Card.Header>
			<Card.Body >
            <Row justify="center" align="center">
				<Text>
					Patatoa {yearRange} &nbsp;
					<em>Big ups to Brooklyn</em>
				</Text>	
				</Row>
			</Card.Body>
		</Card>
	)
}
export default ExplainerCard