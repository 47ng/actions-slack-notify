require('./sourcemap-register.js');module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7716:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse("{\"name\":\"@slack/webhook\",\"version\":\"6.0.0\",\"description\":\"Official library for using the Slack Platform's Incoming Webhooks\",\"author\":\"Slack Technologies, Inc.\",\"license\":\"MIT\",\"keywords\":[\"slack\",\"request\",\"client\",\"http\",\"api\",\"proxy\"],\"main\":\"dist/index.js\",\"types\":\"./dist/index.d.ts\",\"files\":[\"dist/**/*\"],\"engines\":{\"node\":\">= 12.13.0\",\"npm\":\">= 6.12.0\"},\"repository\":\"slackapi/node-slack-sdk\",\"homepage\":\"https://slack.dev/node-slack-sdk/webhook\",\"publishConfig\":{\"access\":\"public\"},\"bugs\":{\"url\":\"https://github.com/slackapi/node-slack-sdk/issues\"},\"scripts\":{\"prepare\":\"npm run build\",\"build\":\"npm run build:clean && tsc\",\"build:clean\":\"shx rm -rf ./dist ./coverage ./.nyc_output\",\"lint\":\"tslint --project .\",\"test\":\"npm run build && nyc mocha --config .mocharc.json src/*.spec.js\",\"coverage\":\"codecov -F webhook --root=$PWD\",\"ref-docs:model\":\"api-extractor run\"},\"dependencies\":{\"@slack/types\":\"^1.2.1\",\"@types/node\":\">=12.0.0\",\"axios\":\"^0.21.1\"},\"devDependencies\":{\"@microsoft/api-extractor\":\"^7.3.4\",\"@types/chai\":\"^4.1.7\",\"@types/mocha\":\"^5.2.6\",\"chai\":\"^4.2.0\",\"codecov\":\"^3.2.0\",\"mocha\":\"^6.0.2\",\"nock\":\"^10.0.6\",\"nyc\":\"^14.1.1\",\"shx\":\"^0.3.2\",\"sinon\":\"^7.2.7\",\"source-map-support\":\"^0.5.10\",\"ts-node\":\"^8.0.3\",\"tslint\":\"^5.13.1\",\"tslint-config-airbnb\":\"^5.11.1\",\"typescript\":\"^4.1.0\"}}");

/***/ }),

/***/ 7907:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getURLs = exports.getRefContext = exports.getTag = exports.getBranch = exports.getPRNumber = void 0;
// --
const PR_REF_REGEX = /^refs\/pull\/(\d+)\/merge$/;
const BRANCH_REF_REGEX = /^refs\/heads\/(.+)$/;
const TAG_REF_REGEX = /^refs\/tags\/(.+)$/;
// --
function getPRNumber(ref) {
    const match = ref.match(PR_REF_REGEX);
    if (!match)
        return undefined;
    return parseInt(match[1]);
}
exports.getPRNumber = getPRNumber;
// --
function getBranch(ref) {
    const match = ref.match(BRANCH_REF_REGEX);
    if (!match)
        return undefined;
    return match[1];
}
exports.getBranch = getBranch;
// --
function getTag(ref) {
    const match = ref.match(TAG_REF_REGEX);
    if (!match)
        return undefined;
    return match[1];
}
exports.getTag = getTag;
// --
function getRefContext(ref) {
    const pr = getPRNumber(ref);
    if (pr) {
        return `PR *#${pr}*`;
    }
    const tag = getTag(ref);
    if (tag) {
        return `tag *${tag}*`;
    }
    const branch = getBranch(ref);
    if (branch) {
        return `branch *${branch}*`;
    }
    return `*${ref}*`;
}
exports.getRefContext = getRefContext;
// --
function getURLs({ GITHUB_REPOSITORY, GITHUB_SHA, GITHUB_REF, GITHUB_SERVER_URL = 'https://github.com', GITHUB_RUN_ID }) {
    const prNumber = getPRNumber(GITHUB_REF);
    return {
        repo: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}`,
        commit: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}`,
        run: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`,
        pr: prNumber
            ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/pull/${prNumber}`
            : undefined
    };
}
exports.getURLs = getURLs;


/***/ }),

/***/ 3109:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
const slack_1 = __nccwpck_require__(568);
const webhook_1 = __nccwpck_require__(1095);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = process.env.SLACK_WEBHOOK_URL;
            if (!url) {
                throw new Error('Missing SLACK_WEBHOOK_URL environment variable');
            }
            const webhook = new webhook_1.IncomingWebhook(url);
            const status = core.getInput('status');
            const env = process.env;
            core.info(core.getInput('steps'));
            if (status === 'success') {
                const msg = slack_1.success(env);
                core.debug(JSON.stringify(msg, null, 2));
                yield webhook.send(msg);
            }
            else if (status === 'failure') {
                const msg = slack_1.failure(env, JSON.parse(core.getInput('steps')));
                core.debug(JSON.stringify(msg, null, 2));
                yield webhook.send(msg);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();


/***/ }),

/***/ 568:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getActions = exports.getContext = exports.failure = exports.success = void 0;
const core = __importStar(__nccwpck_require__(2186));
const slack_block_builder_1 = __nccwpck_require__(8850);
const gha_1 = __nccwpck_require__(7907);
function success(env) {
    const { GITHUB_WORKFLOW, GITHUB_REPOSITORY } = env;
    const urls = gha_1.getURLs(env);
    const jobName = core.getInput('jobName');
    const runName = jobName ? `${GITHUB_WORKFLOW}/${jobName}` : GITHUB_WORKFLOW;
    const msg = slack_block_builder_1.Message({
        text: `✔︎ ${runName} passed on ${GITHUB_REPOSITORY}`
    }).blocks(slack_block_builder_1.Blocks.Section({
        text: `*✔︎ ${runName}* passed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`
    }));
    const context = getContext(env);
    const actions = getActions(env, 'failure');
    msg.blocks([context, actions]);
    msg.printPreviewUrl();
    return msg.buildToObject();
}
exports.success = success;
// --
function failure(env, steps) {
    const { GITHUB_WORKFLOW, GITHUB_REPOSITORY } = env;
    const urls = gha_1.getURLs(env);
    const jobName = core.getInput('jobName');
    const runName = jobName ? `${GITHUB_WORKFLOW}/${jobName}` : GITHUB_WORKFLOW;
    const msg = slack_block_builder_1.Message({
        text: `🚨 ${runName} failed on ${GITHUB_REPOSITORY}`
    }).blocks([
        slack_block_builder_1.Blocks.Section({
            text: `*🚨 ${runName}* failed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`
        })
    ]);
    if (Object.keys(steps).length > 0) {
        msg.blocks(slack_block_builder_1.Blocks.Section({
            text: Object.entries(steps)
                .map(([id, { outcome }]) => {
                const icon = {
                    failure: '✘',
                    success: '✔︎',
                    skipped: '○'
                }[outcome];
                const format = {
                    failure: '*',
                    success: '',
                    skipped: '_'
                }[outcome];
                return `${format}${icon}  ${id}${format}`;
            })
                .join('\n')
        }));
    }
    const context = getContext(env);
    const actions = getActions(env, 'failure');
    msg.blocks([context, actions]);
    msg.printPreviewUrl();
    return msg.buildToObject();
}
exports.failure = failure;
// --
function getContext(env) {
    const urls = gha_1.getURLs(env);
    const shortSha = env.GITHUB_SHA.slice(0, 8);
    return slack_block_builder_1.Blocks.Context().elements([
        `From <${urls.commit}|\`${shortSha}\`> on ${gha_1.getRefContext(env.GITHUB_REF)}`,
        `Triggered by *${env.GITHUB_EVENT_NAME}*`
        // ...(duration ? [`Took *${duration}*`] : [])
    ]);
}
exports.getContext = getContext;
// --
function getActions(env, status) {
    const urls = gha_1.getURLs(env);
    const viewWorkflowButton = slack_block_builder_1.Elements.Button({
        text: status === 'failure' ? 'View Failed Workflow' : 'View Workflow',
        url: urls.run
    });
    const actions = slack_block_builder_1.Blocks.Actions().elements(status === 'failure'
        ? viewWorkflowButton.danger()
        : viewWorkflowButton.end());
    if (urls.pr !== undefined) {
        const prNumber = gha_1.getPRNumber(env.GITHUB_REF);
        actions.elements(slack_block_builder_1.Elements.Button({
            text: `View Pull Request #${prNumber}`,
            url: urls.pr
        }));
    }
    return actions;
}
exports.getActions = getActions;


/***/ }),

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3178:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IncomingWebhook = void 0;
const axios_1 = __importDefault(__nccwpck_require__(6545));
const errors_1 = __nccwpck_require__(8564);
const instrument_1 = __nccwpck_require__(8645);
/**
 * A client for Slack's Incoming Webhooks
 */
class IncomingWebhook {
    constructor(url, defaults = {}) {
        if (url === undefined) {
            throw new Error('Incoming webhook URL is required');
        }
        this.url = url;
        this.defaults = defaults;
        this.axios = axios_1.default.create({
            baseURL: url,
            httpAgent: defaults.agent,
            httpsAgent: defaults.agent,
            maxRedirects: 0,
            proxy: false,
            headers: {
                'User-Agent': instrument_1.getUserAgent(),
            },
        });
        delete this.defaults.agent;
    }
    /**
     * Send a notification to a conversation
     * @param message - the message (a simple string, or an object describing the message)
     */
    async send(message) {
        // NOTE: no support for TLS config
        let payload = Object.assign({}, this.defaults);
        if (typeof message === 'string') {
            payload.text = message;
        }
        else {
            payload = Object.assign(payload, message);
        }
        try {
            const response = await this.axios.post(this.url, payload);
            return this.buildResult(response);
        }
        catch (error) {
            // Wrap errors in this packages own error types (abstract the implementation details' types)
            if (error.response !== undefined) {
                throw errors_1.httpErrorWithOriginal(error);
            }
            else if (error.request !== undefined) {
                throw errors_1.requestErrorWithOriginal(error);
            }
            else {
                throw error;
            }
        }
    }
    /**
     * Processes an HTTP response into an IncomingWebhookResult.
     */
    buildResult(response) {
        return {
            text: response.data,
        };
    }
}
exports.IncomingWebhook = IncomingWebhook;
//# sourceMappingURL=IncomingWebhook.js.map

/***/ }),

/***/ 8564:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.httpErrorWithOriginal = exports.requestErrorWithOriginal = exports.ErrorCode = void 0;
/**
 * A dictionary of codes for errors produced by this package
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["RequestError"] = "slack_webhook_request_error";
    ErrorCode["HTTPError"] = "slack_webhook_http_error";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
/**
 * Factory for producing a {@link CodedError} from a generic error
 */
function errorWithCode(error, code) {
    // NOTE: might be able to return something more specific than a CodedError with conditional typing
    const codedError = error;
    codedError.code = code;
    return codedError;
}
/**
 * A factory to create IncomingWebhookRequestError objects
 * @param original The original error
 */
function requestErrorWithOriginal(original) {
    const error = errorWithCode(new Error(`A request error occurred: ${original.message}`), ErrorCode.RequestError);
    error.original = original;
    return error;
}
exports.requestErrorWithOriginal = requestErrorWithOriginal;
/**
 * A factory to create IncomingWebhookHTTPError objects
 * @param original The original error
 */
function httpErrorWithOriginal(original) {
    const error = errorWithCode(new Error(`An HTTP protocol error occurred: statusCode = ${original.response.status}`), ErrorCode.HTTPError);
    error.original = original;
    return error;
}
exports.httpErrorWithOriginal = httpErrorWithOriginal;
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ 1095:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/// <reference lib="es2017" />
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorCode = exports.IncomingWebhook = void 0;
var IncomingWebhook_1 = __nccwpck_require__(3178);
Object.defineProperty(exports, "IncomingWebhook", ({ enumerable: true, get: function () { return IncomingWebhook_1.IncomingWebhook; } }));
var errors_1 = __nccwpck_require__(8564);
Object.defineProperty(exports, "ErrorCode", ({ enumerable: true, get: function () { return errors_1.ErrorCode; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 8645:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserAgent = exports.addAppMetadata = void 0;
const os = __importStar(__nccwpck_require__(2087));
const packageJson = __nccwpck_require__(7716); // tslint:disable-line:no-require-imports no-var-requires
/**
 * Replaces occurrences of '/' with ':' in a string, since '/' is meaningful inside User-Agent strings as a separator.
 */
function replaceSlashes(s) {
    return s.replace('/', ':');
}
const baseUserAgent = `${replaceSlashes(packageJson.name)}/${packageJson.version} ` +
    `node/${process.version.replace('v', '')} ` +
    `${os.platform()}/${os.release()}`;
const appMetadata = {};
/**
 * Appends the app metadata into the User-Agent value
 * @param appMetadata.name name of tool to be counted in instrumentation
 * @param appMetadata.version version of tool to be counted in instrumentation
 */
function addAppMetadata({ name, version }) {
    appMetadata[replaceSlashes(name)] = version;
}
exports.addAppMetadata = addAppMetadata;
/**
 * Returns the current User-Agent value for instrumentation
 */
function getUserAgent() {
    const appIdentifier = Object.entries(appMetadata).map(([name, version]) => `${name}/${version}`).join(' ');
    // only prepend the appIdentifier when its not empty
    return ((appIdentifier.length > 0) ? `${appIdentifier} ` : '') + baseUserAgent;
}
exports.getUserAgent = getUserAgent;
//# sourceMappingURL=instrument.js.map

/***/ }),

/***/ 6545:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(2618);

/***/ }),

/***/ 8104:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var settle = __nccwpck_require__(3211);
var buildFullPath = __nccwpck_require__(1934);
var buildURL = __nccwpck_require__(646);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var httpFollow = __nccwpck_require__(7707).http;
var httpsFollow = __nccwpck_require__(7707).https;
var url = __nccwpck_require__(8835);
var zlib = __nccwpck_require__(8761);
var pkg = __nccwpck_require__(696);
var createError = __nccwpck_require__(5226);
var enhanceError = __nccwpck_require__(1516);

var isHttps = /https:?/;

/**
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} proxy
 * @param {string} location
 */
function setProxy(options, proxy, location) {
  options.hostname = proxy.host;
  options.host = proxy.host;
  options.port = proxy.port;
  options.path = location;

  // Basic proxy authorization
  if (proxy.auth) {
    var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
    options.headers['Proxy-Authorization'] = 'Basic ' + base64;
  }

  // If a proxy is used, any redirects must also pass through the proxy
  options.beforeRedirect = function beforeRedirect(redirection) {
    redirection.headers.host = redirection.host;
    setProxy(redirection, proxy, redirection.href);
  };
}

/*eslint consistent-return:0*/
module.exports = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var resolve = function resolve(value) {
      resolvePromise(value);
    };
    var reject = function reject(value) {
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) {
        // Nothing to do...
      } else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var fullPath = buildFullPath(config.baseURL, config.url);
    var parsed = url.parse(fullPath);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      agents: { http: config.httpAgent, https: config.httpsAgent },
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }

        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port,
            protocol: parsedProxyUrl.protocol
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      setProxy(options, proxy, protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path);
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxBodyLength > -1) {
      options.maxBodyLength = config.maxBodyLength;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;

      // return the last request in case of redirects
      var lastRequest = res.req || req;


      // if no content, is HEAD request or decompress disabled we should not decompress
      if (res.statusCode !== 204 && lastRequest.method !== 'HEAD' && config.decompress !== false) {
        switch (res.headers['content-encoding']) {
        /*eslint default-case:0*/
        case 'gzip':
        case 'compress':
        case 'deflate':
        // add the unzipper to the body stream processing pipeline
          stream = stream.pipe(zlib.createUnzip());

          // remove the content-encoding in order to not confuse downstream operations
          delete res.headers['content-encoding'];
          break;
        }
      }

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
            if (!config.responseEncoding || config.responseEncoding === 'utf8') {
              responseData = utils.stripBOM(responseData);
            }
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted && err.code !== 'ERR_FR_TOO_MANY_REDIRECTS') return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
      // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
      // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
      // And then these socket which be hang up will devoring CPU little by little.
      // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
      req.setTimeout(config.timeout, function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      });
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};


/***/ }),

