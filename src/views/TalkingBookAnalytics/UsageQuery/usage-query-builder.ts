/* jshint esversion:6, asi:true */
/* global $, Utils, console */

/**
 * Takes a possibly incomplete "def" and applies defaults, interpolations, etc.
 * @param defs With members:
 *         name  - the name of the column in the sql result
 *         columnname - effectively a synonym for name
 *         type - 'string', 'date', 'time', 'number'. Type of data in the column. Default 'string'.
 *         heading - What to call the column in the spreadsheet. Default name.
 *         exportHeading - What to call the column in the exported spreadsheet. Default heading.
 *         aggregation - If present, how this column can be aggregated, 'count'  or 'sum'. Default 'count'.
 *         render - If present, how to render the cell in the table.
 *         tooltip - If present, the tooltip that describes the column.
 *         aggregationDefault - If true, the column will be aggregated by default.
 *         if aggregation is "truthy":
 *             aggregateBase - If present, used to build the heading when aggregated. Default heading + 's'.
 *             aggregateTooltip - A tooltip for the aggregated column. Default like "Count of XYX" or "Sum of ABC"
 *             aggregateHeading - Heading for the aggregated column. Default like "# Completions" or "Total Time Played"
 * @returns {{name}}
 * @constructor
 */
export const COLUMNS = [
	{
		name: "deploymentnumber",
		heading: "Deployment #",
		aggregateBase: "Deployments",
		type: "number",
	},
	{
		name: "deployment",
		heading: "Deployment",
		type: "string",
	},
	{
		name: "deploymentname",
		heading: "Deployment Name",
	},
	{
		name: "startdate",
		heading: "Deployment Start",
		tooltip: "The date on which the Deployment was scheduled to start.",
		type: "date",
		aggregateBase: "Start Dates",
	},
	{
		name: "contentpackage",
		heading: "Content Package",
	},
	{
		name: "languagecode",
		heading: "Language Code",
		tooltip: "ISO 639-3 code for the language.",
		aggregateBase: "ISO 639-3 Codes",
	},
	{
		name: "language",
		heading: "Language",
		tooltip: "Name of the language. Note that a language can have many names.",
	},
	{
		name: "country",
		heading: "Country",
		aggregateBase: "Countries",
	},
	{
		name: "region",
		heading: "Region",
		tooltip:
			"Geo-Political organization unit smaller than a Country, but larger than a District.",
	},
	{
		name: "district",
		heading: "District",
		tooltip:
			"Geo-Political organization unit larger than a community, but smaller than a Region.",
	},
	{
		name: "communityname",
		heading: "Community",
		aggregateBase: "Communities",
		aggregateTooltip: "Count of communities (by name)",
	},
	{
		name: "groupname",
		heading: "Group",
		tooltip:
			"The name of a group or club within a Community. A group typically receives 1, 2, or 3 Talking Books.",
		aggregateTooltip: "Count of groups (by name)",
	},
	{
		name: "agent",
		heading: "Agent",
		tooltip:
			"The name of the Community Agent, Health Worker or Volunteer, or other individual who receives the Talking Book.",
		aggregateTooltip: "Count of agents (by name)",
	},
	{
		name: "talkingbookid",
		heading: "TB",
		tooltip: "The unique identifier of an individual Talking Book",
		aggregateBase: "Talking Books",
	},
	{
		name: "deployment_uuid",
		heading: "Deployment ID",
		tooltip:
			"A unique ID associated with a single deployment to an individual Talking Book",
		aggregateBase: "Deployment IDs",
	},
	{
		name: "category",
		heading: "Category",
		tooltip: "In what playlist category was the message published?",
		type: "string",
		aggregateBase: "Playlist Categories",
		aggregateTooltip: "Count of playlist categories",
	},
	{
		name: "playlist",
		heading: "Playlist",
		tooltip: "In what playlist category was the message published?",
		type: "string",
		aggregateBase: "Playlist Categories",
		aggregateTooltip: "Count of playlist categories",
	},
	{
		name: "sdg_goals",
		heading: "SDG Goals",
		tooltip: "What were the SDG Goals?",
		type: "string",
	},
	{
		name: "sdg_targets",
		heading: "SDG Targets",
		tooltip: "What were the SDG Targets?",
		type: "string",
	},
	{
		name: "contentid",
		heading: "Content Id",
		tooltip: "The unique id of the message, in a particular language.",
		aggregateTooltip:
			"Count of message ids (message title in a particular language)",
	},
	{
		name: "title",
		heading: "Message",
		tooltip: "The title of the message.",
		aggregateBase: "Message Titles",
		aggregateTooltip: "Count of message titles (in all languages)",
	},
	{
		name: "format",
		heading: "Format",
		tooltip:
			"When known, the format of the message, such as drama, song, or interview.",
		type: "string",
		aggregateTooltip: "Count of message formats where known",
	},
	{
		name: "duration_seconds",
		heading: "Duration",
		tooltip: "Length of the message in seconds.",
		type: "time",
		// Be explicit that the value is seconds (displays as mm:ss)
		exportHeading: "Duration Seconds",
	},
	{
		name: "position",
		heading: "Position",
		tooltip:
			"The position of the message within its playlist. Position '1' is the first message in the playlist.",
		type: "number",
		aggregateTooltip: "Count of distinct positions (how many @ #1, @ #2, ...)",
	},
	{
		name: "timestamp",
		heading: "Collection Time",
		tooltip: "When were the statistics in this line collected?",
		type: "date",
	},
	{
		name: "deployment_timestamp",
		heading: "Deployment Time",
		tooltip: "When was the content deployed to the Talking Book?",
		type: "date",
	},
	{
		name: "played_seconds",
		heading: "Time Played",
		tooltip: "How long in total was the message played? ",
		type: "time",
		summable: true,
		aggregation: "sum",
		aggregateBase: "Time Played",
		aggregateTooltip: "Total time the message was played",
		// Be explicit that the value is seconds (diaplays as 'N hours' or mm:ss)
		exportHeading: "Seconds Played",
	},
	{
		name: "completions",
		heading: "Completions",
		tooltip: "How many times was the message played to completion?",
		type: "number",
		summable: true,
		aggregation: "sum",
		aggregateTooltip: "Number of times message was played to completion",
	},
	{
		name: "threequarters",
		heading: "3/4 Plays",
		tooltip: "How many times was the message played through 3/4?",
		type: "number",
		summable: true,
		aggregation: "sum",
		aggregationDefault: true,
		aggregateTooltip: "Number of times message was played to 3/4",
	},
	{
		name: "half",
		heading: "1/2 Plays",
		tooltip: "How many times was the message played through 1/2?",
		type: "number",
		summable: true,
		aggregation: "sum",
		aggregationDefault: true,
		aggregateTooltip: "Number of times message was played to 1/2",
	},
	{
		name: "quarter",
		heading: "1/4 Plays",
		tooltip: "How many times was the message played through 1/4?",
		type: "number",
		summable: true,
		aggregation: "sum",
		aggregationDefault: true,
		aggregateTooltip: "Number of times message was played to 1/4",
	},
	{
		name: "started",
		heading: "Starts",
		tooltip: "How many times was the message started (10 seconds)?",
		type: "number",
		summable: true,
		aggregation: "sum",
		aggregationDefault: true,
		aggregateTooltip: "Number of times message was started (10 seconds)",
	},
	{
		name: "tbcdid",
		heading: "Collected By",
		tooltip: "Which TB-Loader id collected the statistics?",
	},
];
