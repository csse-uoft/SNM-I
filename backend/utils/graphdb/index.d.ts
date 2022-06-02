declare namespace GDBUtils {

    declare type GraphDBModelConstructor = GraphDBModel | ((data: object) => GraphDBDocument);
    declare type GDBType = StringConstructor | NumberConstructor | DateConstructor | BooleanConstructor
        | 'owl:NamedIndividual' | 'GraphDB.Self!' | GraphDBModelConstructor;

    enum DeleteType {
        CASCADE,
        NON_CASCADE
    }

    export const Types = {
        NamedIndividual: 'owl:NamedIndividual',
        String,
        Number,
        Date,
        Boolean,
        // Refers to the model itself
        Self: 'GraphDB.Self!' // `GraphDB.Self` is some special value that is not used anywhere.
    };

    export const Comparison = { $ne: "", $ge: ">=", $le: "<=", $gt: ">", $lt: "<" };

    export function regexBuilder(pattern: string, flags?: string): string;

    interface GraphDBPropertyOptions {
        // Data type
        type: GDBType | GDBType[];

        // The prefix add to each predicate, default to 'has_'
        prefix?: 'has_' | string;

        // For array datatype only, the suffix append to the external key, default to 's'
        suffix?: 's' | string;

        // The internal key, internal keys are used in GraphDB,
        internalKey?: string;

        // The external key, external keys are used in javascript. (documents, filters, populates)
        externalKey?: string;

        // The delete operation on nested models, default to non cascade.
        onDelete?: DeleteType;
    }

    // Example: {name: 'primary_contact', rdfTypes: [Types.NamedIndividual, ':primary_contact']}
    interface SchemaOptions {
        // The prefix of the created documents' identifier.
        // e.g. if `name="primary_contact"`, the new created document will have id `:primary_contact_1`
        name: string;

        // The list of value in rdf:type.
        // owl:NamedIndividual will be added if not given
        // e.g. `[Types.NamedIndividual, ":primary_contact"]` => `some_instance rdf:type owl:NamedIndividual, :primary_contact.`
        rdfTypes: string[];
    }

    interface GraphDBSchema {
        [key: string]: GDBType | GraphDBPropertyOptions;
    }

    interface GDBFilter {
        [key: string]: any
    }

    interface GDBFindOptions {
        populates: { [key: string]: any }
    }

    // GraphDB Document represent an owl:NamedIndividual
    declare class GraphDBDocument {
        // document
        [key: string]: any;

        schema: GraphDBSchema;

        schemaOptions: SchemaOptions;

        get individualName(): string;

        get data(): object;

        // Return a boolean that indicates whether this document is modified.
        get isModified(): boolean;

        /**
         * Get a property of the document using path.
         * @example `doc.get('organization.primary_contact')`
         */
        get(path: string): undefined | GraphDBDocument | string | number | boolean;

        set(path: string, obj: object, isPopulate?: boolean);

        // Calls MongoDB to generate an incremented ID for this document
        async generateId(): number;

        // Get SPARQL query
        async getQueries(): { queryBody: string, instanceName: string, query: string }

        // Mark one or more fields as modified fields
        // It will force update the marked fields when saving.
        markModified(key: string | string[]);

        // Populate a field by path, and return this GraphDBDocument.
        async populate(path: string): GraphDBDocument

        // Populate multiple fields by path, and return this GraphDBDocument.
        async populateMultiple(paths: string[]): GraphDBDocument

        // Create or update this document
        async save();
    }


    declare class GraphDBDocumentArray extends Array {
        // Populate a field by path, and return this GraphDBDocumentArray.
        async populate(path: string): GraphDBDocumentArray

        // Populate multiple fields by path, and return this GraphDBDocumentArray.
        async populateMultiple(paths: string[]): GraphDBDocumentArray
    }

    // GraphDB Model, can be instantiated into an instance of GraphDBDocument
    declare class GraphDBModel {
        constructor(data): GraphDBDocument;

        /**
         * Create a document based on the model.
         * Identical to `Model(data)`
         */
        createDocument(data): GraphDBDocument;

        /**
         * Remove fields that are not in the schema.
         */
        private cleanData(data: object): object;

        /**
         * Get all path from the current model
         */
        private getCascadePaths(): string[];

        /**
         * Generate creation query.
         */
        private async generateCreationQuery(id: number | string, data: object)
            : { footer: string, instanceName: string, innerQueryBodies: string[], header: string, queryBody: string }

        /**
         * Generate find query.
         */
        private generateFindQuery(filter, config): { query: string, where: array, construct: array }

        /**
         * Generate deletion query.
         */
        private generateDeleteQuery(doc: GraphDBDocument, cnt: number = 0): { query: string, where: string[] }

        /**
         * Find documents from the model.
         * @param filter
         * @param options
         * @return The found documents.
         * @example
         * ```
         * // Find all documents for this model
         * await Model.find({});
         *
         * // Find with filter
         * await Model.find({first_name: "Lester"});
         *
         * // Find with nested filter
         * await Model.find({primary_contact: {first_name: "Lester"}});
         *
         * // Find with array filter, currently only supports $in
         * await Model.find({hobbies: {$in: ['coding', 'jogging']}});
         *
         * // Find with compare filter, supports $le, $lt, $ge, $gt
         * await Model.find({age: {$lt: 100, $gt: 20}}); // less than 100 and greater than 20
         *
         * await Model.find({age: {$le: 100, $ge: 20}}); // less or equal to 100 and greater or equal to 20
         *
         * // Find all documents with populates, support nested populates.
         * await Model.find({}, {
         *    populates: [
         *      'primary_contact', // Populate primary_contact
         *      'organization.primary_contact'  // Populate organization and organization.primary_contact
         *    ]
         * });
         * ```
         */
        async find(filter: GDBFilter, options: GDBFindOptions): GraphDBDocumentArray<GraphDBDocument>;


        /**
         * Find a document by ID in the model.
         * @param id - ID of the document, usually represents as `_id`
         * @param options - The options
         * @return The found document
         * @see {@link GraphDBModel.find} for further information
         * @example
         * ```
         * // Same as
         * (await Model.find({_id: id}, {populates}))[0];
         *
         * // Find one document with _id = 1 and populate
         * Model.findById(1, {populates: ['primary_contact']});
         * ```
         */
        async findById(id: string | number, options?: GDBFindOptions): GraphDBDocument;

        /**
         * Find one document in the model.
         * @param filter - The filter
         * @param options - The options
         * @return The found document
         * @see {@link GraphDBModel.find} for further information
         * @example
         * ```
         * // Same as
         * await (Model.find(filter, {populates}))[0];
         *
         * // Find one document and populate
         * Model.findOne({age: 50}, {populates: ['primary_contact']});
         * ```
         */
        async findOne(filter: GDBFilter, options?: GDBFindOptions): GraphDBDocument;

        /**
         * Find one document and update.
         * @param filter - The filter
         * @param update - The Update to the found document
         * @example
         * ```
         * // Find a document has _id = 1 and update the primary_contact.first_name to 'Lester'
         * // The document has smaller id will be updated if it finds multiple matched documents.
         * const doc = await Model.findOneAndUpdate({_id: 1}, {primary_contact: {first_name: 'Lester'}});
         * ```
         */
        async findOneAndUpdate(filter: GDBFilter, update: object): GraphDBDocument;

        /**
         * Find one document by ID and update
         * @param id - The identifier
         * @param update - The Update to the found document
         * @return {Promise<GraphDBDocument>}
         * @example
         * ```
         * // Find a document has id = 1 and update the primary_contact.first_name to 'Lester'
         * const doc = await Model.findByIdAndUpdate(1, {primary_contact: {first_name: 'Lester'}});
         * ```
         */
        async findByIdAndUpdate(id: string | number, update: object): GraphDBDocument

        /**
         * Find all documents matched to the filter and delete.
         * @param filter - The filter.
         * @example
         * ```
         * // Find all documents have primary_contact.first_name equal to 'Lester' and delete them.
         * const doc = await Model.findAndDelete({primary_contact: {first_name: 'Lester'}});
         * ```
         */
        async findAndDelete(filter: GDBFilter): GraphDBDocumentArray

        /**
         * Find one document matched to the filter and delete.
         * @param filter - The filter
         * @return The deleted document.
         * @example
         * ```js
         * // Find one document have primary_contact.first_name equal to 'Lester' and delete it.
         * // The document with smaller id will be deleted if found multiple documents.
         * const doc = await Model.findOneAndDelete({primary_contact: {first_name: 'Lester'}});
         * ```
         */
        async findOneAndDelete(filter: GDBFilter): GraphDBDocument | undefined

        /**
         * Find one document by ID and delete it.
         * @param id - The identifier
         * @return The deleted document.
         * @example
         * ```js
         *  // Find one document has id 1 and delete it.
         *  const doc = await Model.findByIdAndDelete(1);
         * ```
         */
        async findByIdAndDelete(id: string | number): GraphDBDocument

    }

    // Create GraphDB Model
    export function createGraphDBModel(schema: GraphDBSchema, schemaOptions: SchemaOptions)
        : GraphDBModelConstructor;

    // Get created GraphDBModel.
    export function getGraphDBModel(name: string): GraphDBModelConstructor | undefined;

    declare type onDataCallback = ((subject, predicate, object) => void);

    export namespace GraphDB {
        /**
         * Send select query
         * @param query - the query
         * @param onData - on data callback
         */
        export async function sendSelectQuery(query: string, onData: onDataCallback);

        export async function sendUpdateQuery(query: string);

        export async function sendConstructQuery(query: string, onData: onDataCallback);

        export async function getAllInstancesWithLabel(type: string): { [key: string]: string };

        export async function getAllInstancesWithLabelComment(type: string): { [key: string]: { label: string, comment: string } };


    }

    /**
     * Get the next counter for the given counter name
     * @param counterName - The counter name that the counter is for
     */
    export function getNextCounter(counterName: string): number;

}


export = GDBUtils;