/***/ 3454:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var settle = __nccwpck_require__(3211);
var cookies = __nccwpck_require__(1545);
var buildURL = __nccwpck_require__(646);
var buildFullPath = __nccwpck_require__(1934);
var parseHeaders = __nccwpck_require__(6455);
var isURLSameOrigin = __nccwpck_require__(3608);
var createError = __nccwpck_require__(5226);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 2618:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var bind = __nccwpck_require__(7065);
var Axios = __nccwpck_require__(8178);
var mergeConfig = __nccwpck_require__(4831);
var defaults = __nccwpck_require__(8190);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __nccwpck_require__(8875);
axios.CancelToken = __nccwpck_require__(1587);
axios.isCancel = __nccwpck_require__(4057);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __nccwpck_require__(4850);

// Expose isAxiosError
axios.isAxiosError = __nccwpck_require__(650);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ 8875:
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ 1587:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var Cancel = __nccwpck_require__(8875);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 4057:
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 8178:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var buildURL = __nccwpck_require__(646);
var InterceptorManager = __nccwpck_require__(3214);
var dispatchRequest = __nccwpck_require__(5062);
var mergeConfig = __nccwpck_require__(4831);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ 3214:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 1934:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var isAbsoluteURL = __nccwpck_require__(1301);
var combineURLs = __nccwpck_require__(7189);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 5226:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var enhanceError = __nccwpck_require__(1516);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ 5062:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var transformData = __nccwpck_require__(9812);
var isCancel = __nccwpck_require__(4057);
var defaults = __nccwpck_require__(8190);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 1516:
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ 4831:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ 3211:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var createError = __nccwpck_require__(5226);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 9812:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ 8190:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);
var normalizeHeaderName = __nccwpck_require__(6240);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __nccwpck_require__(3454);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __nccwpck_require__(8104);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ 7065:
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 646:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 7189:
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 1545:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 1301:
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 650:
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ 3608:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 6240:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 6455:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var utils = __nccwpck_require__(328);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 4850:
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 328:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


var bind = __nccwpck_require__(7065);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ 8222:
/***/ ((module, exports, __nccwpck_require__) => {

/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};


/***/ }),

/***/ 6243:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = __nccwpck_require__(900);
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => enableOverride === null ? createDebug.enabled(namespace) : enableOverride,
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;


/***/ }),

/***/ 8237:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer' || process.browser === true || process.__nwjs) {
	module.exports = __nccwpck_require__(8222);
} else {
	module.exports = __nccwpck_require__(5332);
}


/***/ }),

/***/ 5332:
/***/ ((module, exports, __nccwpck_require__) => {

/**
 * Module dependencies.
 */

const tty = __nccwpck_require__(3867);
const util = __nccwpck_require__(1669);

/**
 * This is the Node.js implementation of `debug()`.
 */

exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(
	() => {},
	'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.'
);

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

try {
	// Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
	// eslint-disable-next-line import/no-extraneous-dependencies
	const supportsColor = __nccwpck_require__(9318);

	if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
		exports.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		];
	}
} catch (error) {
	// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(key => {
	return /^debug_/i.test(key);
}).reduce((obj, key) => {
	// Camel-case
	const prop = key
		.substring(6)
		.toLowerCase()
		.replace(/_([a-z])/g, (_, k) => {
			return k.toUpperCase();
		});

	// Coerce string value into JS value
	let val = process.env[key];
	if (/^(yes|on|true|enabled)$/i.test(val)) {
		val = true;
	} else if (/^(no|off|false|disabled)$/i.test(val)) {
		val = false;
	} else if (val === 'null') {
		val = null;
	} else {
		val = Number(val);
	}

	obj[prop] = val;
	return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
	return 'colors' in exports.inspectOpts ?
		Boolean(exports.inspectOpts.colors) :
		tty.isatty(process.stderr.fd);
}

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	const {namespace: name, useColors} = this;

	if (useColors) {
		const c = this.color;
		const colorCode = '\u001B[3' + (c < 8 ? c : '8;5;' + c);
		const prefix = `  ${colorCode};1m${name} \u001B[0m`;

		args[0] = prefix + args[0].split('\n').join('\n' + prefix);
		args.push(colorCode + 'm+' + module.exports.humanize(this.diff) + '\u001B[0m');
	} else {
		args[0] = getDate() + name + ' ' + args[0];
	}
}

function getDate() {
	if (exports.inspectOpts.hideDate) {
		return '';
	}
	return new Date().toISOString() + ' ';
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log(...args) {
	return process.stderr.write(util.format(...args) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	if (namespaces) {
		process.env.DEBUG = namespaces;
	} else {
		// If you set a process.env field to null or undefined, it gets cast to the
		// string 'null' or 'undefined'. Just delete instead.
		delete process.env.DEBUG;
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
	return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init(debug) {
	debug.inspectOpts = {};

	const keys = Object.keys(exports.inspectOpts);
	for (let i = 0; i < keys.length; i++) {
		debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
	}
}

module.exports = __nccwpck_require__(6243)(exports);

const {formatters} = module.exports;

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

formatters.o = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts)
		.split('\n')
		.map(str => str.trim())
		.join(' ');
};

/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */

formatters.O = function (v) {
	this.inspectOpts.colors = this.useColors;
	return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 1133:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var debug;

module.exports = function () {
  if (!debug) {
    try {
      /* eslint global-require: off */
      debug = __nccwpck_require__(8237)("follow-redirects");
    }
    catch (error) {
      debug = function () { /* */ };
    }
  }
  debug.apply(null, arguments);
};


/***/ }),

/***/ 7707:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var url = __nccwpck_require__(8835);
var URL = url.URL;
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var Writable = __nccwpck_require__(2413).Writable;
var assert = __nccwpck_require__(2357);
var debug = __nccwpck_require__(1133);

// Create handlers that pass events from native requests
var eventHandlers = Object.create(null);
["abort", "aborted", "connect", "error", "socket", "timeout"].forEach(function (event) {
  eventHandlers[event] = function (arg1, arg2, arg3) {
    this._redirectable.emit(event, arg1, arg2, arg3);
  };
});

// Error types with codes
var RedirectionError = createErrorType(
  "ERR_FR_REDIRECTION_FAILURE",
  ""
);
var TooManyRedirectsError = createErrorType(
  "ERR_FR_TOO_MANY_REDIRECTS",
  "Maximum number of redirects exceeded"
);
var MaxBodyLengthExceededError = createErrorType(
  "ERR_FR_MAX_BODY_LENGTH_EXCEEDED",
  "Request body larger than maxBodyLength limit"
);
var WriteAfterEndError = createErrorType(
  "ERR_STREAM_WRITE_AFTER_END",
  "write after end"
);

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  this._sanitizeOptions(options);
  this._options = options;
  this._ended = false;
  this._ending = false;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Writing is not allowed if end has been called
  if (this._ending) {
    throw new WriteAfterEndError();
  }

  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
    throw new TypeError("data should be a string, Buffer or Uint8Array");
  }
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new MaxBodyLengthExceededError());
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  }
  else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Write data if needed and end
  if (!data) {
    this._ended = this._ending = true;
    this._currentRequest.end(null, null, callback);
  }
  else {
    var self = this;
    var currentRequest = this._currentRequest;
    this.write(data, encoding, function () {
      self._ended = true;
      currentRequest.end(null, null, callback);
    });
    this._ending = true;
  }
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function (msecs, callback) {
  if (callback) {
    this.once("timeout", callback);
  }

  if (this.socket) {
    startTimer(this, msecs);
  }
  else {
    var self = this;
    this._currentRequest.once("socket", function () {
      startTimer(self, msecs);
    });
  }

  this.once("response", clearTimer);
  this.once("error", clearTimer);

  return this;
};

function startTimer(request, msecs) {
  clearTimeout(request._timeout);
  request._timeout = setTimeout(function () {
    request.emit("timeout");
  }, msecs);
}

function clearTimer() {
  clearTimeout(this._timeout);
}

// Proxy all other public ClientRequest methods
[
  "abort", "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

RedirectableRequest.prototype._sanitizeOptions = function (options) {
  // Ensure headers are always present
  if (!options.headers) {
    options.headers = {};
  }

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }
};


// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new TypeError("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url.format(this._options);

  // Set up event handlers
  request._redirectable = this;
  for (var event in eventHandlers) {
    /* istanbul ignore else */
    if (event) {
      request.on(event, eventHandlers[event]);
    }
  }

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end.
    var i = 0;
    var self = this;
    var buffers = this._requestBodyBuffers;
    (function writeNext(error) {
      // Only write if this request has not been redirected yet
      /* istanbul ignore else */
      if (request === self._currentRequest) {
        // Report any write errors
        /* istanbul ignore if */
        if (error) {
          self.emit("error", error);
        }
        // Write the next buffer if there are still left
        else if (i < buffers.length) {
          var buffer = buffers[i++];
          /* istanbul ignore else */
          if (!request.finished) {
            request.write(buffer.data, buffer.encoding, writeNext);
          }
        }
        // End the request if `end` has been called on us
        else if (self._ended) {
          request.end();
        }
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  var statusCode = response.statusCode;
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.
  var location = response.headers.location;
  if (location && this._options.followRedirects !== false &&
      statusCode >= 300 && statusCode < 400) {
    // Abort the current request
    this._currentRequest.removeAllListeners();
    this._currentRequest.on("error", noop);
    this._currentRequest.abort();
    // Discard the remainder of the response to avoid waiting for data
    response.destroy();

    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new TooManyRedirectsError());
      return;
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" ||
        // RFC7231§6.4.4: The 303 (See Other) status code indicates that
        // the server is redirecting the user agent to a different resource […]
        // A user agent can perform a retrieval request targeting that URI
        // (a GET or HEAD request if using HTTP) […]
        (statusCode === 303) && !/^(?:GET|HEAD)$/.test(this._options.method)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      removeMatchingHeaders(/^content-/i, this._options.headers);
    }

    // Drop the Host header, as the redirect might lead to a different host
    var previousHostName = removeMatchingHeaders(/^host$/i, this._options.headers) ||
      url.parse(this._currentUrl).hostname;

    // Create the redirected request
    var redirectUrl = url.resolve(this._currentUrl, location);
    debug("redirecting to", redirectUrl);
    this._isRedirect = true;
    var redirectUrlParts = url.parse(redirectUrl);
    Object.assign(this._options, redirectUrlParts);

    // Drop the Authorization header if redirecting to another host
    if (redirectUrlParts.hostname !== previousHostName) {
      removeMatchingHeaders(/^authorization$/i, this._options.headers);
    }

    // Evaluate the beforeRedirect callback
    if (typeof this._options.beforeRedirect === "function") {
      var responseDetails = { headers: response.headers };
      try {
        this._options.beforeRedirect.call(null, this._options, responseDetails);
      }
      catch (err) {
        this.emit("error", err);
        return;
      }
      this._sanitizeOptions(this._options);
    }

    // Perform the redirected request
    try {
      this._performRequest();
    }
    catch (cause) {
      var error = new RedirectionError("Redirected request failed: " + cause.message);
      error.cause = cause;
      this.emit("error", error);
    }
  }
  else {
    // The response is not a redirect; return it as-is
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    function request(input, options, callback) {
      // Parse parameters
      if (typeof input === "string") {
        var urlStr = input;
        try {
          input = urlToOptions(new URL(urlStr));
        }
        catch (err) {
          /* istanbul ignore next */
          input = url.parse(urlStr);
        }
      }
      else if (URL && (input instanceof URL)) {
        input = urlToOptions(input);
      }
      else {
        callback = options;
        options = input;
        input = { protocol: protocol };
      }
      if (typeof options === "function") {
        callback = options;
        options = null;
      }

      // Set defaults
      options = Object.assign({
        maxRedirects: exports.maxRedirects,
        maxBodyLength: exports.maxBodyLength,
      }, input, options);
      options.nativeProtocols = nativeProtocols;

      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug("options", options);
      return new RedirectableRequest(options, callback);
    }

    // Executes a GET request, following redirects
    function get(input, options, callback) {
      var wrappedRequest = wrappedProtocol.request(input, options, callback);
      wrappedRequest.end();
      return wrappedRequest;
    }

    // Expose the properties on the wrapped protocol
    Object.defineProperties(wrappedProtocol, {
      request: { value: request, configurable: true, enumerable: true, writable: true },
      get: { value: get, configurable: true, enumerable: true, writable: true },
    });
  });
  return exports;
}

/* istanbul ignore next */
function noop() { /* empty */ }

// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
  var options = {
    protocol: urlObject.protocol,
    hostname: urlObject.hostname.startsWith("[") ?
      /* istanbul ignore next */
      urlObject.hostname.slice(1, -1) :
      urlObject.hostname,
    hash: urlObject.hash,
    search: urlObject.search,
    pathname: urlObject.pathname,
    path: urlObject.pathname + urlObject.search,
    href: urlObject.href,
  };
  if (urlObject.port !== "") {
    options.port = Number(urlObject.port);
  }
  return options;
}

function removeMatchingHeaders(regex, headers) {
  var lastValue;
  for (var header in headers) {
    if (regex.test(header)) {
      lastValue = headers[header];
      delete headers[header];
    }
  }
  return lastValue;
}

function createErrorType(code, defaultMessage) {
  function CustomError(message) {
    Error.captureStackTrace(this, this.constructor);
    this.message = message || defaultMessage;
  }
  CustomError.prototype = new Error();
  CustomError.prototype.constructor = CustomError;
  CustomError.prototype.name = "Error [" + code + "]";
  CustomError.prototype.code = code;
  return CustomError;
}

// Exports
module.exports = wrap({ http: http, https: https });
module.exports.wrap = wrap;


/***/ }),

/***/ 1621:
/***/ ((module) => {

"use strict";


module.exports = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 900:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}


/***/ }),

/***/ 8417:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Bit } = __nccwpck_require__(912);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { props } = __nccwpck_require__(8345);

class AttachmentDto extends SlackDto {
  constructor(params) {
    super();

    this.color = params.color;
    this.fallback = params.fallback;
    this.blocks = params.blocks;

    this.pruneAndFreeze();
  }
}

class Attachment extends Bit {
  constructor(params = {}) {
    super();

    this.props.color = params.color;
    this.props.fallback = params.fallback;

    this.finalizeConstruction();
  }

  /**
   * Sets the color of the border to the left of the block quote for the Attachment
   *
   * {@link https://api.slack.com/reference/messaging/attachments|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  color(string) {
    return this.set(string, props.color);
  }

  /**
   * Sets the plain text summary of the attachment used in clients that don't show formatted text (eg. IRC, mobile notifications).
   *
   * {@link https://api.slack.com/reference/messaging/attachments|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  fallback(string) {
    return this.set(string, props.fallback);
  }

  /**
   * Adds Blocks to the Attachment object
   *
   * {@link https://api.slack.com/reference/messaging/attachments|View in Slack API Documentation}
   *
   * @param {...Block|Array<Block>} blocks Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  blocks(...blocks) {
    return this.append(blocks.flat(), props.blocks);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      blocks: BuilderHelper.getBuilderResults(this.props.blocks),
    };

    return this.getResult(AttachmentDto, augmentedProps);
  }
}

module.exports = {
  Attachment,
  AttachmentDto,
};


/***/ }),

/***/ 1651:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Builder } = __nccwpck_require__(3366);
const { categories } = __nccwpck_require__(8345);

class Bit extends Builder {
  constructor() {
    super();

    this.category = categories.bit;
  }

  /**
   * Performs no alterations to the object. Meant to simulate a closing
   * HTML tag for those who prefer the look of such code.
   *
   * @return {this} The instance on which the method is called
   */

  end() {
    return this;
  }
}

module.exports = Bit;


/***/ }),

/***/ 912:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Bit = __nccwpck_require__(1651);

module.exports = {
  Bit,
};


/***/ }),

/***/ 9146:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Bit } = __nccwpck_require__(912);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { props, enumValues } = __nccwpck_require__(8345);

class ConfirmationDialogDto extends SlackDto {
  constructor(params) {
    super();

    this.title = params.title;
    this.text = params.text;
    this.confirm = params.confirm;
    this.deny = params.deny;
    this.style = params.style;

    this.pruneAndFreeze();
  }
}

class ConfirmationDialog extends Bit {
  constructor(params = {}) {
    super();

    this.props.title = params.title;
    this.props.text = params.text;
    this.props.confirm = params.confirm;
    this.props.deny = params.deny;

    this.finalizeConstruction();
  }

