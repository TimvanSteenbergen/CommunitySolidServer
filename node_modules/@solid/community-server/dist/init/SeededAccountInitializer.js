"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeededAccountInitializer = void 0;
const fs_extra_1 = require("fs-extra");
const yup_1 = require("yup");
const YupUtil_1 = require("../identity/interaction/YupUtil");
const LogUtil_1 = require("../logging/LogUtil");
const ErrorUtil_1 = require("../util/errors/ErrorUtil");
const Initializer_1 = require("./Initializer");
const inSchema = (0, yup_1.array)().of((0, yup_1.object)({
    email: (0, yup_1.string)().trim().email().lowercase()
        .required(),
    password: (0, yup_1.string)().trim().min(1).required(),
    pods: (0, yup_1.array)().of((0, yup_1.object)({
        name: (0, yup_1.string)().trim().min(1).required(),
        settings: (0, yup_1.object)({
            webId: YupUtil_1.URL_SCHEMA,
        }).optional(),
    })).optional(),
})).required();
/**
 * Initializes a set of accounts based on the input data.
 * These accounts have exactly 1 email/password login method, and 0 or more pods.
 * The pod settings that can be defined are identical to those of the {@link CreatePodHandler}.
 */
class SeededAccountInitializer extends Initializer_1.Initializer {
    logger = (0, LogUtil_1.getLoggerFor)(this);
    accountStore;
    passwordStore;
    podCreator;
    configFilePath;
    constructor(args) {
        super();
        this.accountStore = args.accountStore;
        this.passwordStore = args.passwordStore;
        this.podCreator = args.podCreator;
        this.configFilePath = args.configFilePath;
    }
    async handle() {
        // This value being undefined means that the variable linking to the seed config is not defined
        // and this class should just do nothing.
        if (!this.configFilePath) {
            return;
        }
        let configuration;
        try {
            configuration = await inSchema.validate(await (0, fs_extra_1.readJson)(this.configFilePath, 'utf8'));
        }
        catch (error) {
            const msg = `Invalid account seed file: ${(0, ErrorUtil_1.createErrorMessage)(error)}`;
            this.logger.error(msg);
            throw new Error(msg);
        }
        let accountCount = 0;
        let podCount = 0;
        for (const { email, password, pods } of configuration) {
            try {
                this.logger.info(`Creating account for ${email}`);
                const accountId = await this.accountStore.create();
                const id = await this.passwordStore.create(email, accountId, password);
                await this.passwordStore.confirmVerification(id);
                accountCount += 1;
                for (const { name, settings } of pods ?? []) {
                    this.logger.info(`Creating pod with name ${name}`);
                    await this.podCreator.handleSafe({ accountId, name, webId: settings?.webId, settings });
                    podCount += 1;
                }
            }
            catch (error) {
                this.logger.warn(`Error while initializing seeded account: ${(0, ErrorUtil_1.createErrorMessage)(error)}`);
            }
        }
        this.logger.info(`Initialized ${accountCount} accounts and ${podCount} pods.`);
    }
}
exports.SeededAccountInitializer = SeededAccountInitializer;
//# sourceMappingURL=SeededAccountInitializer.js.map