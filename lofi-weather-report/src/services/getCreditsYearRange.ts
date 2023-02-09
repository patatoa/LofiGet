const getCreditYearRange = (): string => {
	const startYear = 2023;
	const currentYear = new Date().getFullYear();
	return startYear === currentYear ? `${startYear}` : `${startYear} - ${currentYear}`;
}

export default getCreditYearRange;