  /**
   * Sets the title displayed in the confirmation dialog
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 100 characters
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#confirm|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  title(string) {
    return this.set(string, props.title);
  }

  /**
   * Sets the textual content of the confirmation dialog
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 300 characters
   *    * Supports markdown
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#confirm|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  text(string) {
    return this.set(string, props.text);
  }

  /**
   * Sets the copy for the button that confirms the action.
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 30 characters
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#confirm|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  confirm(string) {
    return this.set(string, props.confirm);
  }

  /**
   * Sets the copy for the button that cancels the action.
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 30 characters
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#confirm|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  deny(string) {
    return this.set(string, props.deny);
  }

  /**
   * Sets the 'style' parameter to 'primary', making the
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#confirm|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  primary() {
    return this.set(enumValues.primary, props.style);
  }

  /**
   * Sets 'style' parameter to 'danger'
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#confirm|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  danger() {
    return this.set(enumValues.danger, props.style);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      text: BuilderHelper.getMarkdownObject(this.props.text),
      title: BuilderHelper.getPlainTextObject(this.props.title),
      confirm: BuilderHelper.getPlainTextObject(this.props.confirm),
      deny: BuilderHelper.getPlainTextObject(this.props.deny),
    };

    return this.getResult(ConfirmationDialogDto, augmentedProps);
  }
}

module.exports = {
  ConfirmationDialogDto,
  ConfirmationDialog,
};


/***/ }),

/***/ 7711:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { ConfirmationDialog, ConfirmationDialogDto } = __nccwpck_require__(9146);
const { Option, OptionDto } = __nccwpck_require__(1180);
const { OptionGroup, OptionGroupDto } = __nccwpck_require__(2782);
const { Attachment, AttachmentDto } = __nccwpck_require__(8417);

const BitDto = {
  ConfirmationDialogDto,
  OptionDto,
  OptionGroupDto,
  AttachmentDto,
};

const getBits = (config) => {
  const getInstance = (Class, params) => new Class(params, config);

  return {

    /**
     * Creates and returns a ConfirmationDialog Bit
     *
     * {@link https://api.slack.com/reference/block-kit/composition-objects#confirm|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.title] Sets the title displayed in the confirmation dialog
     * @param {string} [params.text] Sets the textual content of the confirmation dialog
     * @param {string} [params.confirm] Sets the text for the button that confirms the action.
     * @param {string} [params.deny]Sets the text for the button that cancels the action.
     * @return {ConfirmationDialog} An instance of ConfirmationDialog
     */

    ConfirmationDialog: (params) => getInstance(ConfirmationDialog, params),

    /**
     * Creates and returns an Option Bit
     *
     * {@link https://api.slack.com/reference/block-kit/composition-objects#option|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.text] Sets the text displayed in the menu for the current Option
     * @param {string} [params.value] Sets the value passed to your app when this Option is clicked or submitted
     * @param {string} [params.description] Sets a description shown next to the Option in a RadioButton Element
     * @param {string} [params.url] Sets the URL to redirect the user to when this Option is clicked (in an OverflowMenu)
     * @return {Option} An instance of Option
     */

    Option: (params) => getInstance(Option, params),

    /**
     * Creates and returns an OptionGroup Bit
     *
     * {@link https://api.slack.com/reference/block-kit/composition-objects#option_group|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.label] Sets the label shown above the group of Options
     * @return {OptionGroup} An instance of OptionsGroup
     */

    OptionGroup: (params) => getInstance(OptionGroup, params),

    /**
     * Creates and returns an Attachment Bit that can be attached to Message objects
     *
     * {@link https://api.slack.com/reference/messaging/attachments|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.color] Sets the color of the block quote border
     * @return {Attachment} An instance of Attachment
     */

    Attachment: (params) => getInstance(Attachment, params),
  };
};

module.exports = {
  ConfirmationDialog,
  Option,
  OptionGroup,
  Attachment,
  BitDto,
  getBits,
};


/***/ }),

/***/ 2782:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Bit } = __nccwpck_require__(912);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { props } = __nccwpck_require__(8345);

class OptionGroupDto extends SlackDto {
  constructor(params) {
    super();

    this.label = params.label;
    this.options = params.options;

    this.pruneAndFreeze();
  }
}

class OptionGroup extends Bit {
  constructor(params = {}) {
    super();

    this.props.label = params.label;

    this.finalizeConstruction();
  }

  /**
   * Sets the label shown above the group of Options
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 75 characters
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#option_group|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  label(string) {
    return this.set(string, props.label);
  }

  /**
   * Sets the Options displayed in this OptionGroup
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 100 Options
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#option_group|View in Slack API Documentation}
   *
   * @param {...Option|Array<Option>} options Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  options(...options) {
    return this.append(options.flat(), props.options);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      label: BuilderHelper.getPlainTextObject(this.props.label),
      options: BuilderHelper.getBuilderResults(this.props.options),
    };

    return this.getResult(OptionGroupDto, augmentedProps);
  }
}

module.exports = {
  OptionGroup,
  OptionGroupDto,
};


/***/ }),

/***/ 1180:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Bit } = __nccwpck_require__(912);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { props } = __nccwpck_require__(8345);

class OptionDto extends SlackDto {
  constructor(params) {
    super();

    this.text = params.text;
    this.value = params.value;
    this.description = params.description;
    this.url = params.url;

    this.pruneAndFreeze();
  }
}

class Option extends Bit {
  constructor(params = {}) {
    super();

    this.props.text = params.text;
    this.props.value = params.value;
    this.props.description = params.description;
    this.props.url = params.url;

    this.finalizeConstruction();
  }

  /**
   * Sets the text displayed in the menu for the current Option
   *
   *    * **Required** ⚠
   *    * Max 75 characters.
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#option|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  text(string) {
    return this.set(string, props.text);
  }

  /**
   * Sets the value passed to your app when this Option is clicked or submitted
   *
   *    * **Required** ⚠
   *    * Max 75 characters
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#option|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  value(string) {
    return this.set(string, props.value);
  }

  /**
   * Sets a description shown next to the Option in a RadioButton Element
   *
   * **Slack Validation Rules:**
   *    * Max 3000 characters
   *    * Only available for RadioButtons ⚠
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#option|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  description(string) {
    return this.set(string, props.description);
  }

  /**
   * Sets the URL to redirect the user to when this Option is clicked (in an OverflowMenu)
   *
   * **Slack Validation Rules:**
   *    * Max 3000 characters
   *    * Only available for Options in an OverflowMenu ⚠
   *
   * {@link https://api.slack.com/reference/block-kit/composition-objects#option|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  url(string) {
    return this.set(string, props.url);
  }

  /**
   * @private
   */

  build({ isMarkdown } = { isMarkdown: false }) {
    const augmentedProps = {
      text: isMarkdown
        ? BuilderHelper.getMarkdownObject(this.props.text)
        : BuilderHelper.getPlainTextObject(this.props.text),
      description: isMarkdown
        ? BuilderHelper.getMarkdownObject(this.props.description)
        : BuilderHelper.getPlainTextObject(this.props.description),
    };

    return this.getResult(OptionDto, augmentedProps);
  }
}

module.exports = {
  Option,
  OptionDto,
};


/***/ }),

/***/ 4945:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Block } = __nccwpck_require__(3347);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class ActionsDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.blocks.actions;
    this.elements = params.elements;
    this.block_id = params.blockId;

    this.pruneAndFreeze();
  }
}

class Actions extends Block {
  constructor(params = {}) {
    super();

    this.props.blockId = params.blockId;

    this.finalizeConstruction();
  }

  /**
   * Sets the interactive Elements of the Actions Block
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 5 Elements
   *    * Supports Buttons, Selects, Overflows, and DatePickers
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#actions|View in Slack API Documentation}
   *
   * @param {...Element|Array<Element>} elements Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  elements(...elements) {
    return this.append(elements.flat(), props.elements);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      elements: BuilderHelper.getBuilderResults(this.props.elements),
    };

    return this.getResult(ActionsDto, augmentedProps);
  }
}

module.exports = {
  Actions,
  ActionsDto,
};


/***/ }),

/***/ 1684:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Builder } = __nccwpck_require__(3366);
const { props, categories } = __nccwpck_require__(8345);

class Block extends Builder {
  constructor() {
    super();

    this.category = categories.block;
  }

  /**
   * Sets a string to be an identifier for the block, that
   * will be available in interaction payloads
   *
   * **Slack Validation Rules:**
   *    * Max 255 characters
   *    * Must be unique to the view
   *    * If a Block changes, blockId property should change, too
   *
   * {@link https://api.slack.com/reference/block-kit/blocks|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  blockId(string) {
    return this.set(string, props.blockId);
  }

  /**
   * Performs no alterations to the object. Meant to simulate a closing
   * HTML tag for those who prefer the look of such code.
   *
   * @return {this} The instance on which the method is called
   */

  end() {
    return this;
  }
}
module.exports = Block;


/***/ }),

/***/ 3347:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Block = __nccwpck_require__(1684);

module.exports = {
  Block,
};


/***/ }),

/***/ 5298:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Block } = __nccwpck_require__(3347);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class ContextDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.blocks.context;
    this.elements = params.elements;
    this.block_id = params.blockId;

    this.pruneAndFreeze();
  }
}

class Context extends Block {
  constructor(params = {}) {
    super();

    this.props.blockId = params.blockId;

    this.finalizeConstruction();
  }

  /**
   * Sets the interactive Elements of the Context block
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 10 Elements
   *    * Supports strings and Image Elements
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#context|View in Slack API Documentation}
   *
   * @param {...(string|Img)|Array<(string|Img)>} elements Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  elements(...elements) {
    return this.append(elements.flat(), props.elements);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      elements: BuilderHelper.getElementsForContext(this.props.elements),
    };

    return this.getResult(ContextDto, augmentedProps);
  }
}

module.exports = {
  Context,
  ContextDto,
};


/***/ }),

/***/ 9733:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Block } = __nccwpck_require__(3347);
const { SlackDto } = __nccwpck_require__(3366);
const { types } = __nccwpck_require__(8345);

class DividerDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.blocks.divider;
    this.block_id = params.blockId;

    this.pruneAndFreeze();
  }
}

class Divider extends Block {
  constructor(params = {}) {
    super();

    this.props.blockId = params.blockId;

    this.finalizeConstruction();
  }

  /**
   * @private
   */

  build() {
    return this.getResult(DividerDto);
  }
}

/**
 * {@link https://api.slack.com/reference/block-kit/blocks#divider|View in Slack API Documentation}
 */

module.exports = {
  Divider,
  DividerDto,
};


/***/ }),

/***/ 4018:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Block } = __nccwpck_require__(3347);
const { SlackDto } = __nccwpck_require__(3366);
const { types, enumValues, props } = __nccwpck_require__(8345);

class FileDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.blocks.file;
    this.source = enumValues.remote;
    this.external_id = params.externalId;
    this.block_id = params.blockId;

    this.pruneAndFreeze();
  }
}

class File extends Block {
  constructor(params = {}) {
    super();

    this.props.externalId = params.externalId;
    this.props.blockId = params.blockId;

    this.finalizeConstruction();
  }

  /**
   * Sets the Slack-provided ID for the external file
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#file|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  externalId(string) {
    return this.set(string, props.externalId);
  }

  /**
   * @private
   */

  build() {
    return this.getResult(FileDto);
  }
}

module.exports = {
  File,
  FileDto,
};


/***/ }),

/***/ 2979:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Block } = __nccwpck_require__(3347);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class HeaderDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.blocks.header;
    this.text = params.text;
    this.block_id = params.blockId;

    this.pruneAndFreeze();
  }
}

class Header extends Block {
  constructor(params = {}) {
    super();

    this.props.text = params.text;
    this.props.blockId = params.blockId;

    this.finalizeConstruction();
  }

  /**
   * Sets the text to be displayed in the Header Block
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 3000 characters
   *    * Plain text only
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#header|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  text(string) {
    return this.set(string, props.text);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      text: BuilderHelper.getPlainTextObject(this.props.text),
    };

    return this.getResult(HeaderDto, augmentedProps);
  }
}

module.exports = {
  Header,
  HeaderDto,
};


/***/ }),

/***/ 8210:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Block } = __nccwpck_require__(3347);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class ImageDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.blocks.image;
    this.image_url = params.imageUrl;
    this.alt_text = params.altText;
    this.title = params.title;
    this.block_id = params.blockId;

    this.pruneAndFreeze();
  }
}

class Image extends Block {
  constructor(params = {}) {
    super();

    this.props.imageUrl = params.imageUrl;
    this.props.altText = params.altText;
    this.props.title = params.title;
    this.props.blockId = params.blockId;

    this.finalizeConstruction();
  }

  /**
   * Sets the source URL to load the Image from
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 2000 characters
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#image|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  imageUrl(string) {
    return this.set(string, props.imageUrl);
  }

  /**
   * Sets the textual summary of the Image
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 2000 characters
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#image|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  altText(string) {
    return this.set(string, props.altText);
  }

  /**
   * Sets an optional title for the Image
   *
   * **Slack Validation Rules:**
   *    * Max 2000 characters
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#image|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  title(string) {
    return this.set(string, props.title);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      title: BuilderHelper.getPlainTextObject(this.props.title),
    };

    return this.getResult(ImageDto, augmentedProps);
  }
}

module.exports = {
  Image,
  ImageDto,
};


/***/ }),

/***/ 2887:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Actions, ActionsDto } = __nccwpck_require__(4945);
const { Context, ContextDto } = __nccwpck_require__(5298);
const { Divider, DividerDto } = __nccwpck_require__(9733);
const { File, FileDto } = __nccwpck_require__(4018);
const { Header, HeaderDto } = __nccwpck_require__(2979);
const { Image, ImageDto } = __nccwpck_require__(8210);
const { Input, InputDto } = __nccwpck_require__(838);
const { Section, SectionDto } = __nccwpck_require__(3027);

const BlockDto = {
  ActionsDto,
  ContextDto,
  DividerDto,
  FileDto,
  HeaderDto,
  ImageDto,
  InputDto,
  SectionDto,
};

const getBlocks = () => {
  const getInstance = (Class, params) => new Class(params);

  return {

    /**
     * Creates and returns an Actions Block
     *
     * {@link https://api.slack.com/reference/block-kit/blocks#actions|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.blockId] Sets a string to be an identifier for the block, that will be available in interaction payloads
     * @return {Actions} An instance of Actions
     */

    Actions: (params) => getInstance(Actions, params),

    /**
     * Creates and returns a Context Block
     *
     * {@link https://api.slack.com/reference/block-kit/blocks#context|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.blockId] Sets a string to be an identifier for the block, that will be available in interaction payloads
     * @return {Context} An instance of Context
     */

    Context: (params) => getInstance(Context, params),

    /**
     * Creates and returns a Divider
     *
     * {@link https://api.slack.com/reference/block-kit/blocks#divider|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.blockId] Sets a string to be an identifier for the block, that will be available in interaction payloads
     * @return {Divider} An instance of Divider
     */

    Divider: (params) => getInstance(Divider, params),

    /**
     * Creates and returns a File Block
     *
     * {@link https://api.slack.com/reference/block-kit/blocks#file|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters for File
     * @param {string} [params.blockId] Sets a string to be an identifier for the block, that will be available in interaction payloads
     * @param {string} [params.externalId] Sets the Slack-provided ID for the external file
     * @return {File} An instance of File
     */

    File: (params) => getInstance(File, params),

    /**
     * Creates and returns a Header Block
     *
     * {@link https://api.slack.com/reference/block-kit/blocks#header|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.blockId] Sets a string to be an identifier for the block, that will be available in interaction payloads
     * @param {string} [params.text] Sets the text to be displayed in the Header Block
     * @return {Section} An instance of Header
     */

    Header: (params) => getInstance(Header, params),

    /**
     * Creates and returns an Image Block
     *
     * {@link https://api.slack.com/reference/block-kit/blocks#image|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.blockId] Sets a string to be an identifier for the block, that will be available in interaction payloads
     * @param {string} [params.imageUrl] Sets the source URL to load the Image from
     * @param {string} [params.altText] Sets the textual summary of the Image
     * @param {string} [params.title] Sets an optional title for the Image
     * @return {Image} An instance of Image
     */

    Image: (params) => getInstance(Image, params),

    /**
     * Creates and returns an Input Block
     *
     * {@link https://api.slack.com/reference/block-kit/blocks#input|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.blockId] Sets a string to be an identifier for the block, that will be available in interaction payloads
     * @param {string} [params.label] Sets a label to be displayed for the Input Block
     * @param {string} [params.hint] Sets the hint to be displayed under the Input.
     * @return {Input} An instance of Input
     */

    Input: (params) => getInstance(Input, params),

    /**
     * Creates and returns a Section Block
     *
     * {@link https://api.slack.com/reference/block-kit/blocks#section|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.blockId] Sets a string to be an identifier for the block, that will be available in interaction payloads
     * @param {string} [params.text] Sets the text to be displayed in the Section Block
     * @return {Section} An instance of Section
     */

    Section: (params) => getInstance(Section, params),
  };
};

