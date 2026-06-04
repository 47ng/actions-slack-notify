import * as os from "os";
//#region node_modules/.pnpm/@actions+core@3.0.1/node_modules/@actions/core/lib/utils.js
/**
* Sanitizes an input into a string so it can be passed into issueCommand safely
* @param input input to sanitize into a string
*/
function toCommandValue(input) {
	if (input === null || input === void 0) return "";
	else if (typeof input === "string" || input instanceof String) return input;
	return JSON.stringify(input);
}
/**
*
* @param annotationProperties
* @returns The command properties to send with the actual annotation command
* See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
*/
function toCommandProperties(annotationProperties) {
	if (!Object.keys(annotationProperties).length) return {};
	return {
		title: annotationProperties.title,
		file: annotationProperties.file,
		line: annotationProperties.startLine,
		endLine: annotationProperties.endLine,
		col: annotationProperties.startColumn,
		endColumn: annotationProperties.endColumn
	};
}
//#endregion
//#region node_modules/.pnpm/@actions+core@3.0.1/node_modules/@actions/core/lib/command.js
/**
* Issues a command to the GitHub Actions runner
*
* @param command - The command name to issue
* @param properties - Additional properties for the command (key-value pairs)
* @param message - The message to include with the command
* @remarks
* This function outputs a specially formatted string to stdout that the Actions
* runner interprets as a command. These commands can control workflow behavior,
* set outputs, create annotations, mask values, and more.
*
* Command Format:
*   ::name key=value,key=value::message
*
* @example
* ```typescript
* // Issue a warning annotation
* issueCommand('warning', {}, 'This is a warning message');
* // Output: ::warning::This is a warning message
*
* // Set an environment variable
* issueCommand('set-env', { name: 'MY_VAR' }, 'some value');
* // Output: ::set-env name=MY_VAR::some value
*
* // Add a secret mask
* issueCommand('add-mask', {}, 'secretValue123');
* // Output: ::add-mask::secretValue123
* ```
*
* @internal
* This is an internal utility function that powers the public API functions
* such as setSecret, warning, error, and exportVariable.
*/
function issueCommand(command, properties, message) {
	const cmd = new Command(command, properties, message);
	process.stdout.write(cmd.toString() + os.EOL);
}
const CMD_STRING = "::";
var Command = class {
	constructor(command, properties, message) {
		if (!command) command = "missing.command";
		this.command = command;
		this.properties = properties;
		this.message = message;
	}
	toString() {
		let cmdStr = CMD_STRING + this.command;
		if (this.properties && Object.keys(this.properties).length > 0) {
			cmdStr += " ";
			let first = true;
			for (const key in this.properties) if (this.properties.hasOwnProperty(key)) {
				const val = this.properties[key];
				if (val) {
					if (first) first = false;
					else cmdStr += ",";
					cmdStr += `${key}=${escapeProperty(val)}`;
				}
			}
		}
		cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
		return cmdStr;
	}
};
function escapeData(s) {
	return toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
}
function escapeProperty(s) {
	return toCommandValue(s).replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A").replace(/:/g, "%3A").replace(/,/g, "%2C");
}
/**
* The code to exit an action
*/
var ExitCode;
(function(ExitCode) {
	/**
	* A code indicating that the action was successful
	*/
	ExitCode[ExitCode["Success"] = 0] = "Success";
	/**
	* A code indicating that the action was a failure
	*/
	ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode || (ExitCode = {}));
/**
* Gets the value of an input.
* Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
* Returns an empty string if the value is not defined.
*
* @param     name     name of the input to get
* @param     options  optional. See InputOptions.
* @returns   string
*/
function getInput(name, options) {
	const val = process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";
	if (options && options.required && !val) throw new Error(`Input required and not supplied: ${name}`);
	if (options && options.trimWhitespace === false) return val;
	return val.trim();
}
/**
* Sets the action status to failed.
* When the action exits it will be with an exit code of 1
* @param message add error issue message
*/
function setFailed(message) {
	process.exitCode = ExitCode.Failure;
	error(message);
}
/**
* Adds an error issue
* @param message error issue message. Errors will be converted to string via toString()
* @param properties optional properties to add to the annotation.
*/
function error(message, properties = {}) {
	issueCommand("error", toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
/**
* Writes info to log with console.log.
* @param message info message
*/
function info(message) {
	process.stdout.write(message + os.EOL);
}
const DEFAULT_CONFIG = {
	lang: void 0,
	message: void 0,
	abortEarly: void 0,
	abortPipeEarly: void 0
};
/**
* Returns the global configuration.
*
* @param config The config to merge.
*
* @returns The configuration.
*/
/* @__NO_SIDE_EFFECTS__ */
function getGlobalConfig(config$1) {
	if (!config$1 && true) return DEFAULT_CONFIG;
	return {
		lang: config$1?.lang ?? void 0,
		message: config$1?.message,
		abortEarly: config$1?.abortEarly ?? void 0,
		abortPipeEarly: config$1?.abortPipeEarly ?? void 0
	};
}
/**
* Stringifies an unknown input to a literal or type string.
*
* @param input The unknown input.
*
* @returns A literal or type string.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _stringify(input) {
	const type = typeof input;
	if (type === "string") return `"${input}"`;
	if (type === "number" || type === "bigint" || type === "boolean") return `${input}`;
	if (type === "object" || type === "function") return (input && Object.getPrototypeOf(input)?.constructor?.name) ?? "null";
	return type;
}
/**
* Adds an issue to the dataset.
*
* @param context The issue context.
* @param label The issue label.
* @param dataset The input dataset.
* @param config The configuration.
* @param other The optional props.
*
* @internal
*/
function _addIssue(context, label, dataset, config$1, other) {
	const input = other && "input" in other ? other.input : dataset.value;
	const expected = other?.expected ?? context.expects ?? null;
	const received = other?.received ?? /* @__PURE__ */ _stringify(input);
	const issue = {
		kind: context.kind,
		type: context.type,
		input,
		expected,
		received,
		message: `Invalid ${label}: ${expected ? `Expected ${expected} but r` : "R"}eceived ${received}`,
		requirement: context.requirement,
		path: other?.path,
		issues: other?.issues,
		lang: config$1.lang,
		abortEarly: config$1.abortEarly,
		abortPipeEarly: config$1.abortPipeEarly
	};
	const isSchema = context.kind === "schema";
	const message$1 = other?.message ?? context.message ?? (context.reference, issue.lang, void 0) ?? (isSchema ? (issue.lang, void 0) : null) ?? config$1.message ?? (issue.lang, void 0);
	if (message$1 !== void 0) issue.message = typeof message$1 === "function" ? message$1(issue) : message$1;
	if (isSchema) dataset.typed = false;
	if (dataset.issues) dataset.issues.push(issue);
	else dataset.issues = [issue];
}
const _standardCache = /* @__PURE__ */ new WeakMap();
/**
* Returns the Standard Schema properties.
*
* @param context The schema context.
*
* @returns The Standard Schema properties.
*/
/* @__NO_SIDE_EFFECTS__ */
function _getStandardProps(context) {
	let cached = _standardCache.get(context);
	if (!cached) {
		cached = {
			version: 1,
			vendor: "valibot",
			validate(value$1) {
				return context["~run"]({ value: value$1 }, /* @__PURE__ */ getGlobalConfig());
			}
		};
		_standardCache.set(context, cached);
	}
	return cached;
}
/**
* Disallows inherited object properties and prevents object prototype
* pollution by disallowing certain keys.
*
* @param object The object to check.
* @param key The key to check.
*
* @returns Whether the key is allowed.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _isValidObjectKey(object$1, key) {
	return Object.prototype.hasOwnProperty.call(object$1, key) && key !== "__proto__" && key !== "prototype" && key !== "constructor";
}
/**
* Joins multiple `expects` values with the given separator.
*
* @param values The `expects` values.
* @param separator The separator.
*
* @returns The joined `expects` property.
*
* @internal
*/
/* @__NO_SIDE_EFFECTS__ */
function _joinExpects(values$1, separator) {
	const list = [...new Set(values$1)];
	if (list.length > 1) return `(${list.join(` ${separator} `)})`;
	return list[0] ?? "never";
}
/**
* A Valibot error with useful information.
*/
var ValiError = class extends Error {
	/**
	* Creates a Valibot error with useful information.
	*
	* @param issues The error issues.
	*/
	constructor(issues) {
		super(issues[0].message);
		this.name = "ValiError";
		this.issues = issues;
	}
};
/* @__NO_SIDE_EFFECTS__ */
function nonEmpty(message$1) {
	return {
		kind: "validation",
		type: "non_empty",
		reference: nonEmpty,
		async: false,
		expects: "!0",
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && dataset.value.length === 0) _addIssue(this, "length", dataset, config$1, { received: "0" });
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function regex(requirement, message$1) {
	return {
		kind: "validation",
		type: "regex",
		reference: regex,
		async: false,
		expects: `${requirement}`,
		requirement,
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement.test(dataset.value)) _addIssue(this, "format", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function url(message$1) {
	return {
		kind: "validation",
		type: "url",
		reference: url,
		async: false,
		expects: null,
		requirement(input) {
			try {
				new URL(input);
				return true;
			} catch {
				return false;
			}
		},
		message: message$1,
		"~run"(dataset, config$1) {
			if (dataset.typed && !this.requirement(dataset.value)) _addIssue(this, "URL", dataset, config$1);
			return dataset;
		}
	};
}
/**
* Returns the fallback value of the schema.
*
* @param schema The schema to get it from.
* @param dataset The output dataset if available.
* @param config The config if available.
*
* @returns The fallback value.
*/
/* @__NO_SIDE_EFFECTS__ */
function getFallback(schema, dataset, config$1) {
	return typeof schema.fallback === "function" ? schema.fallback(dataset, config$1) : schema.fallback;
}
/**
* Returns the default value of the schema.
*
* @param schema The schema to get it from.
* @param dataset The input dataset if available.
* @param config The config if available.
*
* @returns The default value.
*/
/* @__NO_SIDE_EFFECTS__ */
function getDefault(schema, dataset, config$1) {
	return typeof schema.default === "function" ? schema.default(dataset, config$1) : schema.default;
}
/* @__NO_SIDE_EFFECTS__ */
function object(entries$1, message$1) {
	return {
		kind: "schema",
		type: "object",
		reference: object,
		expects: "Object",
		async: false,
		entries: entries$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const key in this.entries) {
					const valueSchema = this.entries[key];
					if (key in input || (valueSchema.type === "exact_optional" || valueSchema.type === "optional" || valueSchema.type === "nullish") && valueSchema.default !== void 0) {
						const value$1 = key in input ? input[key] : /* @__PURE__ */ getDefault(valueSchema);
						const valueDataset = valueSchema["~run"]({ value: value$1 }, config$1);
						if (valueDataset.issues) {
							const pathItem = {
								type: "object",
								origin: "value",
								input,
								key,
								value: value$1
							};
							for (const issue of valueDataset.issues) {
								if (issue.path) issue.path.unshift(pathItem);
								else issue.path = [pathItem];
								dataset.issues?.push(issue);
							}
							if (!dataset.issues) dataset.issues = valueDataset.issues;
							if (config$1.abortEarly) {
								dataset.typed = false;
								break;
							}
						}
						if (!valueDataset.typed) dataset.typed = false;
						dataset.value[key] = valueDataset.value;
					} else if (valueSchema.fallback !== void 0) dataset.value[key] = /* @__PURE__ */ getFallback(valueSchema);
					else if (valueSchema.type !== "exact_optional" && valueSchema.type !== "optional" && valueSchema.type !== "nullish") {
						_addIssue(this, "key", dataset, config$1, {
							input: void 0,
							expected: `"${key}"`,
							path: [{
								type: "object",
								origin: "key",
								input,
								key,
								value: input[key]
							}]
						});
						if (config$1.abortEarly) break;
					}
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function optional(wrapped, default_) {
	return {
		kind: "schema",
		type: "optional",
		reference: optional,
		expects: `(${wrapped.expects} | undefined)`,
		async: false,
		wrapped,
		default: default_,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (dataset.value === void 0) {
				if (this.default !== void 0) dataset.value = /* @__PURE__ */ getDefault(this, dataset, config$1);
				if (dataset.value === void 0) {
					dataset.typed = true;
					return dataset;
				}
			}
			return this.wrapped["~run"](dataset, config$1);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function picklist(options, message$1) {
	return {
		kind: "schema",
		type: "picklist",
		reference: picklist,
		expects: /* @__PURE__ */ _joinExpects(options.map(_stringify), "|"),
		async: false,
		options,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (this.options.includes(dataset.value)) dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function record(key, value$1, message$1) {
	return {
		kind: "schema",
		type: "record",
		reference: record,
		expects: "Object",
		async: false,
		key,
		value: value$1,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			const input = dataset.value;
			if (input && typeof input === "object") {
				dataset.typed = true;
				dataset.value = {};
				for (const entryKey in input) if (/* @__PURE__ */ _isValidObjectKey(input, entryKey)) {
					const entryValue = input[entryKey];
					const keyDataset = this.key["~run"]({ value: entryKey }, config$1);
					if (keyDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "key",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of keyDataset.issues) {
							issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = keyDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					const valueDataset = this.value["~run"]({ value: entryValue }, config$1);
					if (valueDataset.issues) {
						const pathItem = {
							type: "object",
							origin: "value",
							input,
							key: entryKey,
							value: entryValue
						};
						for (const issue of valueDataset.issues) {
							if (issue.path) issue.path.unshift(pathItem);
							else issue.path = [pathItem];
							dataset.issues?.push(issue);
						}
						if (!dataset.issues) dataset.issues = valueDataset.issues;
						if (config$1.abortEarly) {
							dataset.typed = false;
							break;
						}
					}
					if (!keyDataset.typed || !valueDataset.typed) dataset.typed = false;
					if (keyDataset.typed) dataset.value[keyDataset.value] = valueDataset.value;
				}
			} else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function string(message$1) {
	return {
		kind: "schema",
		type: "string",
		reference: string,
		expects: "string",
		async: false,
		message: message$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			if (typeof dataset.value === "string") dataset.typed = true;
			else _addIssue(this, "type", dataset, config$1);
			return dataset;
		}
	};
}
/**
* Parses an unknown input based on a schema.
*
* @param schema The schema to be used.
* @param input The input to be parsed.
* @param config The parse configuration.
*
* @returns The parsed input.
*/
function parse(schema, input, config$1) {
	const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
	if (dataset.issues) throw new ValiError(dataset.issues);
	return dataset.value;
}
/* @__NO_SIDE_EFFECTS__ */
function pipe(...pipe$1) {
	return {
		...pipe$1[0],
		pipe: pipe$1,
		get "~standard"() {
			return /* @__PURE__ */ _getStandardProps(this);
		},
		"~run"(dataset, config$1) {
			for (const item of pipe$1) if (item.kind !== "metadata") {
				if (dataset.issues && (item.kind === "schema" || item.kind === "transformation")) {
					dataset.typed = false;
					break;
				}
				if (!dataset.issues || !config$1.abortEarly && !config$1.abortPipeEarly) dataset = item["~run"](dataset, config$1);
			}
			return dataset;
		}
	};
}
/**
* Parses an unknown input based on a schema.
*
* @param schema The schema to be used.
* @param input The input to be parsed.
* @param config The parse configuration.
*
* @returns The parse result.
*/
/* @__NO_SIDE_EFFECTS__ */
function safeParse(schema, input, config$1) {
	const dataset = schema["~run"]({ value: input }, /* @__PURE__ */ getGlobalConfig(config$1));
	return {
		typed: dataset.typed,
		success: !dataset.issues,
		output: dataset.value,
		issues: dataset.issues
	};
}
//#endregion
//#region src/gha.ts
const githubEnvSchema = /* @__PURE__ */ object({
	GITHUB_WORKFLOW: /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ nonEmpty()),
	GITHUB_REPOSITORY: /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ nonEmpty()),
	GITHUB_SHA: /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ nonEmpty()),
	GITHUB_REF: /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ nonEmpty()),
	GITHUB_SERVER_URL: /* @__PURE__ */ optional(/* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ url()), "https://github.com"),
	GITHUB_RUN_ID: /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ nonEmpty()),
	GITHUB_EVENT_NAME: /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ nonEmpty()),
	GITHUB_HEAD_REF: /* @__PURE__ */ optional(/* @__PURE__ */ string())
});
function parseEnv(env) {
	return parse(githubEnvSchema, env);
}
const PR_REF_REGEX = /^refs\/pull\/(\d+)\/merge$/;
const BRANCH_REF_REGEX = /^refs\/heads\/(.+)$/;
const TAG_REF_REGEX = /^refs\/tags\/(.+)$/;
const DEPENDABOT_REGEX = /^dependabot\/(?:[\w]+)\/([\w/-]+)-([\d]+\.[\d]+\.[\d]+.*)$/;
function parseDependabotRef(ref) {
	if (!ref) return;
	const match = ref.match(DEPENDABOT_REGEX);
	if (!match) return;
	return {
		package: match[1].includes("/") ? `@${match[1]}` : match[1],
		version: match[2]
	};
}
function getPRNumber(ref) {
	const match = ref.match(PR_REF_REGEX);
	if (!match) return void 0;
	return parseInt(match[1]);
}
function getBranch(ref) {
	const match = ref.match(BRANCH_REF_REGEX);
	if (!match) return void 0;
	return match[1];
}
function getTag(ref) {
	const match = ref.match(TAG_REF_REGEX);
	if (!match) return void 0;
	return match[1];
}
function getRefContext(ref) {
	const pr = getPRNumber(ref);
	if (pr) return `PR *#${pr}*`;
	const tag = getTag(ref);
	if (tag) return `tag *${tag}*`;
	const branch = getBranch(ref);
	if (branch) return `branch *${branch}*`;
	return `*${ref}*`;
}
function getURLs({ GITHUB_REPOSITORY, GITHUB_SHA, GITHUB_REF, GITHUB_SERVER_URL, GITHUB_RUN_ID }) {
	const prNumber = getPRNumber(GITHUB_REF);
	return {
		repo: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}`,
		commit: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}`,
		run: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`,
		pr: prNumber ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/pull/${prNumber}` : void 0
	};
}
//#endregion
//#region src/inputs.ts
const messageStatusSchema = /* @__PURE__ */ picklist(["success", "failure"]);
function parseStatus(raw) {
	const result = /* @__PURE__ */ safeParse(messageStatusSchema, raw);
	return result.success ? result.output : void 0;
}
const stepsSchema = /* @__PURE__ */ record(/* @__PURE__ */ string(), /* @__PURE__ */ object({ outcome: /* @__PURE__ */ picklist([
	"success",
	"failure",
	"skipped"
]) }));
function parseSteps(raw) {
	return parse(stepsSchema, JSON.parse(raw));
}
const webhookUrlSchema = /* @__PURE__ */ pipe(/* @__PURE__ */ string(), /* @__PURE__ */ regex(/^https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]+\/[A-Z0-9]+\/[\w-]+$/));
function parseWebhookUrl(raw) {
	const result = /* @__PURE__ */ safeParse(webhookUrlSchema, raw);
	return result.success ? result.output : void 0;
}
//#endregion
//#region src/slack.ts
function section(text) {
	return {
		type: "section",
		text: {
			type: "mrkdwn",
			text
		}
	};
}
function success(env, jobName) {
	const { GITHUB_WORKFLOW, GITHUB_REPOSITORY, GITHUB_HEAD_REF } = env;
	const urls = getURLs(env);
	const runName = jobName ? `${GITHUB_WORKFLOW}/${jobName}` : GITHUB_WORKFLOW;
	const blocks = [section(`*✔︎  ${runName}* passed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`)];
	const dependabot = parseDependabotRef(GITHUB_HEAD_REF);
	if (dependabot) blocks.push(section(`📦  *${dependabot.package}* ${dependabot.version} _(by Dependabot)_`));
	blocks.push(getContext(env), getActions(env, "success"));
	return {
		text: `✔︎  ${runName} passed on ${GITHUB_REPOSITORY}`,
		blocks
	};
}
function failure(env, jobName, steps) {
	const { GITHUB_WORKFLOW, GITHUB_REPOSITORY, GITHUB_HEAD_REF } = env;
	const urls = getURLs(env);
	const runName = jobName ? `${GITHUB_WORKFLOW}/${jobName}` : GITHUB_WORKFLOW;
	const blocks = [section(`*🚨  ${runName}* failed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`)];
	const dependabot = parseDependabotRef(GITHUB_HEAD_REF);
	if (dependabot) blocks.push(section(`📦  *${dependabot.package}* ${dependabot.version} _(by Dependabot)_`));
	if (Object.keys(steps).length > 0) blocks.push(section(Object.entries(steps).map(([id, { outcome }]) => {
		const icon = {
			failure: "✘",
			success: "✔︎",
			skipped: "○"
		}[outcome];
		const format = {
			failure: "*",
			success: "",
			skipped: "_"
		}[outcome];
		return `${format}${icon}  ${id}${format}`;
	}).join("\n")));
	blocks.push(getContext(env), getActions(env, "failure"));
	return {
		text: `🚨  ${runName} failed on ${GITHUB_REPOSITORY}`,
		blocks
	};
}
function getContext(env) {
	const urls = getURLs(env);
	const shortSha = env.GITHUB_SHA.slice(0, 8);
	return {
		type: "context",
		elements: [{
			type: "mrkdwn",
			text: `From <${urls.commit}|\`${shortSha}\`> on ${getRefContext(env.GITHUB_REF)}`
		}, {
			type: "mrkdwn",
			text: `Triggered by *${env.GITHUB_EVENT_NAME}*`
		}]
	};
}
function getActions(env, status) {
	const urls = getURLs(env);
	const elements = [{
		type: "button",
		text: {
			type: "plain_text",
			text: status === "failure" ? "View Failed Workflow" : "View Workflow"
		},
		url: urls.run,
		...status === "failure" ? { style: "danger" } : {}
	}];
	if (urls.pr !== void 0) {
		const prNumber = getPRNumber(env.GITHUB_REF);
		elements.push({
			type: "button",
			text: {
				type: "plain_text",
				text: `View Pull Request #${prNumber}`
			},
			url: urls.pr
		});
	}
	return {
		type: "actions",
		elements
	};
}
function previewUrl(blocks) {
	return `https://app.slack.com/block-kit-builder/#${encodeURIComponent(JSON.stringify({ blocks }))}`;
}
const MAX_RETRIES = 3;
const MAX_BACKOFF_MS = 3e4;
async function postToSlack(url, message) {
	const body = JSON.stringify(message);
	for (let attempt = 0;; attempt++) {
		const response = await fetch(url, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body
		});
		if (response.ok) return;
		if (!(response.status === 429 || response.status >= 500) || attempt >= MAX_RETRIES) {
			const detail = await response.text().catch(() => "");
			throw new Error(`Slack webhook responded ${response.status} ${response.statusText}${detail ? `: ${detail}` : ""}`);
		}
		const retryAfter = Number(response.headers.get("retry-after"));
		const requestedMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1e3 : 2 ** attempt * 1e3;
		await new Promise((resolve) => setTimeout(resolve, Math.min(requestedMs, MAX_BACKOFF_MS)));
	}
}
//#endregion
//#region src/main.ts
async function run() {
	try {
		const url = parseWebhookUrl(process.env.SLACK_WEBHOOK_URL);
		if (!url) {
			info("SLACK_WEBHOOK_URL is missing or not a valid Slack webhook URL, skipping sending Slack notification.");
			return;
		}
		info(getInput("steps"));
		const status = parseStatus(getInput("status"));
		if (status === void 0) return;
		const env = parseEnv(process.env);
		const jobName = getInput("jobName");
		const msg = status === "success" ? success(env, jobName) : failure(env, jobName, parseSteps(getInput("steps")));
		info(previewUrl(msg.blocks));
		await postToSlack(url, msg);
	} catch (error) {
		if (error instanceof Error) setFailed(error.message);
		else setFailed(String(error));
	}
}
run();
//#endregion
export {};

//# sourceMappingURL=index.mjs.map