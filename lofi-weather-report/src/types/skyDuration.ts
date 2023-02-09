interface SkyDuration {
	months: number;
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	sky: Sky;
	timeStart: string;
	timeEnd: string | null;
}
enum Sky {
	day = 'day',
	night = 'night'
}

const castToSkyDuration = (data: FirebaseFirestore.DocumentData): SkyDuration => {
	const { timeStart, timeEnd, sky } = data;
	const timeEndForCalc = timeEnd ? new Date(timeEnd) : new Date();
	const timeDiff = Math.abs(timeEndForCalc.getTime() - timeStart.toDate().getTime());
	const months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));
	const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
	const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

	return {
		months,
		days,
		hours,
		minutes,
		seconds,
		sky,
		timeStart: timeStart.toDate().toLocaleDateString(),
		timeEnd: timeEnd ? new Date(timeEnd).toLocaleDateString() : null
	};
}
export { Sky, castToSkyDuration };
export type { SkyDuration };