module.exports = {
  Actions,
  Context,
  Divider,
  File,
  Header,
  Image,
  Input,
  Section,
  BlockDto,
  getBlocks,
};


/***/ }),

/***/ 838:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Block } = __nccwpck_require__(3347);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class InputDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.blocks.input;
    this.label = params.label;
    this.element = params.element;
    this.dispatch_action = params.dispatchAction;
    this.block_id = params.blockId;
    this.hint = params.hint;
    this.optional = params.optional;

    this.pruneAndFreeze();
  }
}

class Input extends Block {
  constructor(params = {}) {
    super();

    this.props.label = params.label;
    this.props.blockId = params.blockId;
    this.props.hint = params.hint;

    this.finalizeConstruction();
  }

  /**
   * Sets a label to be displayed for the Input Block
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 2000 characters
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#input|View in Slack API Documentation}
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  label(string) {
    return this.set(string, props.label);
  }

  /**
   * Sets the interactive Element of the Input Block
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 1 Element
   *    * Supports TextInput, SelectMenus, MultiSelectMenus, and DatePickers
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#input|View in Slack API Documentation}
   *
   * @param {Element} element
   * @return {this} The instance on which the method is called
   */

  element(element) {
    return this.set(element, props.element);
  }

  /**
   * Sets the hint to be displayed under the Input.
   *
   * **Slack Validation Rules:**
   *    * Max 2000 characters
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#input|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  hint(string) {
    return this.set(string, props.hint);
  }

  /**
   * Sets the 'optional' parameter to true, allowing the user to submit
   * the form without inputting a value into the Input Element
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#input|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  optional() {
    return this.set(true, props.optional);
  }

  /**
   * Sets the 'dispatch_action' parameter to true, meaning an actions
   * payload is sent upon interaction.
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#input|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  dispatchAction() {
    return this.set(true, props.dispatchAction);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      label: BuilderHelper.getPlainTextObject(this.props.label),
      hint: BuilderHelper.getPlainTextObject(this.props.hint),
      element: BuilderHelper.getBuilderResult(this.props.element),
    };

    return this.getResult(InputDto, augmentedProps);
  }
}

module.exports = {
  Input,
  InputDto,
};


/***/ }),

/***/ 3027:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Block } = __nccwpck_require__(3347);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class SectionDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.blocks.section;
    this.text = params.text;
    this.block_id = params.blockId;
    this.fields = params.fields;
    this.accessory = params.accessory;

    this.pruneAndFreeze();
  }
}

class Section extends Block {
  constructor(params = {}) {
    super();

    this.props.text = params.text;
    this.props.blockId = params.blockId;

    this.finalizeConstruction();
  }

  /**
   * Sets the text to be displayed in the Section Block
   *
   * **Slack Validation Rules:**
   *    * **Required if property fields undefined** ⚠
   *    * Max 3000 characters
   *    * Supports markdown
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#section|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  text(string) {
    return this.set(string, props.text);
  }

  /**
   * Sets text fields in two columns, side-by-side
   *
   * **Slack Validation Rules:**
   *    * **Required if property text undefined** ⚠
   *    * Max 10 items
   *    * Max 2000 characters for each field
   *    * Supports markdown
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#section|View in Slack API Documentation}
   *
   * @param {...string|Array<string>} fields Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  fields(...fields) {
    return this.append(fields.flat(), props.fields);
  }

  /**
   * Sets an interactive Element to be attached to the Section Block
   *
   * **Slack Validation Rules:**
   *    * Max 1 item
   *
   * {@link https://api.slack.com/reference/block-kit/blocks#section|View in Slack API Documentation}
   *
   * @param {Element} element
   * @return {this} The instance on which the method is called
   */

  accessory(element) {
    return this.set(element, props.accessory);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      text: BuilderHelper.getMarkdownObject(this.props.text),
      fields: BuilderHelper.getFields(this.props.fields),
      accessory: BuilderHelper.getBuilderResult(this.props.accessory),
    };

    return this.getResult(SectionDto, augmentedProps);
  }
}

module.exports = {
  Section,
  SectionDto,
};


/***/ }),

/***/ 950:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Element = __nccwpck_require__(3507);
const { props } = __nccwpck_require__(8345);

/**
 * @class Make new Button
 * @abstract
 * @extends Element
 */

class ActionElement extends Element {
  /**
   * Sets a string to be an identifier for the source of
   * an action in interaction payloads
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Must be unique to view
   *    * Max 255 characters
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  actionId(string) {
    return this.set(string, props.actionId);
  }
}

module.exports = ActionElement;


/***/ }),

/***/ 4704:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ActionElement = __nccwpck_require__(950);
const { props } = __nccwpck_require__(8345);

class ConfirmableElement extends ActionElement {
  /**
   * Adds a ConfirmationDialog to be shown upon interacting with
   * the current element or submitting the view
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements|View in Slack API Documentation}
   *
   * @param {ConfirmationDialog} obj
   * @return {this} The instance on which the method is called
   */

  confirm(obj) {
    return this.set(obj, props.confirm);
  }
}

module.exports = ConfirmableElement;


/***/ }),

/***/ 3507:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Builder } = __nccwpck_require__(3366);
const { categories } = __nccwpck_require__(8345);

class Element extends Builder {
  constructor() {
    super();

    this.category = categories.element;
  }

  /**
   * Performs no alterations to the object. Meant to simulate a closing
   * HTML tag for those who prefer the look of such code.
   *
   * @return {this} The instance on which the method is called
   */

  end() {
    return this;
  }
}

module.exports = Element;


/***/ }),

/***/ 1818:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Element = __nccwpck_require__(3507);
const ActionElement = __nccwpck_require__(950);
const ConfirmableElement = __nccwpck_require__(4704);
const SelectableElement = __nccwpck_require__(3308);
const SelectElement = __nccwpck_require__(8255);
const MultiSelectElement = __nccwpck_require__(4308);

module.exports = {
  Element,
  ActionElement,
  ConfirmableElement,
  SelectableElement,
  SelectElement,
  MultiSelectElement,
};


/***/ }),

/***/ 4308:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const SelectElement = __nccwpck_require__(8255);
const { props } = __nccwpck_require__(8345);

class MultiSelectElement extends SelectElement {
  /**
   * Sets a limit to how many items the user can select in any one MultiSelect
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#multi_select|View in Slack API Documentation}
   *
   * @param {int} int
   * @return {this} The instance on which the method is called
   */

  maxSelectedItems(int) {
    return this.set(int, props.maxSelectedItems);
  }
}

module.exports = MultiSelectElement;


/***/ }),

/***/ 8255:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ConfirmableElement = __nccwpck_require__(4704);
const { props } = __nccwpck_require__(8345);

class SelectElement extends ConfirmableElement {
  /**
   * Adds the text in place of the input before selected or
   * interacted with
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 150 characters
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#select|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  placeholder(string) {
    return this.set(string, props.placeholder);
  }
}

module.exports = SelectElement;


/***/ }),

/***/ 3308:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ConfirmableElement = __nccwpck_require__(4704);
const { props } = __nccwpck_require__(8345);

class SelectableElement extends ConfirmableElement {
  /**
   * Sets the Options for the current Element
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 100 Options
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements|View in Slack API Documentation}
   *
   * @param {...Option|Array<Option>} options Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  options(...options) {
    return this.append(options.flat(), props.options);
  }
}

module.exports = SelectableElement;


/***/ }),

/***/ 9378:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { ConfirmableElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, enumValues, props } = __nccwpck_require__(8345);


class ButtonDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.button;
    this.text = params.text;
    this.action_id = params.actionId;
    this.url = params.url;
    this.value = params.value;
    this.style = params.style;
    this.confirm = params.confirm;

    this.pruneAndFreeze();
  }
}


class Button extends ConfirmableElement {
  constructor(params = {}) {
    super();

    this.props.text = params.text;
    this.props.actionId = params.actionId;
    this.props.url = params.url;
    this.props.value = params.value;

    this.finalizeConstruction();
  }

  /**
   * Sets the display text for the Button
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 75 characters
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#button|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  text(string) {
    return this.set(string, props.text);
  }

  /**
   * Sets the URL to redirect the user to when this Button is clicked
   *
   * **Slack Validation Rules:**
   *    * Max 3000 characters
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#button|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  url(string) {
    return this.set(string, props.url);
  }

  /**
   * Sets the value to be passed to your app when this Button is clicked
   *
   * **Slack Validation Rules:**
   *    * Max 2000 characters
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#button|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  value(string) {
    return this.set(string, props.value);
  }

  /**
   * Sets the style property to 'primary,' making the Button green
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#button|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  primary() {
    return this.set(enumValues.primary, props.style);
  }

  /**
   * Sets the style property to 'danger,' making the Button red
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#button|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  danger() {
    return this.set(enumValues.danger, props.style);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
      text: BuilderHelper.getPlainTextObject(this.props.text),
    };

    return this.getResult(ButtonDto, augmentedProps);
  }
}

module.exports = {
  Button,
  ButtonDto,
};


/***/ }),

/***/ 5560:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { MultiSelectElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class ChannelMultiSelectDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.multiselect.channels;
    this.placeholder = params.placeholder;
    this.action_id = params.actionId;
    this.initial_channels = params.initialChannels;
    this.confirm = params.confirm;
    this.max_selected_items = params.maxSelectedItems;

    this.pruneAndFreeze();
  }
}

class ChannelMultiSelect extends MultiSelectElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.maxSelectedItems = params.maxSelectedItems;

    this.finalizeConstruction();
  }

  /**
   * Sets the default selected items in the menu
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#channel_multi_select|View in Slack API Documentation}
   *
   * @param {...string|Array<string>} strings Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  initialChannels(...strings) {
    return this.append(strings.flat(), props.initialChannels);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(ChannelMultiSelectDto, augmentedProps);
  }
}

module.exports = {
  ChannelMultiSelect,
  ChannelMultiSelectDto,
};


/***/ }),

/***/ 8044:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { SelectElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class ChannelSelectDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.select.channels;
    this.placeholder = params.placeholder;
    this.action_id = params.actionId;
    this.initial_channel = params.initialChannel;
    this.confirm = params.confirm;
    this.response_url_enabled = params.responseUrlEnabled;

    this.pruneAndFreeze();
  }
}

class ChannelSelect extends SelectElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.initialChannel = params.initialChannel;

    this.finalizeConstruction();
  }

  /**
   * Sets the default selected item in the menu
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#channel_select|View in Slack API Documentation}
   *
   * @param {string} string Channel ID
   * @return {this} The instance on which the method is called
   */

  initialChannel(string) {
    return this.set(string, props.initialChannel);
  }

  /**
   * Sets option to true, allowing a response URL to be provided at submission
   *
   * **Slack Validation Rules:**
   *    * Only available in modals with Inputs ⚠
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#channel_select|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  responseUrlEnabled() {
    return this.set(true, props.responseUrlEnabled);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(ChannelSelectDto, augmentedProps);
  }
}

module.exports = {
  ChannelSelect,
  ChannelSelectDto,
};


/***/ }),

/***/ 8914:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { SelectableElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class CheckboxesDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.checkbox;
    this.action_id = params.actionId;
    this.options = params.options;
    this.initial_options = params.initialOptions;
    this.confirm = params.confirm;

    this.pruneAndFreeze();
  }
}

class Checkboxes extends SelectableElement {
  constructor(params = {}) {
    super();

    this.props.actionId = params.actionId;

    this.finalizeConstruction();
  }

  /**
   * Sets the default selected items in the menu
   *
   * **Slack Validation Rules:**
   *    * Must be an exact match to one of the provided options
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#checkboxes|View in Slack API Documentation}
   *
   * @param {...Option|Array<Option>} options Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  initialOptions(...options) {
    return this.append(options.flat(), props.initialOptions);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      options: BuilderHelper.getOptions(this.props.options, { isMarkdown: true }),
      initialOptions: BuilderHelper.getOptions(this.props.initialOptions, { isMarkdown: true }),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(CheckboxesDto, augmentedProps);
  }
}

module.exports = {
  Checkboxes,
  CheckboxesDto,
};


/***/ }),

/***/ 6748:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { MultiSelectElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class ConversationMultiSelectDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.multiselect.conversations;
    this.placeholder = params.placeholder;
    this.action_id = params.actionId;
    this.initial_conversations = params.initialConversations;
    this.default_to_current_conversation = params.defaultToCurrentConversation;
    this.confirm = params.confirm;
    this.max_selected_items = params.maxSelectedItems;
    this.filter = params.filter;

    this.pruneAndFreeze();
  }
}

class ConversationMultiSelect extends MultiSelectElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.maxSelectedItems = params.maxSelectedItems;

    this.finalizeConstruction();
  }

  /**
   * Sets the default selected items in the menu
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_multi_select|View in Slack API Documentation}
   *
   * @param {...string|Array<string>} strings Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  initialConversations(...strings) {
    return this.append(strings.flat(), props.initialConversations);
  }

  /**
   * Sets default selected conversation to the one currently open for the user
   *
   * **Slack Validation Rules:**
   *    * If initial conversations provided, this option is ignored
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_multi_select|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  defaultToCurrentConversation() {
    return this.set(true, props.defaultToCurrentConversation);
  }

  /**
   * Defines which conversations should be included in the list. Possible
   * enumValues are *im*, *impm*, *private*, and *public*
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_multi_select|View in Slack API Documentation}
   *
   * @param {...string|Array<string>} filters Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  filter(...filters) {
    return this.append(filters.flat(), props.filter);
  }

  /**
   * Excludes external shared conversations from the list
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_multi_select|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  excludeExternalSharedChannels() {
    return this.set(true, props.excludeExternalSharedChannels);
  }

  /**
   * Excludes conversations with bot users from the list
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_multi_select|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  excludeBotUsers() {
    return this.set(true, props.excludeBotUsers);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
      filter: BuilderHelper.getFilter(this.props),
    };

    return this.getResult(ConversationMultiSelectDto, augmentedProps);
  }
}

module.exports = {
  ConversationMultiSelect,
  ConversationMultiSelectDto,
};


/***/ }),

/***/ 8314:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { SelectElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class ConversationSelectDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.select.conversations;
    this.placeholder = params.placeholder;
    this.action_id = params.actionId;
    this.initial_conversation = params.initialConversation;
    this.default_to_current_conversation = params.defaultToCurrentConversation;
    this.confirm = params.confirm;
    this.response_url_enabled = params.responseUrlEnabled;
    this.filter = params.filter;

    this.pruneAndFreeze();
  }
}

class ConversationSelect extends SelectElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.initialConversation = params.initialConversation;

    this.finalizeConstruction();
  }

  /**
   * Sets the select menu to have an initial value
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_select|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  initialConversation(string) {
    return this.set(string, props.initialConversation);
  }

  /**
   * Sets default selected conversation to the one currently open for the user
   *
   * **Slack Validation Rules:**
   *    * If initial conversations provided, this option is ignored
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_select|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  defaultToCurrentConversation() {
    return this.set(true, props.defaultToCurrentConversation);
  }

  /**
   * Sets option to true, allowing a response URL to be provided at submission
   *
   * **Slack Validation Rules:**
   *    * Only available in modals with Inputs ⚠
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_select|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  responseUrlEnabled() {
    return this.set(true, props.responseUrlEnabled);
  }

  /**
   * Defines which conversations should be included in the list. Possible
   * enumValues are *im*, *impm*, *private*, and *public*
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_select|View in Slack API Documentation}
   *
   * @param {...string|Array<string>} filters Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  filter(...filters) {
    return this.append(filters.flat(), props.filter);
  }

  /**
   * Excludes external shared conversations from the list
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_select|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  excludeExternalSharedChannels() {
    return this.set(true, props.excludeExternalSharedChannels);
  }

  /**
   * Excludes conversations with bot users from the list
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_select|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  excludeBotUsers() {
    return this.set(true, props.excludeBotUsers);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
      filter: BuilderHelper.getFilter(this.props),
    };

    return this.getResult(ConversationSelectDto, augmentedProps);
  }
}

module.exports = {
  ConversationSelect,
  ConversationSelectDto,
};


/***/ }),

