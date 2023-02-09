import { CSS, Card, Row, Text } from "@nextui-org/react"

interface ExplainerCardProps {
	css?: CSS | undefined;
}

const ExplainerCard = ({css}: ExplainerCardProps) => {
	return (
        <Card css={css}>
			<Card.Header>
				<Row justify="center" align="center">
					<Text h2>Whats all this then?</Text>
				</Row>
			</Card.Header>
			<Card.Body >
				<Text>
					<em>LoFi Weather Report</em> is a free service to report on the sky conditions in LoFi Land. This is accomplished by periodically taking a snapshot of the <em>&quot;lofi hip hop radio - beats to relax/study to&quot;</em> YouTube stream and analyzing the image. The goal of this service to answer the timeless question, how long are the days in LoFi Land?
				</Text>	
			</Card.Body>
		</Card>
	)
}
export type { ExplainerCardProps }
export default ExplainerCard