export function getDrivingDuration(durationString: string | undefined): string {
  if (durationString === undefined || isNaN(Number(durationString))) {
    return "-- : -- : --";
  }

  const durationInSeconds = Math.floor(Number(durationString));

  const hours: number = Math.floor(durationInSeconds / 3600);
  const minutes: number = Math.floor((durationInSeconds % 3600) / 60);
  const seconds: number = Math.floor(durationInSeconds % 60);

  const formattedDuration = `${padNumber(hours)} : ${padNumber(
    minutes,
  )} : ${padNumber(seconds)}`;

  return formattedDuration;
}

function padNumber(num: number): string {
  return num.toString().padStart(2, "0");
}