/***/ 2946:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { ConfirmableElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class DatePickerDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.datepicker;
    this.action_id = params.actionId;
    this.placeholder = params.placeholder;
    this.initial_date = params.initialDate;
    this.confirm = params.confirm;

    this.pruneAndFreeze();
  }
}

class DatePicker extends ConfirmableElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.initialDate = params.initialDate;

    this.finalizeConstruction();
  }

  /**
   * Adds the text in place of the input before selected or
   * interacted with
   *
   * **Slack Validation Rules:**
   *    * Max 150 characters
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#datepicker|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  placeholder(string) {
    return this.set(string, props.placeholder);
  }

  /**
   * Sets the default selected date in the menu
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#datepicker|View in Slack API Documentation}
   *
   * @param {Date} date
   * @return {this} The instance on which the method is called
   */

  initialDate(date) {
    return this.set(date, props.initialDate);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      initialDate: BuilderHelper.getFormattedDate(this.props.initialDate),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(DatePickerDto, augmentedProps);
  }
}

module.exports = {
  DatePicker,
  DatePickerDto,
};


/***/ }),

/***/ 7082:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { MultiSelectElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class ExternalMultiSelectDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.multiselect.external;
    this.placeholder = params.placeholder;
    this.action_id = params.actionId;
    this.min_query_length = params.minQueryLength;
    this.initial_options = params.initialOptions;
    this.confirm = params.confirm;
    this.max_selected_items = params.maxSelectedItems;

    this.pruneAndFreeze();
  }
}

class ExternalMultiSelect extends MultiSelectElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.minQueryLength = params.minQueryLength;
    this.props.maxSelectedItems = params.maxSelectedItems;

    this.finalizeConstruction();
  }

  /**
   * Sets a minimum number of characters types before querying your options URL
   *
   * **Slack Validation Rules:**
   *    * If not set, request will be sent on every character change
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#external_multi_select|View in Slack API Documentation}
   *
   * @param {int} int
   * @return {this} The instance on which the method is called
   */

  minQueryLength(int) {
    return this.set(int, props.minQueryLength);
  }

  /**
   * Sets the select menu to have an initial value
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#external_multi_select|View in Slack API Documentation}
   *
   * @param {...Option|Array<Option>} options Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  initialOptions(...options) {
    return this.append(options.flat(), props.initialOptions);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      initialOptions: BuilderHelper.getOptions(this.props.initialOptions),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(ExternalMultiSelectDto, augmentedProps);
  }
}

module.exports = {
  ExternalMultiSelect,
  ExternalMultiSelectDto,
};


/***/ }),

/***/ 9010:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { SelectElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class ExternalSelectDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.select.external;
    this.placeholder = params.placeholder;
    this.action_id = params.actionId;
    this.initial_option = params.initialOption;
    this.min_query_length = params.minQueryLength;
    this.confirm = params.confirm;

    this.pruneAndFreeze();
  }
}

class ExternalSelect extends SelectElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.minQueryLength = params.minQueryLength;

    this.finalizeConstruction();
  }

  /**
   * Sets the select menu to have an initial value
   *
   * **Slack Validation Rules:**
   *    * Must be exact match to one of the Options
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#external_select|View in Slack API Documentation}
   *
   * @param {Option} option
   * @return {this} The instance on which the method is called
   */

  initialOption(option) {
    return this.set(option, props.initialOption);
  }

  /**
   * Sets a minimum number of characters types before querying your options URL
   *
   * **Slack Validation Rules:**
   *    * If not set, request will be sent on every character change
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#external_select|View in Slack API Documentation}
   *
   * @param {int} int
   * @return {this} The instance on which the method is called
   */

  minQueryLength(int) {
    return this.set(int, props.minQueryLength);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      initialOption: BuilderHelper.getOption(this.props.initialOption),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(ExternalSelectDto, augmentedProps);
  }
}

module.exports = {
  ExternalSelect,
  ExternalSelectDto,
};


/***/ }),

/***/ 3855:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Element } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { types, props } = __nccwpck_require__(8345);

class ImgDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.image;
    this.image_url = params.imageUrl;
    this.alt_text = params.altText;

    this.pruneAndFreeze();
  }
}

class Img extends Element {
  constructor(params = {}) {
    super();

    this.props.imageUrl = params.imageUrl;
    this.props.altText = params.altText;

    this.finalizeConstruction();
  }

  /**
   * Sets the source URL to load the Img from
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 2000 characters
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#image|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  imageUrl(string) {
    return this.set(string, props.imageUrl);
  }

  /**
   * Sets the textual summary of the Img
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 2000 characters
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#image|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  altText(string) {
    return this.set(string, props.altText);
  }

  /**
   * @private
   */

  build() {
    return this.getResult(ImgDto);
  }
}

module.exports = {
  Img,
  ImgDto,
};


/***/ }),

/***/ 172:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Button, ButtonDto } = __nccwpck_require__(9378);
const { ChannelMultiSelect, ChannelMultiSelectDto } = __nccwpck_require__(5560);
const { ChannelSelect, ChannelSelectDto } = __nccwpck_require__(8044);
const { Checkboxes, CheckboxesDto } = __nccwpck_require__(8914);
const { ConversationMultiSelect, ConversationMultiSelectDto } = __nccwpck_require__(6748);
const { ConversationSelect, ConversationSelectDto } = __nccwpck_require__(8314);
const { DatePicker, DatePickerDto } = __nccwpck_require__(2946);
const { ExternalMultiSelect, ExternalMultiSelectDto } = __nccwpck_require__(7082);
const { ExternalSelect, ExternalSelectDto } = __nccwpck_require__(9010);
const { Img, ImgDto } = __nccwpck_require__(3855);
const { TextInput, TextInputDto } = __nccwpck_require__(854);
const { OverflowMenu, OverflowMenuDto } = __nccwpck_require__(7752);
const { RadioButtons, RadioButtonsDto } = __nccwpck_require__(7571);
const { StaticSelect, StaticSelectDto } = __nccwpck_require__(1258);
const { StaticMultiSelect, StaticMultiSelectDto } = __nccwpck_require__(62);
const { TimePicker, TimePickerDto } = __nccwpck_require__(3813);
const { UserMultiSelect, UserMultiSelectDto } = __nccwpck_require__(6756);
const { UserSelect, UserSelectDto } = __nccwpck_require__(2289);

const ElementDto = {
  ButtonDto,
  ChannelMultiSelectDto,
  ChannelSelectDto,
  CheckboxesDto,
  ConversationMultiSelectDto,
  ConversationSelectDto,
  DatePickerDto,
  ExternalMultiSelectDto,
  ExternalSelectDto,
  ImgDto,
  TextInputDto,
  OverflowMenuDto,
  RadioButtonsDto,
  StaticMultiSelectDto,
  StaticSelectDto,
  TimePickerDto,
  UserMultiSelectDto,
  UserSelectDto,
};

const getElements = () => {
  const getInstance = (Class, params) => new Class(params);

  return {

    /**
     * Creates and returns a Button Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#button|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.text] Sets the display text for the Button
     * @param {string} [params.url] Sets the URL to redirect the user to when this Button is clicked
     * @param {string} [params.value] Sets the value to be passed to your app when this Button is clicked
     * @return {Button} An instance of Button
     */

    Button: (params) => getInstance(Button, params),

    /**
     * Creates and returns a ChannelMultiSelect Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#channel_multi_select|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {int} [params.maxSelectedItems] Sets a limit to how many items the user can select
     * @return {ChannelMultiSelect} An instance of ChannelMultiSelect
     */

    ChannelMultiSelect: (params) => getInstance(ChannelMultiSelect, params),

    /**
     * Creates and returns a ChannelSelect Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#channel_select|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {string} [params.initialChannel] Sets the default selected item in the menu
     * @return {ChannelSelect} An instance of ChannelSelect
     */

    ChannelSelect: (params) => getInstance(ChannelSelect, params),

    /**
     * Creates and returns a Checkboxes Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#checkboxes|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @return {Checkboxes} An instance of Checkboxes
     */

    Checkboxes: (params) => getInstance(Checkboxes, params),

    /**
     * Creates and returns a ConversationMultiSelect Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_multi_select|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {int} [params.maxSelectedItems] Sets a limit to how many items the user can select
     * @return {ConversationMultiSelect} An instance of ConversationMultiSelect
     */

    ConversationMultiSelect: (params) => getInstance(ConversationMultiSelect, params),

    /**
     * Creates and returns a ConversationSelect Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#conversation_select|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {string} [params.initialConversation] Sets the default selected item in the menu
     * @return {ConversationSelect} An instance of ConversationSelect
     */

    ConversationSelect: (params) => getInstance(ConversationSelect, params),

    /**
     * Creates and returns a DatePicker Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#datepicker|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {string} [params.initialDate] Sets the default selected date in the menu
     * @return {DatePicker} An instance of DatePicker
     */

    DatePicker: (params) => getInstance(DatePicker, params),

    /**
     * Creates and returns a ExternalMultiSelect Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#external_multi_select|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {int} [params.maxSelectedItems] Sets a limit to how many items the user can select
     * @param {int} [params.minQueryLength] Sets a minimum number of characters types before querying your options URL
     * @return {ExternalMultiSelect} An instance of ExternalMultiSelect
     */

    ExternalMultiSelect: (params) => getInstance(ExternalMultiSelect, params),

    /**
     * Creates and returns a ExternalSelect Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#external_select|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {int} [params.minQueryLength] Sets a minimum number of characters types before querying your options URL
     * @return {ExternalSelect} An instance of ExternalSelect
     */

    ExternalSelect: (params) => getInstance(ExternalSelect, params),

    /**
     * Creates and returns an Img Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#image|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.imageUrl] Sets the source URL to load the Img from
     * @param {string} [params.altText] Sets the textual summary of the Img
     * @return {Img} An instance of Img
     */

    Img: (params) => getInstance(Img, params),

    /**
     * Creates and returns an OverflowMenu Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#overflow|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @return {OverflowMenu} An instance of OverflowMenu
     */

    OverflowMenu: (params) => getInstance(OverflowMenu, params),

    /**
     * Creates and returns a RadioButtons Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#radio|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @return {RadioButtons} An instance of RadioButtons
     */

    RadioButtons: (params) => getInstance(RadioButtons, params),

    /**
     * Creates and returns a StaticMultiSelect Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#static_multi_select|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {int} [params.maxSelectedItems] Sets a limit to how many items the user can select
     * @return {StaticMultiSelect} An instance of StaticMultiSelect
     */

    StaticMultiSelect: (params) => getInstance(StaticMultiSelect, params),

    /**
     * Creates and returns a StaticSelect Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#static_select|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @return {StaticSelect} An instance of StaticSelect
     */

    StaticSelect: (params) => getInstance(StaticSelect, params),

    /**
     * Creates and returns a TextInput Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#input|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {string} [params.initialValue] Sets the default text entered into the TextInput at modal load
     * @param {int} [params.minLength] Sets a minimum character count in order for the user to submit the form
     * @param {int} [params.maxLength] Sets a maximum character count allowed to send the form
     * @return {TextInput} An instance of Input
     */

    TextInput: (params) => getInstance(TextInput, params),

    /**
     * Creates and returns a TimePicker Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#timepicker|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {string} [params.initialTime] Sets the default selected time in the menu
     * @return {TimePicker} An instance of TimePicker
     */

    TimePicker: (params) => getInstance(TimePicker, params),

    /**
     * Creates and returns a UserMultiSelect Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#users_multi_select|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {int} [params.maxSelectedItems] Sets a limit to how many items the user can select
     * @return {UserMultiSelect} An instance of UserMultiSelect
     */

    UserMultiSelect: (params) => getInstance(UserMultiSelect, params),

    /**
     * Creates and returns a UserSelect Element
     *
     * {@link https://api.slack.com/reference/block-kit/block-elements#users_select|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.actionId] Sets a string to be an identifier for the source of an action in interaction payloads
     * @param {string} [params.placeholder] Adds the text in place of the input before selected or interacted with
     * @param {string} [params.initialUser]
     * @return {UserSelect} An instance of UserSelect
     */

    UserSelect: (params) => getInstance(UserSelect, params),
  };
};

module.exports = {
  Button,
  ChannelMultiSelect,
  ChannelSelect,
  Checkboxes,
  ConversationMultiSelect,
  ConversationSelect,
  DatePicker,
  ExternalMultiSelect,
  ExternalSelect,
  Img,
  TextInput,
  OverflowMenu,
  RadioButtons,
  StaticMultiSelect,
  StaticSelect,
  TimePicker,
  UserMultiSelect,
  UserSelect,
  ElementDto,
  getElements,
};


/***/ }),

/***/ 7752:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { SelectableElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types } = __nccwpck_require__(8345);

class OverflowMenuDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.overflow;
    this.action_id = params.actionId;
    this.options = params.options;
    this.confirm = params.confirm;

    this.pruneAndFreeze();
  }
}

class OverflowMenu extends SelectableElement {
  constructor(params = {}) {
    super();

    this.props.actionId = params.actionId;

    this.finalizeConstruction();
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      options: BuilderHelper.getOptions(this.props.options),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(OverflowMenuDto, augmentedProps);
  }
}

module.exports = {
  OverflowMenu,
  OverflowMenuDto,
};

/**
 * {@link https://api.slack.com/reference/block-kit/block-elements#overflow|View in Slack API Documentation}
 */


/***/ }),

/***/ 7571:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { SelectableElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class RadioButtonsDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.radiobutton;
    this.action_id = params.actionId;
    this.options = params.options;
    this.initial_option = params.initialOption;
    this.confirm = params.confirm;

    this.pruneAndFreeze();
  }
}

class RadioButtons extends SelectableElement {
  constructor(params = {}) {
    super();

    this.props.actionId = params.actionId;

    this.finalizeConstruction();
  }

  /**
   * Sets the default selected item in the menu
   *
   * **Slack Validation Rules:**
   *    * Must be an exact match to one of the provided options
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#radio|View in Slack API Documentation}
   *
   * @param {Option} option
   * @return {this} The instance on which the method is called
   */

  initialOption(option) {
    return this.set(option, props.initialOption);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      options: BuilderHelper.getOptions(this.props.options, { isMarkdown: true }),
      initialOption: BuilderHelper.getOption(this.props.initialOption, { isMarkdown: true }),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(RadioButtonsDto, augmentedProps);
  }
}

module.exports = {
  RadioButtons,
  RadioButtonsDto,
};


/***/ }),

/***/ 62:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { MultiSelectElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class StaticMultiSelectDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.multiselect.static;
    this.placeholder = params.placeholder;
    this.action_id = params.actionId;
    this.options = params.options;
    this.option_groups = params.optionGroups;
    this.initial_options = params.initialOptions;
    this.confirm = params.confirm;
    this.max_selected_items = params.maxSelectedItems;

    this.pruneAndFreeze();
  }
}

class StaticMultiSelect extends MultiSelectElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.maxSelectedItems = params.maxSelectedItems;

    this.finalizeConstruction();
  }

  /**
   * Sets the Options for the StaticMultiSelect
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 100 Options
   *    * Only one of options property or optionGroups should be defined
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#static_multi_select|View in Slack API Documentation}
   *
   * @param {...Option|Option[]} options
   * @return {this} The instance on which the method is called
   */

  options(...options) {
    return this.append(options.flat(), props.options);
  }

  /**
   * Sets the OptionGroup for the StaticMultiSelect, Options placed into
   * logical and named groups.
   *
   * **Slack Validation Rules:**
   *    * Max 100 Options
   *    * Only one of options property or optionGroups should be defined
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#static_multi_select|View in Slack API Documentation}
   *
   * @param {...OptionGroup|OptionGroup[]} optionGroups
   * @return {this} The instance on which the method is called
   */

  optionGroups(...optionGroups) {
    return this.append(optionGroups.flat(), props.optionGroups);
  }

  /**
   * Sets the default selected item in the menu
   *
   * **Slack Validation Rules:**
   *    * Must have exact matches to the included Options
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#static_multi_select|View in Slack API Documentation}
   *
   * @param {...Option|Array<Option>} options Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  initialOptions(...options) {
    return this.append(options.flat(), props.initialOptions);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      options: BuilderHelper.getOptions(this.props.options),
      initialOptions: BuilderHelper.getOptions(this.props.initialOptions),
      optionGroups: BuilderHelper.getBuilderResults(this.props.optionGroups),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(StaticMultiSelectDto, augmentedProps);
  }
}

module.exports = {
  StaticMultiSelect,
  StaticMultiSelectDto,
};


/***/ }),

