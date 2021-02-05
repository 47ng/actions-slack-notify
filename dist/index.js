require('./sourcemap-register.js');module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const status = core.getInput('status');
            const env = process.env;
            if (status === 'success') {
                const msg = slack_1.success(env);
                core.debug(msg);
            }
            else if (status === 'failure') {
                const msg = slack_1.failure(env, JSON.parse(core.getInput('steps')));
                core.debug(msg);
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
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getActions = exports.getContext = exports.failure = exports.success = void 0;
const slack_block_builder_1 = __nccwpck_require__(8850);
const gha_1 = __nccwpck_require__(7907);
function success(env) {
    const { GITHUB_WORKFLOW, GITHUB_REPOSITORY } = env;
    const urls = gha_1.getURLs(env);
    const msg = slack_block_builder_1.Message().blocks(slack_block_builder_1.Blocks.Section({
        text: `*✔︎ ${GITHUB_WORKFLOW}* passed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`
    }));
    const context = getContext(env);
    const actions = getActions(env, 'failure');
    msg.blocks([context, actions]);
    msg.printPreviewUrl();
    return msg.buildToJSON();
}
exports.success = success;
// --
function failure(env, steps) {
    const { GITHUB_WORKFLOW, GITHUB_REPOSITORY } = env;
    const urls = gha_1.getURLs(env);
    const failedStepIDs = Object.entries(steps)
        .filter(({ 1: step }) => !step.success)
        .map(([id]) => id);
    const msg = slack_block_builder_1.Message().blocks([
        slack_block_builder_1.Blocks.Section({
            text: `*🚨 ${GITHUB_WORKFLOW}* failed on <${urls.repo}|*${GITHUB_REPOSITORY}*>`
        })
    ]);
    if (failedStepIDs.length > 0) {
        msg.blocks(slack_block_builder_1.Blocks.Section().text(failedStepIDs.map(id => `*✘ ${id}*`).join('\n')));
    }
    const context = getContext(env);
    const actions = getActions(env, 'failure');
    msg.blocks([context, actions]);
    msg.printPreviewUrl();
    return msg.buildToJSON();
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
        text: 'View Workflow',
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

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

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