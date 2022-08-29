declare namespace GDBUtils {

    type GraphDBModelConstructor = GraphDBModel | ((data: object) => GraphDBDocument);
    type GDBType = StringConstructor | NumberConstructor | DateConstructor | BooleanConstructor
        | 'owl:NamedIndividual' | 'GraphDB.Self!' | GraphDBModelConstructor;

    enum DeleteType {
        CASCADE,
        NON_CASCADE
    }

    export interface Types {
        NamedIndividual: 'owl:NamedIndividual',
        String,
        Number,
        Date,
        Boolean,
        // Refers to the model itself
        Self: 'GraphDB.Self!' // `GraphDB.Self` is some special value that is not used anywhere.
    }

    export interface Comparison {
        $ne: "", $ge: ">=", $le: "<=", $gt: ">", $lt: "<"
    }

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
    class GraphDBDocument {
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
        generateId(): Promise<number>;

        // Get SPARQL query
        getQueries(): Promise<{ queryBody: string, instanceName: string, query: string }>

        // Mark one or more fields as modified fields
        // It will force update the marked fields when saving.
        markModified(key: string | string[]);

        // Populate a field by path, and return this GraphDBDocument.
        populate(path: string): Promise<GraphDBDocument>

        // Populate multiple fields by path, and return this GraphDBDocument.
        populateMultiple(paths: string[]): Promise<GraphDBDocument>

        // Create or update this document
        save(): Promise<void>;
    }


    class GraphDBDocumentArray<T> extends Array<T> {
        // Populate a field by path, and return this GraphDBDocumentArray.
        populate(path: string): Promise<GraphDBDocumentArray<T>>

        // Populate multiple fields by path, and return this GraphDBDocumentArray.
        populateMultiple(paths: string[]): Promise<GraphDBDocumentArray<T>>
    }

    // GraphDB Model, can be instantiated into an instance of GraphDBDocument
    class GraphDBModel {

        // @ts-ignore
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
        private generateCreationQuery(id: number | string, data: object)
            : Promise<{ footer: string, instanceName: string, innerQueryBodies: string[], header: string, queryBody: string }>

        /**
         * Generate find query.
         */
        private generateFindQuery(filter, config): { query: string, where: string[], construct: string[] }

        /**
         * Generate deletion query.
         * cnt default to 0.
         */
        private generateDeleteQuery(doc: GraphDBDocument, cnt?: number): { query: string, where: string[] }

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
         *
         * // Find all clients where the characteristic_14 contains 'le' and characteristic_15='lyu'
         * await GDBClientModel.find({
         * characteristicOccurrences: {
         *   $and: [
         *     {occurrenceOf: ":characteristic_14",dataStringValue: {$regex: regexBuilder('le', 'i')}},
         *     {occurrenceOf: ":characteristic_15",dataStringValue: 'lyu' }
         *   ]
         * }
         * });
         *
         * ```
         */
        find(filter: GDBFilter, options: GDBFindOptions): Promise<GraphDBDocumentArray<GraphDBDocument>>;


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
        findById(id: string | number, options?: GDBFindOptions): Promise<GraphDBDocument>;

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
        findOne(filter: GDBFilter, options?: GDBFindOptions): Promise<GraphDBDocument>;

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
        findOneAndUpdate(filter: GDBFilter, update: object): Promise<GraphDBDocument>;

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
        findByIdAndUpdate(id: string | number, update: object): Promise<GraphDBDocument>

        /**
         * Find all documents matched to the filter and delete.
         * @param filter - The filter.
         * @example
         * ```
         * // Find all documents have primary_contact.first_name equal to 'Lester' and delete them.
         * const doc = await Model.findAndDelete({primary_contact: {first_name: 'Lester'}});
         * ```
         */
        findAndDelete(filter: GDBFilter): Promise<GraphDBDocumentArray<GraphDBDocument>>

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
        findOneAndDelete(filter: GDBFilter): Promise<GraphDBDocument | undefined>

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
        findByIdAndDelete(id: string | number): Promise<GraphDBDocument>

    }

    // Create GraphDB Model
    export function createGraphDBModel(schema: GraphDBSchema, schemaOptions: SchemaOptions)
        : GraphDBModelConstructor;

    // Get created GraphDBModel.
    export function getGraphDBModel(name: string): GraphDBModelConstructor | undefined;

    type onDataCallback = ((subject, predicate, object) => void);

    export namespace GraphDB {
        /**
         * Send select query
         * @param query - the query
         * @param inference - Whether to turn inference on or off
         * @param onData - on data callback
         */
        export function sendSelectQuery(query: string, inference: boolean, onData: onDataCallback): Promise<void>;

        export function sendUpdateQuery(query: string): Promise<void>;

        export function sendConstructQuery(query: string, onData: onDataCallback): Promise<void>;

        export function getAllInstancesWithLabel(type: string): Promise<{ [key: string]: string }>;

        export function getAllInstancesWithLabelComment(type: string): Promise<{ [key: string]: { label: string, comment: string } }>;


    }

    /**
     * Get the next counter for the given counter name
     * @param counterName - The counter name that the counter is for
     */
    export function getNextCounter(counterName: string): number;

}


export = GDBUtils;