/***/ 1258:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { SelectElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class StaticSelectDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.select.static;
    this.placeholder = params.placeholder;
    this.action_id = params.actionId;
    this.options = params.options;
    this.option_groups = params.optionGroups;
    this.initial_option = params.initialOption;
    this.confirm = params.confirm;

    this.pruneAndFreeze();
  }
}

class StaticSelect extends SelectElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;

    this.finalizeConstruction();
  }

  /**
   * Sets the Options for the StaticSelect
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 100 Options
   *    * Only one of options property or optionGroups should be defined
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#static_select|View in Slack API Documentation}
   *
   * @param {...Option|Array<Option>} options Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  options(...options) {
    return this.append(options.flat(), props.options);
  }

  /**
   * Sets the OptionGroup for the StaticSelect, Options placed into
   * logical and named groups.
   *
   * **Slack Validation Rules:**
   *    * Max 100 Options
   *    * Only one of options property or optionGroups should be defined
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#static_select|View in Slack API Documentation}
   *
   * @param {...OptionGroup|Array<OptionGroup>} optionGroups Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  optionGroups(...optionGroups) {
    return this.append(optionGroups.flat(), props.optionGroups);
  }

  /**
   * Sets the default selected item in the menu
   *
   * **Slack Validation Rules:**
   *    * Must be an exact match to one of the provided options
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#static_select|View in Slack API Documentation}
   *
   * @param {Option} option
   * @return {this} The instance on which the method is called
   */

  initialOption(option) {
    return this.set(option, props.initialOption);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      options: BuilderHelper.getOptions(this.props.options),
      optionGroups: BuilderHelper.getBuilderResults(this.props.optionGroups),
      initialOption: BuilderHelper.getOption(this.props.initialOption),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(StaticSelectDto, augmentedProps);
  }
}

module.exports = {
  StaticSelect,
  StaticSelectDto,
};


/***/ }),

/***/ 854:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { ActionElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props, enumValues } = __nccwpck_require__(8345);

class TextInputDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.input;
    this.action_id = params.actionId;
    this.placeholder = params.placeholder;
    this.initial_value = params.initialValue;
    this.multiline = params.multiline;
    this.min_length = params.minLength;
    this.max_length = params.maxLength;
    this.dispatch_action_config = params.dispatchActionConfig;

    this.pruneAndFreeze();
  }
}

class TextInput extends ActionElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.initialValue = params.initialValue;
    this.props.minLength = params.minLength;
    this.props.maxLength = params.maxLength;

    this.finalizeConstruction();
  }

  /**
   * Adds the text in place of the input before selected or
   * interacted with
   *
   * **Slack Validation Rules:**
   *    * Max 150 characters
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#input|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  placeholder(string) {
    return this.set(string, props.placeholder);
  }

  /**
   * Sets the default text entered into the TextInput at load
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#input|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  initialValue(string) {
    return this.set(string, props.initialValue);
  }

  /**
   * Sets the Input to be multiline, as opposed to single line
   *
   * **Slack Validation Rules:**
   *    * Defaults to false
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#input|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  multiline() {
    return this.set(true, props.multiline);
  }

  /**
   * Sets a minimum character count in order for the user to submit the form
   *
   * **Slack Validation Rules:**
   *    * Maximum 3000 characters
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#input|View in Slack API Documentation}
   *
   * @param {int} int
   * @return {this} The instance on which the method is called
   */

  minLength(int) {
    return this.set(int, props.minLength);
  }

  /**
   * Sets a maximum character count allowed to send the form
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#input|View in Slack API Documentation}
   *
   * @param {int} int
   * @return {this} The instance on which the method is called
   */

  maxLength(int) {
    return this.set(int, props.maxLength);
  }

  /**
   * Configures the text input to send an actions payload when Enter is pressed
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#input|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  dispatchActionOnEnterPressed() {
    return this.set(enumValues.onEnterPressed, props.onEnterPressed);
  }

  /**
   * Configures the text input to send an actions payload when a character is entered
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#input|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  dispatchActionOnCharacterEntered() {
    return this.set(enumValues.onCharacterEntered, props.onCharacterEntered);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      dispatchActionConfig: BuilderHelper.getDispatchActionsConfigurationObject(this.props),
    };

    return this.getResult(TextInputDto, augmentedProps);
  }
}

module.exports = {
  TextInput,
  TextInputDto,
};


/***/ }),

/***/ 3813:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { ConfirmableElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class TimePickerDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.timepicker;
    this.action_id = params.actionId;
    this.placeholder = params.placeholder;
    this.initial_time = params.initialTime;
    this.confirm = params.confirm;

    this.pruneAndFreeze();
  }
}

class TimePicker extends ConfirmableElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.initialTime = params.initialTime;

    this.finalizeConstruction();
  }

  /**
   * Adds the text in place of the input before selected or
   * interacted with
   *
   * **Slack Validation Rules:**
   *    * Max 150 characters
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#timepicker|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  placeholder(string) {
    return this.set(string, props.placeholder);
  }

  /**
   * Sets the default selected time in the menu
   *
   * **Slack Validation Rules:**
   *    * Set in HH:mm format, where HH is 24-hour hour format and mm is minutes with a leading zero
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#timepicker|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  initialTime(string) {
    return this.set(string, props.initialTime);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      initialDate: BuilderHelper.getFormattedDate(this.props.initialDate),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(TimePickerDto, augmentedProps);
  }
}

module.exports = {
  TimePicker,
  TimePickerDto,
};


/***/ }),

/***/ 6756:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { MultiSelectElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class UserMultiSelectDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.multiselect.users;
    this.placeholder = params.placeholder;
    this.action_id = params.actionId;
    this.initial_users = params.initialUsers;
    this.confirm = params.confirm;
    this.max_selected_items = params.maxSelectedItems;

    this.pruneAndFreeze();
  }
}

class UserMultiSelect extends MultiSelectElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.maxSelectedItems = params.maxSelectedItems;

    this.finalizeConstruction();
  }

  /**
   * Sets users to display in the menu by default at load
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#users_multi_select|View in Slack API Documentation}
   *
   * @param {...string|Array<string>} strings Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  initialUsers(...strings) {
    return this.append(strings.flat(), props.initialUsers);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(UserMultiSelectDto, augmentedProps);
  }
}

module.exports = {
  UserMultiSelect,
  UserMultiSelectDto,
};


/***/ }),

/***/ 2289:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { SelectElement } = __nccwpck_require__(1818);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class UserSelectDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.elements.select.users;
    this.placeholder = params.placeholder;
    this.action_id = params.actionId;
    this.initial_user = params.initialUser;
    this.confirm = params.confirm;

    this.pruneAndFreeze();
  }
}

class UserSelect extends SelectElement {
  constructor(params = {}) {
    super();

    this.props.placeholder = params.placeholder;
    this.props.actionId = params.actionId;
    this.props.initialUser = params.initialUser;

    this.finalizeConstruction();
  }

  /**
   * Sets user to display in the menu by default at load
   *
   * {@link https://api.slack.com/reference/block-kit/block-elements#users_select|View in Slack API Documentation}
   *
   * @param {string} string User IDs
   * @return {this} The instance on which the method is called
   */

  initialUser(string) {
    return this.set(string, props.initialUser);
  }

  /**
   * @private
   */

  build() {
    const augmentedProps = {
      placeholder: BuilderHelper.getPlainTextObject(this.props.placeholder),
      confirm: BuilderHelper.getBuilderResult(this.props.confirm),
    };

    return this.getResult(UserSelectDto, augmentedProps);
  }
}

module.exports = {
  UserSelect,
  UserSelectDto,
};


/***/ }),

/***/ 8850:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { getSurfaces } = __nccwpck_require__(6550);
const { getBlocks } = __nccwpck_require__(2887);
const { getBits } = __nccwpck_require__(7711);
const { getElements } = __nccwpck_require__(172);

const Bits = getBits();
const Blocks = getBlocks();
const Elements = getElements();

module.exports = {
  ...getSurfaces(),
  Blocks,
  Elements,
  Bits,
};


/***/ }),

/***/ 4501:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ObjectBase = __nccwpck_require__(6486);

module.exports = {
  ObjectBase,
};


/***/ }),

/***/ 6486:
/***/ ((module) => {

class ObjectBase {
  cleanAndFreeze() {
    Object.keys(this)
      .forEach((prop) => typeof this[prop] === 'undefined' && delete this[prop]);

    return Object.freeze(this);
  }
}

module.exports = ObjectBase;


/***/ }),

/***/ 9782:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { ObjectBase } = __nccwpck_require__(4501);

class DispatchActionsConfigurationObject extends ObjectBase {
  constructor(params) {
    super();

    this.trigger_actions_on = params.triggerActionsOn;

    this.cleanAndFreeze();
  }
}

module.exports = DispatchActionsConfigurationObject;


/***/ }),

/***/ 4943:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { ObjectBase } = __nccwpck_require__(4501);

class FilterObject extends ObjectBase {
  constructor(params) {
    super();

    this.include = params.filter;
    this.exclude_external_shared_channels = params.excludeExternalSharedChannels;
    this.exclude_bot_users = params.excludeBotUsers;

    this.cleanAndFreeze();
  }
}

module.exports = FilterObject;


/***/ }),

/***/ 1685:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const FilterObject = __nccwpck_require__(4943);
const MarkdownObject = __nccwpck_require__(8472);
const PlainTextObject = __nccwpck_require__(666);
const DispatchActionsConfigurationObject = __nccwpck_require__(9782);

module.exports = {
  FilterObject,
  MarkdownObject,
  PlainTextObject,
  DispatchActionsConfigurationObject,
};


/***/ }),

/***/ 8472:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { ObjectBase } = __nccwpck_require__(4501);
const { types } = __nccwpck_require__(8345);

class MarkdownObject extends ObjectBase {
  constructor(text) {
    super();

    this.type = types.objects.markdown;
    this.text = text;

    this.cleanAndFreeze();
  }
}

module.exports = MarkdownObject;


/***/ }),

/***/ 666:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { ObjectBase } = __nccwpck_require__(4501);
const { types } = __nccwpck_require__(8345);

class PlainTextObject extends ObjectBase {
  constructor(text) {
    super();

    this.type = types.objects.text;
    this.text = text;

    this.cleanAndFreeze();
  }
}

module.exports = PlainTextObject;


/***/ }),

/***/ 6820:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Surface = __nccwpck_require__(7521);
const { props } = __nccwpck_require__(8345);

class AdvancedSurface extends Surface {
  /**
   * Sets a string sent back to your server together with all action and submission events.
   *
   * **Slack Validation Rules:**
   *    * Max 3000 characters
   *
   * {@link https://api.slack.com/reference/surfaces/views|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  privateMetaData(string) {
    return this.set(string, props.privateMetaData);
  }

  /**
   * Sets a string sent back to your server together with all action and submission events to
   * identify app actions for the current view.
   *
   * **Slack Validation Rules:**
   *    * Max 255 characters
   *
   * {@link https://api.slack.com/reference/surfaces/views|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  callbackId(string) {
    return this.set(string, props.callbackId);
  }

  /**
   * Sets a custom identifier that must be unique for all views on a per-team basis
   *
   * **Slack Validation Rules:**
   *    * Max 255 characters
   *
   * {@link https://api.slack.com/reference/surfaces/views|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  externalId(string) {
    return this.set(string, props.externalId);
  }

  /**
   * When called, builds the view and prints to the console the preview URL in
   * order to open and preview the view on the Slack Block Builder website
   */

  printPreviewUrl() {
    this.build();

    console.log(encodeURI(`https://app.slack.com/block-kit-builder/#${JSON.stringify(this.result)}`).replace(/[!'()*]/g, escape));
  }
}

module.exports = AdvancedSurface;


/***/ }),

/***/ 9253:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Surface = __nccwpck_require__(7521);
const AdvancedSurface = __nccwpck_require__(6820);

module.exports = {
  Surface,
  AdvancedSurface,
};


/***/ }),

/***/ 7521:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Builder } = __nccwpck_require__(3366);
const { props, categories } = __nccwpck_require__(8345);

class Surface extends Builder {
  constructor() {
    super();

    this.category = categories.surface;
  }

  /**
   * Sets the Blocks of the Surface
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 100 Blocks
   *
   * {@link https://api.slack.com/reference/surfaces/views|View in Slack API Documentation}
   *
   * @param {...Block|Array<Block>} blocks Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  blocks(...blocks) {
    return this.append(blocks.flat(), props.blocks);
  }

  /**
   * Builds the view and returns it as a Slack API-compatible object.
   *
   * @return {Object} An object representation of the built UI
   */

  buildToObject() {
    this.build();

    return this.result;
  }

  /**
   * Builds the view and returns it as a Slack API-compatible JSON string.
   *
   * @return {String} A JSON string representation of the built UI
   */

  buildToJSON() {
    this.build();

    return JSON.stringify(this.result);
  }

  /**
   * Builds the view and returns a Slack API-compatible array of Blocks objects.
   *
   * {@link https://api.slack.com/block-kit|View in Slack API Documentation}
   *
   * @return {Array} Array of built Block objects
   */

  getBlocks() {
    this.build();

    return [...this.result.blocks];
  }

  /**
   * When called, builds the view and prints to the console the preview URL in
   * order to open and preview the view on the Slack Block Builder website
   */

  printPreviewUrl() {
    this.build();

    console.log(encodeURI(`https://app.slack.com/block-kit-builder/#${JSON.stringify({ blocks: this.result.blocks, attachments: this.result.attachments })}`).replace(/[!'()*]/g, escape));
  }
}

module.exports = Surface;


/***/ }),

/***/ 5890:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { AdvancedSurface } = __nccwpck_require__(9253);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types } = __nccwpck_require__(8345);

class HomeTabDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.surfaces.home;
    this.blocks = params.blocks;
    this.private_metadata = params.privateMetaData;
    this.callback_id = params.callbackId;
    this.external_id = params.externalId;

    this.pruneAndFreeze();
  }
}

class HomeTab extends AdvancedSurface {
  constructor(params = {}) {
    super();

    this.props.privateMetaData = params.privateMetaData;
    this.props.callbackId = params.callbackId;
    this.props.externalId = params.externalId;

    this.finalizeConstruction();
  }

  /**
   * @private
   */

  build() {
    if (!this.hasBeenBuilt) {
      const augmentedProps = {
        blocks: BuilderHelper.getBuilderResults(this.props.blocks),
      };

      this.getResult(HomeTabDto, augmentedProps);
    }

    return this.result;
  }
}

module.exports = {
  HomeTab,
  HomeTabDto,
};

/**
 * {@link https://api.slack.com/reference/surfaces/views|View in Slack API Documentation}
 */


/***/ }),

/***/ 6550:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { HomeTab, HomeTabDto } = __nccwpck_require__(5890);
const { Message, MessageDto } = __nccwpck_require__(8447);
const { Modal, ModalDto } = __nccwpck_require__(6398);

const SurfaceDto = {
  HomeTabDto,
  MessageDto,
  ModalDto,
};

const getSurfaces = () => {
  const getInstance = (Class, params) => new Class(params);

  return {

    /**
     * Creates and returns a HomeTab Surface
     *
     * {@link https://api.slack.com/surfaces/tabs|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.callbackId] Sets a string sent back to your server together with all action and submission events.
     * @param {string} [params.externalId] Sets a custom identifier that must be unique for all views on a per-team basis
     * @param {string} [params.privateMetaData] Sets a string sent back to your server together with all action and submission events.
     * @return {HomeTab} An instance of HomeTab
     */

    HomeTab: (params) => getInstance(HomeTab, params),

    /**
     * Creates and returns a Message Surface
     *
     * {@link https://api.slack.com/messaging/composing|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.channel] The Slack channel ID to which the message is to be sent
     * @param {string} [params.text] Text to be displayed in the notification on the Message, or in the body, if there are no Blocks available
     * @param {timestamp} [params.threadTs] Sets the message to be a reply in a thread to the message whose timestamp is passed
     * @param {timestamp} [params.postAt] Sets a time for the message to be posted, as a scheduled message
     * @return {Message} An instance of Message
     */

    Message: (params) => getInstance(Message, params),

    /**
     * Creates and returns a Modal Surface
     *
     * {@link https://api.slack.com/reference/surfaces/views|View in Slack API Documentation}
     *
     * @param {Object} [params] Constructor parameters
     * @param {string} [params.title] Sets a title for your Modal
     * @param {string} [params.close] Sets the text for the close button
     * @param {string} [params.submit] Sets the text for the submit button
     * @param {string} [params.callbackId] Sets a string sent back to your server together with all action and submission events.
     * @param {string} [params.externalId] Sets a custom identifier that must be unique for all views on a per-team basis
     * @param {string} [params.privateMetaData] Sets a string sent back to your server together with all action and submission events.
     * @return {Modal} An instance of Modal
     */

    Modal: (params) => getInstance(Modal, params),
  };
};

