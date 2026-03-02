import "server-only";
import { parseCSVStep } from "./01-parse-csv";
import { aggregateDataStep } from "./02-aggregate-data";
import { splitDailyStep } from "./03-split-daily";
import { writeMetadataStep } from "./04-write-metadata";

export const processCSVWorkflow = async () => {
  "use workflow";

  const parseResult = await parseCSVStep();
  console.log(`Parsed ${parseResult.totalRows} rows`);

  const aggregateResult = await aggregateDataStep();
  console.log(`Aggregated into ${aggregateResult.dailyCount} daily entries`);

  const splitResult = await splitDailyStep();
  console.log(`Split into ${splitResult.dateFiles} date files`);

  const metadata = await writeMetadataStep();
  console.log(`Metadata written: ${metadata.startDate} to ${metadata.endDate}`);

  return metadata;
};