module.exports = {
  HomeTab,
  Message,
  Modal,
  SurfaceDto,
  getSurfaces,
};


/***/ }),

/***/ 8447:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { Surface } = __nccwpck_require__(9253);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { props, enumValues } = __nccwpck_require__(8345);

class MessageDto extends SlackDto {
  constructor(params) {
    super();

    this.channel = params.channel;
    this.text = params.text;
    this.blocks = params.blocks;
    this.attachments = params.attachments;
    this.as_user = params.asUser;
    this.ts = params.ts;
    this.thread_ts = params.threadTs;
    this.replace_original = params.replaceOriginal;
    this.delete_original = params.deleteOriginal;
    this.response_type = params.responseType;
    this.post_at = params.postAt;
    this.mrkdwn = params.mrkdwn;

    this.pruneAndFreeze();
  }
}

class Message extends Surface {
  constructor(params = {}) {
    super();

    this.props.channel = params.channel;
    this.props.text = params.text;
    this.props.ts = params.ts;
    this.props.threadTs = params.threadTs;
    this.props.postAt = params.postAt;

    this.finalizeConstruction();
  }

  /**
   * Sets the Attachments of the Message object
   *
   * {@link https://api.slack.com/reference/messaging/attachments|View in Slack API Documentation}
   *
   * @param {...Attachment|Array<Attachment>} attachments Accepts multiple arguments or Array
   * @return {this} The instance on which the method is called
   */

  attachments(...attachments) {
    return this.append(attachments.flat(), props.attachments);
  }

  /**
   * The Slack channel ID to which the message is to be sent
   *
   * {@link https://api.slack.com/messaging/composing|View in Slack API Documentation}
   *
   * @param {string} string Slack channel ID
   * @return {this} The instance on which the method is called
   */

  channel(string) {
    return this.set(string, props.channel);
  }

  /**
   * Text to be displayed in the notification on the Message, or
   * in the body, if there are no Blocks available
   *
   * {@link https://api.slack.com/messaging/composing|View in Slack API Documentation}
   *
   * @param {string} string Slack channel ID
   * @return {this} The instance on which the method is called
   */

  text(string) {
    return this.set(string, props.text);
  }

  /**
   * Sets the message to be sent as either the user whose oAuth token is being used,
   * or as a bot user
   *
   * {@link https://api.slack.com/messaging/composing|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  asUser() {
    return this.set(true, props.asUser);
  }

  /**
   * Sets the message to be a reply in a thread to the message whose timestamp is passed
   *
   * {@link https://api.slack.com/messaging/composing|View in Slack API Documentation}
   *
   * @param {string} string The Slack-produced timestamp of message to be replied to
   * @return {this} The instance on which the method is called
   */

  threadTs(string) {
    return this.set(string, props.threadTs);
  }

  /**
   * Used to update a message. Sets the timestamp of the message to update.
   *
   * {@link https://api.slack.com/messaging/composing|View in Slack API Documentation}
   *
   * @param {string} string The Slack-produced timestamp of message to be replaced
   * @return {this} The instance on which the method is called
   */

  ts(string) {
    return this.set(string, props.ts);
  }

  /**
   * Sets the message to be replace the original message from which the interaction was received
   *
   * {@link https://api.slack.com/messaging/composing|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  replaceOriginal() {
    return this.set(true, props.replaceOriginal);
  }

  /**
   * Sets the original message from which interaction was received to be deleted
   *
   * {@link https://api.slack.com/messaging/composing|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  deleteOriginal() {
    return this.set(true, props.deleteOriginal);
  }

  /**
   * Sets the message to only be visible by the user who invoked the action
   *
   * {@link https://api.slack.com/messaging/composing|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  ephemeral() {
    return this.set(enumValues.ephemeral, props.responseType);
  }

  /**
   * Sets the message to visible to everyone in the channel
   *
   * {@link https://api.slack.com/messaging/composing|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  inChannel() {
    return this.set(enumValues.inChannel, props.responseType);
  }

  /**
   * Sets a time for the message to be posted, as a scheduled message
   *
   * {@link https://api.slack.com/messaging/composing|View in Slack API Documentation}
   *
   * @param {timestamp} timestamp The timestamp of message to be replied to
   * @return {this} The instance on which the method is called
   */

  postAt(timestamp) {
    return this.set(timestamp, props.postAt);
  }

  /**
   * When set, the Slack API knows that markdown in the `text` property should be ignored.
   *
   * {@link https://api.slack.com/reference/messaging/payload|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  ignoreMarkdown() {
    return this.set(false, props.mrkdwn);
  }

  /**
   * Builds the view and returns a Slack API-compatible array of Attachment objects.
   *
   * {@link https://api.slack.com/reference/messaging/attachments|View in Slack API Documentation}
   *
   * @return {Array} Array of built Attachment objects
   */

  getAttachments() {
    this.build();

    return [...this.result.attachments];
  }

  /**
   * @private
   */

  build() {
    if (!this.hasBeenBuilt) {
      const augmentedProps = {
        blocks: BuilderHelper.getBuilderResults(this.props.blocks),
        attachments: BuilderHelper.getBuilderResults(this.props.attachments),
      };

      this.getResult(MessageDto, augmentedProps);
    }

    return this.result;
  }
}

module.exports = {
  Message,
  MessageDto,
};


/***/ }),

/***/ 6398:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { AdvancedSurface } = __nccwpck_require__(9253);
const { SlackDto } = __nccwpck_require__(3366);
const { BuilderHelper } = __nccwpck_require__(249);
const { types, props } = __nccwpck_require__(8345);

class ModalDto extends SlackDto {
  constructor(params) {
    super();

    this.type = types.surfaces.modal;
    this.title = params.title;
    this.blocks = params.blocks;
    this.close = params.close;
    this.submit = params.submit;
    this.private_metadata = params.privateMetaData;
    this.callback_id = params.callbackId;
    this.clear_on_close = params.clearOnClose;
    this.notify_on_close = params.notifyOnClose;
    this.external_id = params.externalId;

    this.pruneAndFreeze();
  }
}

class Modal extends AdvancedSurface {
  constructor(params = {}) {
    super();

    this.props.title = params.title;
    this.props.close = params.close;
    this.props.submit = params.submit;
    this.props.privateMetaData = params.privateMetaData;
    this.props.callbackId = params.callbackId;
    this.props.externalId = params.externalId;

    this.finalizeConstruction();
  }

  /**
   * Sets the title of the Modal dialog
   *
   * **Slack Validation Rules:**
   *    * **Required** ⚠
   *    * Max 24 characters
   *
   * {@link https://api.slack.com/reference/surfaces/views|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  title(string) {
    return this.set(string, props.title);
  }

  /**
   * Sets the text displayed on the button that closes the Modal
   *
   * **Slack Validation Rules:**
   *    * Max 24 characters
   *
   * {@link https://api.slack.com/reference/surfaces/views|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  close(string) {
    return this.set(string, props.close);
  }

  /**
   * Sets the text displayed on the button that submits the Modal
   *
   * **Slack Validation Rules:**
   *    * Max 24 characters
   *
   * {@link https://api.slack.com/reference/surfaces/views|View in Slack API Documentation}
   *
   * @param {string} string
   * @return {this} The instance on which the method is called
   */

  submit(string) {
    return this.set(string, props.submit);
  }

  /**
   * Configures the Modal to clear all open and pushed views in the Modal flow
   *
   * {@link https://api.slack.com/reference/surfaces/views|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  clearOnClose() {
    return this.set(true, props.clearOnClose);
  }

  /**
   * Configures the Modal to send a notification to your server when closed
   *
   * {@link https://api.slack.com/reference/surfaces/views|View in Slack API Documentation}
   *
   * @return {this} The instance on which the method is called
   */

  notifyOnClose() {
    return this.set(true, props.notifyOnClose);
  }

  /**
   * @private
   */

  build() {
    if (!this.hasBeenBuilt) {
      const augmentedProps = {
        title: BuilderHelper.getPlainTextObject(this.props.title),
        blocks: BuilderHelper.getBuilderResults(this.props.blocks),
        close: BuilderHelper.getPlainTextObject(this.props.close),
        submit: BuilderHelper.getPlainTextObject(this.props.submit),
      };

      this.getResult(ModalDto, augmentedProps);
    }

    return this.result;
  }
}

module.exports = {
  Modal,
  ModalDto,
};


/***/ }),

/***/ 3179:
/***/ ((module) => {

module.exports = {
  bit: 'Bit',
  element: 'Element',
  block: 'Block',
  surface: 'Surface',
};


/***/ }),

/***/ 1885:
/***/ ((module) => {

module.exports = {
  option: 'Option',
  optionGroup: 'OptionGroup',
  confirmationDialog: 'ConfirmationDialog',
  img: 'Img',
  attachment: 'Attachment',
};


/***/ }),

/***/ 8345:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const types = __nccwpck_require__(7443);
const enumValues = __nccwpck_require__(2695);
const props = __nccwpck_require__(236);
const categories = __nccwpck_require__(3179);
const classes = __nccwpck_require__(1885);
const paramMap = __nccwpck_require__(4846);

module.exports = {
  types,
  enumValues,
  props,
  categories,
  classes,
  paramMap,
};


/***/ }),

/***/ 4846:
/***/ ((module) => {

module.exports = {
  actionId: 'action_id',
  blocks: 'blocks',
  blockId: 'block_id',
  maxSelectedItems: 'max_selected_items',
  title: 'title',
  text: 'text',
  confirm: 'confirm',
  deny: 'deny',
  style: 'style',
  danger: 'danger',
  label: 'label',
  options: 'options',
  value: 'value',
  description: 'description',
  url: 'url',
  elements: 'elements',
  externalId: 'external_id',
  imageUrl: 'image_url',
  altText: 'alt_text',
  element: 'element',
  hint: 'hint',
  optional: 'optional',
  fields: 'fields',
  accessory: 'accessory',
  initialChannels: 'initial_channels',
  initialChannel: 'initial_channel',
  responseUrlEnabled: 'response_url_enabled',
  initialOptions: 'initial_options',
  initialConversations: 'initial_conversations',
  defaultToCurrentConversation: 'default_to_current_conversation',
  filter: 'filter',
  excludeExternalSharedChannels: 'exclude_external_shared_channels',
  excludeBotUsers: 'exclude_bot_users',
  initialConversation: 'initial_conversation',
  initialDate: 'initial_date',
  minQueryLength: 'min_query_length',
  initialOption: 'initial_option',
  optionGroups: 'option_groups',
  placeholder: 'placeholder',
  initialValue: 'initial_value',
  multiline: 'multiline',
  minLength: 'min_length',
  maxLength: 'max_length',
  initialUsers: 'initial_users',
  initialUser: 'initial_user',
  channel: 'channel',
  close: 'close',
  submit: 'submit',
  clearOnClose: 'clear_on_close',
  notifyOnClose: 'notify_on_close',
  privateMetaData: 'private_metadata',
  callbackId: 'callback_id',
  asUser: 'as_user',
  ts: 'ts',
  threadTs: 'thread_ts',
  replaceOriginal: 'replace_original',
  deleteOriginal: 'delete_original',
  responseType: 'response_type',
  postAt: 'post_at',
  color: 'color',
  fallback: 'fallback',
  attachments: 'attachments',
  dispatchAction: 'dispatch_action',
  dispatchActionConfig: 'dispatch_action_config',
  initialTime: 'initial_time',
  mrkdwn: 'mrkdwn',
};


/***/ }),

/***/ 236:
/***/ ((module) => {

module.exports = {
  blocks: 'blocks',
  elements: 'elements',
  blockId: 'blockId',
  externalId: 'externalId',
  label: 'label',
  element: 'element',
  hint: 'hint',
  optional: 'optional',
  fields: 'fields',
  accessory: 'accessory',
  actionId: 'actionId',
  url: 'url',
  style: 'style',
  value: 'value',
  option: 'option',
  confirm: 'confirm',
  imageUrl: 'imageUrl',
  altText: 'altText',
  options: 'options',
  initialOptions: 'initialOptions',
  initialOption: 'initialOption',
  placeholder: 'placeholder',
  initialDate: 'initialDate',
  initialValue: 'initialValue',
  multiline: 'multiline',
  minLength: 'minLength',
  maxLength: 'maxLength',
  initialChannel: 'initialChannel',
  initialChannels: 'initialChannels',
  initialConversation: 'initialConversation',
  initialConversations: 'initialConversations',
  responseUrlEnabled: 'responseUrlEnabled',
  defaultToCurrentConversation: 'defaultToCurrentConversation',
  filter: 'filter',
  minQueryLength: 'minQueryLength',
  optionGroups: 'optionGroups',
  initialUser: 'initialUser',
  initialUsers: 'initialUsers',
  maxSelectedItems: 'maxSelectedItems',
  title: 'title',
  submit: 'submit',
  close: 'close',
  deny: 'deny',
  excludeExternalSharedChannels: 'excludeExternalSharedChannels',
  excludeBotUsers: 'excludeBotUsers',
  text: 'text',
  privateMetaData: 'privateMetaData',
  callbackId: 'callbackId',
  channel: 'channel',
  clearOnClose: 'clearOnClose',
  notifyOnClose: 'notifyOnClose',
  description: 'description',
  danger: 'danger',
  primary: 'primary',
  asUser: 'asUser',
  threadTs: 'threadTs',
  replaceOriginal: 'replaceOriginal',
  deleteOriginal: 'deleteOriginal',
  responseType: 'responseType',
  postAt: 'postAt',
  ephemeral: 'ephemeral',
  inChannel: 'inChannel',
  ts: 'ts',
  color: 'color',
  fallback: 'fallback',
  attachments: 'attachments',
  dispatchAction: 'dispatchAction',
  dispatchActionConfig: 'dispatchActionConfig',
  onEnterPressed: 'onEnterPressed',
  onCharacterEntered: 'onCharacterEntered',
  dispatchActionOnEnterPressed: 'dispatchActionOnEnterPressed',
  dispatchActionOnCharacterEntered: 'dispatchActionOnCharacterEntered',
  initialTime: 'initialTime',
  mrkdwn: 'mrkdwn',
  ignoreMarkdown: 'ignoreMarkdown',
};


/***/ }),

/***/ 7443:
/***/ ((module) => {

module.exports = {
  surfaces: {
    home: 'home',
    modal: 'modal',
  },
  blocks: {
    section: 'section',
    actions: 'actions',
    context: 'context',
    input: 'input',
    file: 'file',
    divider: 'divider',
    image: 'image',
    header: 'header',
  },
  elements: {
    button: 'button',
    checkbox: 'checkboxes',
    datepicker: 'datepicker',
    timepicker: 'timepicker',
    image: 'image',
    overflow: 'overflow',
    input: 'plain_text_input',
    radiobutton: 'radio_buttons',
    select: {
      static: 'static_select',
      external: 'external_select',
      users: 'users_select',
      conversations: 'conversations_select',
      channels: 'channels_select',
    },
    multiselect: {
      static: 'multi_static_select',
      external: 'multi_external_select',
      users: 'multi_users_select',
      conversations: 'multi_conversations_select',
      channels: 'multi_channels_select',
    },
  },
  objects: {
    text: 'plain_text',
    markdown: 'mrkdwn',
  },
};


/***/ }),

/***/ 2695:
/***/ ((module) => {

module.exports = {
  remote: 'remote',
  danger: 'danger',
  primary: 'primary',
  ephemeral: 'ephemeral',
  inChannel: 'in_channel',
  onEnterPressed: 'on_enter_pressed',
  onCharacterEntered: 'on_character_entered',
};


/***/ }),

/***/ 7507:
/***/ ((module) => {

class BlockBuilderError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BlockBuilderError';
  }
}

module.exports = BlockBuilderError;


/***/ }),

/***/ 1103:
/***/ ((module) => {

class BlockBuilderValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BlockBuilderValidationError';
  }
}

module.exports = BlockBuilderValidationError;


/***/ }),

/***/ 1748:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const BlockBuilderError = __nccwpck_require__(7507);
const BlockBuilderValidationError = __nccwpck_require__(1103);

module.exports = {
  BlockBuilderValidationError,
  BlockBuilderError,
};


/***/ }),

/***/ 995:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Objects = __nccwpck_require__(1685);

class BuilderHelper {
  static getOption(builder, { isMarkdown } = { isMarkdown: false }) {
    if (this.isUndefined(builder)) {
      return undefined;
    }

    if (!builder.hasBeenBuilt) {
      builder.build({ isMarkdown });
    }

    return builder.result;
  }

  static getOptions(builders, { isMarkdown } = { isMarkdown: false }) {
    if (this.isUndefined(builders)) {
      return undefined;
    }

    return builders.map((builder) => this.getBuilderResult(builder, { isMarkdown }));
  }

  static getBuilderResult(builder, { isMarkdown } = { isMarkdown: false }) {
    if (this.isUndefined(builder)) {
      return undefined;
    }

    if (!builder.hasBeenBuilt) {
      builder.build({ isMarkdown });
    }

    return builder.result;
  }

  static getBuilderResults(builders) {
    if (this.isUndefined(builders)) {
      return undefined;
    }

    return builders.map((builder) => this.getBuilderResult(builder));
  }

  static getPlainTextObject(string) {
    if (this.isUndefined(string)) {
      return undefined;
    }

    return new Objects.PlainTextObject(string);
  }

  static getMarkdownObject(string) {
    if (this.isUndefined(string)) {
      return undefined;
    }

    return new Objects.MarkdownObject(string);
  }

  static getElementsForContext(array) {
    if (this.isUndefined(array)) {
      return undefined;
    }

    return array.map((item) => (typeof item === 'string'
      ? this.getMarkdownObject(item)
      : item.build()));
  }

  static getFields(array) {
    if (this.isUndefined(array)) {
      return undefined;
    }

    return array.map((item) => this.getMarkdownObject(item));
  }


  static getFormattedDate(date) {
    if (this.isUndefined(date)) {
      return undefined;
    }

    return date.toISOString().split('T')[0];
  }

  static getFilter(props) {
    const { filter, excludeBotUsers, excludeExternalSharedChannels } = props;

    if (this.areUndefined(filter, excludeBotUsers, excludeExternalSharedChannels)) {
      return undefined;
    }

    return new Objects.FilterObject({ filter, excludeBotUsers, excludeExternalSharedChannels });
  }

  static getDispatchActionsConfigurationObject(props) {
    const { onEnterPressed, onCharacterEntered } = props;

    if (this.areUndefined(onEnterPressed, onCharacterEntered)) {
      return undefined;
    }

    return new Objects.DispatchActionsConfigurationObject({ triggerActionsOn: [onEnterPressed, onCharacterEntered].filter(Boolean) });
  }

  static isUndefined(value) {
    return typeof value === 'undefined';
  }

  static areUndefined(...values) {
    return values.filter((value) => this.isUndefined(value)).length === values.length;
  }
}

module.exports = BuilderHelper;


/***/ }),

/***/ 249:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const BuilderHelper = __nccwpck_require__(995);
const ValidationHelper = __nccwpck_require__(6266);

module.exports = {
  BuilderHelper,
  ValidationHelper,
};


/***/ }),

/***/ 6266:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const defaultTypeRules = __nccwpck_require__(1163);

class ValidationHelper {
  static getTypeValidator(prop) {
    return defaultTypeRules[prop];
  }
}

module.exports = ValidationHelper;


/***/ }),

/***/ 2762:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { ValidationHelper } = __nccwpck_require__(249);
const { BlockBuilderError, BlockBuilderValidationError } = __nccwpck_require__(1748);

class Builder {
  constructor() {
    this.class = this.constructor.name;
    this.category = null;
    this.props = {};
    this.result = {};
    this.hasBeenBuilt = false;
  }

  /**
   * @protected
   */

  set(value, prop) {
    if (typeof this.props[prop] !== 'undefined') {
      throw new BlockBuilderError(`Property ${prop} for ${this.constructor.name} can only be assigned once.`);
    }

    this.validateProp(value, prop);

    this.props[prop] = value;

    return this;
  }

  /**
   * @protected
   */

  append(value, prop) {
    const prunedValue = value.filter(Boolean);

    if (prunedValue.length > 0) {
      this.validateProp(prunedValue, prop);

      this.props[prop] = typeof this.props[prop] === 'undefined'
        ? prunedValue
        : this.props[prop].concat(prunedValue);
    }

    return this;
  }

  /**
   * @protected
   */

  getResult(Class, augmentedProps) {
    this.validateState();

    this.result = new Class({ ...this.props, ...augmentedProps });
    this.hasBeenBuilt = true;

    Object.freeze(this);

    return this.result;
  }

  /**
   * @protected
   */

  finalizeConstruction() {
    Object.keys(this.props).map((prop) => this.validateProp(this.props[prop], prop));
    Object.keys(this.props).forEach((prop) => typeof this.props[prop] === 'undefined' && delete this.props[prop]);
    Object.seal(this);
  }

  /**
   * @private
   */

  validateProp(value, prop) {
    this.validateState();

    if (typeof value === 'undefined') {
      return null;
    }

    const typeValidator = ValidationHelper.getTypeValidator(prop);
    const typeValidation = typeValidator.validate(value);

    if (typeValidation.failed) {
      throw new BlockBuilderValidationError(`Property '${prop}' of ${this.constructor.name} only accepts ${typeValidation.message}.`);
    }
  }

  /**
   * @private
   */

  validateState() {
    if (this.hasBeenBuilt) {
      throw new BlockBuilderError(`Builder for ${this.constructor.name} has been built and can no longer be modified.`);
    }
  }

  /**
   * Should not be called directly
   * @protected
   */

  build() {
    throw new BlockBuilderError(`Builder ${this.constructor.name} must have a declared 'build' method`);
  }
}

module.exports = Builder;


/***/ }),

/***/ 3366:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Builder = __nccwpck_require__(2762);
const SlackDto = __nccwpck_require__(7758);
const Validator = __nccwpck_require__(7485);

module.exports = {
  Builder,
  SlackDto,
  Validator,
};


/***/ }),

/***/ 7758:
/***/ ((module) => {

class SlackDto {
  /**
   * @protected
   */

  pruneAndFreeze() {
    Object.keys(this)
      .forEach((prop) => typeof this[prop] === 'undefined' && delete this[prop]);

    Object.freeze(this);
  }
}

module.exports = SlackDto;


/***/ }),

/***/ 7485:
/***/ ((module) => {

class Validator {
  constructor({ condition, message }) {
    this.condition = condition;
    this.message = message;
  }

  validate(value) {
    return {
      failed: !this.condition(value),
      message: this.message,
    };
  }
}

module.exports = Validator;


/***/ }),

/***/ 1163:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const types = __nccwpck_require__(1111);

module.exports = {
  blocks: types.areBlocks,
  elements: types.areElementsOrStrings,
  blockId: types.isString,
  externalId: types.isString,
  label: types.isString,
  element: types.isElement,
  hint: types.isString,
  optional: types.isBool,
  fields: types.areStringsOrImages,
  accessory: types.isElement,
  actionId: types.isString,
  url: types.isString,
  style: types.isButtonStyleEnum,
  primary: types.isButtonStyleEnum,
  danger: types.isButtonStyleEnum,
  value: types.isString,
  option: types.isOption,
  confirm: types.isConfirmationDialogOrString,
  imageUrl: types.isString,
  altText: types.isString,
  options: types.areOptions,
  initialOptions: types.areOptions,
  initialOption: types.isOption,
  placeholder: types.isString,
  initialDate: types.isDate,
  initialValue: types.isString,
  multiline: types.isBool,
  minLength: types.isInt,
  maxLength: types.isInt,
  initialChannel: types.isString,
  initialChannels: types.areStrings,
  initialConversation: types.isString,
  initialConversations: types.areStrings,
  responseUrlEnabled: types.isBool,
  defaultToCurrentConversation: types.isBool,
  filter: types.areStrings,
  minQueryLength: types.isInt,
  optionGroups: types.areOptionGroups,
  initialUser: types.isString,
  initialUsers: types.areStrings,
  maxSelectedItems: types.isInt,
  title: types.isString,
  submit: types.isString,
  close: types.isString,
  deny: types.isString,
  excludeExternalSharedChannels: types.isBool,
  excludeBotUsers: types.isBool,
  text: types.isString,
  privateMetaData: types.isString,
  callbackId: types.isString,
  channel: types.isString,
  clearOnClose: types.isBool,
  notifyOnClose: types.isBool,
  description: types.isString,
  asUser: types.isBool,
  ts: types.isString,
  threadTs: types.isString,
  replaceOriginal: types.isBool,
  deleteOriginal: types.isBool,
  responseType: types.isResponseTypeEnum,
  postAt: types.isTimestamp,
  color: types.isString,
  fallback: types.isString,
  attachments: types.areAttachments,
  dispatchAction: types.isBool,
  onEnterPressed: types.isDispatchConfigEnum,
  onCharacterEntered: types.isDispatchConfigEnum,
  initialTime: types.isHhMmTime,
  mrkdwn: types.isBool,
};


/***/ }),

/***/ 1111:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const Validator = __nccwpck_require__(7485);
const { enumValues, categories, classes } = __nccwpck_require__(8345);


module.exports = {
  isString: new Validator({
    condition: (value) => typeof value === 'string',
    message: 'String',
  }),

  areStrings: new Validator({
    condition: (values) => (Array.isArray(values)
      ? values.filter((value) => typeof value === 'string').length === values.length
      : false),
    message: 'Strings',
  }),

  isInt: new Validator({
    condition: (value) => Number.isInteger(value),
    message: 'Integer',
  }),

  isBool: new Validator({
    condition: (value) => typeof value === 'boolean',
    message: 'Boolean',
  }),

  isDate: new Validator({
    condition: (value) => value instanceof Date,
    message: 'instance of Date',
  }),

  areBlocks: new Validator({
    condition: (values) => (Array.isArray(values)
      ? values.filter((value) => value.category === categories.block).length === values.length
      : false),
    message: 'instances of Blocks',
  }),

  isElement: new Validator({
    condition: (value) => value.category === categories.element,
    message: 'instance of Element',
  }),

  areElementsOrStrings: new Validator({
    condition: (values) => (Array.isArray(values)
      ? values.filter((value) => (typeof value === 'string' || value.category === categories.element)).length === values.length
      : false),
    message: 'instances of Elements',
  }),

  isOption: new Validator({
    condition: (value) => value.class === classes.option,
    message: 'instance of Option',
  }),

  areOptions: new Validator({
    condition: (values) => (Array.isArray(values)
      ? values.filter((value) => value.class === classes.option).length === values.length
      : false),
    message: 'instances of Option',
  }),

  areOptionGroups: new Validator({
    condition: (values) => (Array.isArray(values)
      ? values.filter((value) => value.class === classes.optionGroup).length === values.length
      : false),
    message: 'instances of OptionGroup',
  }),

  isConfirmationDialogOrString: new Validator({
    condition: (value) => Boolean(typeof value === 'string' || value.class === classes.confirmationDialog),
    message: 'instance of ConfirmationDialog',
  }),

  isButtonStyleEnum: new Validator({
    condition: (value) => [enumValues.danger, enumValues.primary].includes(value),
    message: 'String with value \'danger\' or \'primary\'',
  }),

  areStringsOrImages: new Validator({
    condition: (values) => (Array.isArray(values)
      ? values.filter((value) => Boolean(typeof value === 'string' || value.class === classes.img)).length === values.length
      : false),
    message: 'Strings or instances of Img',
  }),

  isResponseTypeEnum: new Validator({
    condition: (value) => [enumValues.ephemeral, enumValues.inChannel].includes(value),
    message: 'String with value of \'ephemeral\'',
  }),

  isTimestamp: new Validator({
    condition: (value) => new Date(value).getTime() > 0,
    message: 'UNIX timestamp',
  }),

  areAttachments: new Validator({
    condition: (values) => (Array.isArray(values)
      ? values.filter((value) => value.class === classes.attachment).length === values.length
      : false),
    message: 'instances of Attachment',
  }),

  isDispatchConfigEnum: new Validator({
    condition: (value) => [enumValues.onEnterPressed, enumValues.onCharacterEntered].includes(value),
    message: 'String with value \'on_enter_pressed\' or \'on_character_entered\'',
  }),

  isHhMmTime: new Validator({
    condition: (value) => new RegExp('([0-2][0-9]:[0-9][0-9])').test(value),
    message: 'String in the \'HH:mm\' format, where \'HH\' is the 24-hour format of an hour, and \'mm\' is minutes with leading zero',
  }),
};


/***/ }),

/***/ 9318:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

const os = __nccwpck_require__(2087);
const tty = __nccwpck_require__(3867);
const hasFlag = __nccwpck_require__(1621);

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 696:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse("{\"name\":\"axios\",\"version\":\"0.21.1\",\"description\":\"Promise based HTTP client for the browser and node.js\",\"main\":\"index.js\",\"scripts\":{\"test\":\"grunt test && bundlesize\",\"start\":\"node ./sandbox/server.js\",\"build\":\"NODE_ENV=production grunt build\",\"preversion\":\"npm test\",\"version\":\"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json\",\"postversion\":\"git push && git push --tags\",\"examples\":\"node ./examples/server.js\",\"coveralls\":\"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js\",\"fix\":\"eslint --fix lib/**/*.js\"},\"repository\":{\"type\":\"git\",\"url\":\"https://github.com/axios/axios.git\"},\"keywords\":[\"xhr\",\"http\",\"ajax\",\"promise\",\"node\"],\"author\":\"Matt Zabriskie\",\"license\":\"MIT\",\"bugs\":{\"url\":\"https://github.com/axios/axios/issues\"},\"homepage\":\"https://github.com/axios/axios\",\"devDependencies\":{\"bundlesize\":\"^0.17.0\",\"coveralls\":\"^3.0.0\",\"es6-promise\":\"^4.2.4\",\"grunt\":\"^1.0.2\",\"grunt-banner\":\"^0.6.0\",\"grunt-cli\":\"^1.2.0\",\"grunt-contrib-clean\":\"^1.1.0\",\"grunt-contrib-watch\":\"^1.0.0\",\"grunt-eslint\":\"^20.1.0\",\"grunt-karma\":\"^2.0.0\",\"grunt-mocha-test\":\"^0.13.3\",\"grunt-ts\":\"^6.0.0-beta.19\",\"grunt-webpack\":\"^1.0.18\",\"istanbul-instrumenter-loader\":\"^1.0.0\",\"jasmine-core\":\"^2.4.1\",\"karma\":\"^1.3.0\",\"karma-chrome-launcher\":\"^2.2.0\",\"karma-coverage\":\"^1.1.1\",\"karma-firefox-launcher\":\"^1.1.0\",\"karma-jasmine\":\"^1.1.1\",\"karma-jasmine-ajax\":\"^0.1.13\",\"karma-opera-launcher\":\"^1.0.0\",\"karma-safari-launcher\":\"^1.0.0\",\"karma-sauce-launcher\":\"^1.2.0\",\"karma-sinon\":\"^1.0.5\",\"karma-sourcemap-loader\":\"^0.3.7\",\"karma-webpack\":\"^1.7.0\",\"load-grunt-tasks\":\"^3.5.2\",\"minimist\":\"^1.2.0\",\"mocha\":\"^5.2.0\",\"sinon\":\"^4.5.0\",\"typescript\":\"^2.8.1\",\"url-search-params\":\"^0.10.0\",\"webpack\":\"^1.13.1\",\"webpack-dev-server\":\"^1.14.1\"},\"browser\":{\"./lib/adapters/http.js\":\"./lib/adapters/xhr.js\"},\"jsdelivr\":\"dist/axios.min.js\",\"unpkg\":\"dist/axios.min.js\",\"typings\":\"./index.d.ts\",\"dependencies\":{\"follow-redirects\":\"^1.10.0\"},\"bundlesize\":[{\"path\":\"./dist/axios.min.js\",\"threshold\":\"5kB\"}]}");

/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ 3867:
/***/ ((module) => {

"use strict";
module.exports = require("tty");;

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(3109);
/******/ })()
;
//# sourceMappingURL=index.js.map