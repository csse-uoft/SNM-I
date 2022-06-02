## Classes

<dl>
<dt><a href="#GraphDBDocument">GraphDBDocument</a></dt>
<dd></dd>
<dt><a href="#GraphDBDocumentArray">GraphDBDocumentArray</a> ⇐ <code>Array</code></dt>
<dd></dd>
<dt><a href="#GraphDBModel">GraphDBModel</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#createGraphDBModel">createGraphDBModel(schema, schemaOptions)</a> ⇒ <code><a href="#GraphDBModel">GraphDBModel</a></code> | <code>function</code></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#SchemaOptions">SchemaOptions</a></dt>
<dd></dd>
<dt><a href="#GraphDBPropertyOptions">GraphDBPropertyOptions</a></dt>
<dd></dd>
</dl>

<a name="GraphDBDocument"></a>

## GraphDBDocument
**Kind**: global class  

* [GraphDBDocument](#GraphDBDocument)
    * [.data](#GraphDBDocument+data) ⇒ <code>Object</code>
    * [.schema](#GraphDBDocument+schema) ⇒ <code>Object</code>
    * [.schemaOptions](#GraphDBDocument+schemaOptions) ⇒ <code>GDSchemaOptions</code>
    * [.get(path)](#GraphDBDocument+get) ⇒ <code>undefined</code> \| [<code>GraphDBDocument</code>](#GraphDBDocument) \| <code>string</code> \| <code>number</code> \| <code>boolean</code>
    * [.set(path, obj)](#GraphDBDocument+set) ⇒ <code>undefined</code> \| [<code>GraphDBDocument</code>](#GraphDBDocument) \| <code>string</code> \| <code>number</code> \| <code>boolean</code>
    * [.markModified(key)](#GraphDBDocument+markModified)
    * [.populate(path)](#GraphDBDocument+populate) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
    * [.toJSON()](#GraphDBDocument+toJSON) ⇒ <code>object</code>

<a name="GraphDBDocument+data"></a>

### graphDBDocument.data ⇒ <code>Object</code>
Get the document data.

**Kind**: instance property of [<code>GraphDBDocument</code>](#GraphDBDocument)  
<a name="GraphDBDocument+schema"></a>

### graphDBDocument.schema ⇒ <code>Object</code>
Get the document's model schema.

**Kind**: instance property of [<code>GraphDBDocument</code>](#GraphDBDocument)  
<a name="GraphDBDocument+schemaOptions"></a>

### graphDBDocument.schemaOptions ⇒ <code>GDSchemaOptions</code>
Get the document's model schemaOptions.

**Kind**: instance property of [<code>GraphDBDocument</code>](#GraphDBDocument)  
<a name="GraphDBDocument+get"></a>

### graphDBDocument.get(path) ⇒ <code>undefined</code> \| [<code>GraphDBDocument</code>](#GraphDBDocument) \| <code>string</code> \| <code>number</code> \| <code>boolean</code>
Get a property of the document using path.

**Kind**: instance method of [<code>GraphDBDocument</code>](#GraphDBDocument)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

**Example**  
```js
`doc.get('organization.primary_contact')`
```
<a name="GraphDBDocument+set"></a>

### graphDBDocument.set(path, obj) ⇒ <code>undefined</code> \| [<code>GraphDBDocument</code>](#GraphDBDocument) \| <code>string</code> \| <code>number</code> \| <code>boolean</code>
Set a property of the document using path.

**Kind**: instance method of [<code>GraphDBDocument</code>](#GraphDBDocument)  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| obj | <code>\*</code> | 

**Example**  
```js
`doc.get('organization.primary_contact')`
```
<a name="GraphDBDocument+markModified"></a>

### graphDBDocument.markModified(key)
**Kind**: instance method of [<code>GraphDBDocument</code>](#GraphDBDocument)  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>Array.&lt;string&gt;</code> \| <code>string</code> | The external key to mark modified. |

<a name="GraphDBDocument+populate"></a>

### graphDBDocument.populate(path) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
Populate a field by path, and return this GraphDBDocument.

**Kind**: instance method of [<code>GraphDBDocument</code>](#GraphDBDocument)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to the field that will be populated, i.e. `account.primary_contact` |

<a name="GraphDBDocument+toJSON"></a>

### graphDBDocument.toJSON() ⇒ <code>object</code>
Override default JSON.stringify behavior.

**Kind**: instance method of [<code>GraphDBDocument</code>](#GraphDBDocument)  
<a name="GraphDBDocumentArray"></a>

## GraphDBDocumentArray ⇐ <code>Array</code>
**Kind**: global class  
**Extends**: <code>Array</code>  

* [GraphDBDocumentArray](#GraphDBDocumentArray) ⇐ <code>Array</code>
    * [new GraphDBDocumentArray()](#new_GraphDBDocumentArray_new)
    * [.populate(path)](#GraphDBDocumentArray+populate) ⇒ [<code>Promise.&lt;GraphDBDocumentArray&gt;</code>](#GraphDBDocumentArray)
    * [.populateMultiple(paths)](#GraphDBDocumentArray+populateMultiple) ⇒ [<code>Promise.&lt;GraphDBDocumentArray&gt;</code>](#GraphDBDocumentArray)

<a name="new_GraphDBDocumentArray_new"></a>

### new GraphDBDocumentArray()
Performance optimized for multiple populates.

<a name="GraphDBDocumentArray+populate"></a>

### graphDBDocumentArray.populate(path) ⇒ [<code>Promise.&lt;GraphDBDocumentArray&gt;</code>](#GraphDBDocumentArray)
populate a single property for every document.

**Kind**: instance method of [<code>GraphDBDocumentArray</code>](#GraphDBDocumentArray)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | e.g. 'primary_contact' |

<a name="GraphDBDocumentArray+populateMultiple"></a>

### graphDBDocumentArray.populateMultiple(paths) ⇒ [<code>Promise.&lt;GraphDBDocumentArray&gt;</code>](#GraphDBDocumentArray)
Populate multiple properties for every document.Breadth first populate for combining queries.

**Kind**: instance method of [<code>GraphDBDocumentArray</code>](#GraphDBDocumentArray)  

| Param | Type | Description |
| --- | --- | --- |
| paths | <code>Array.&lt;string&gt;</code> | e.g. ['primary_contact', 'organization'] |

<a name="GraphDBModel"></a>

## GraphDBModel
**Kind**: global class  

* [GraphDBModel](#GraphDBModel)
    * [new GraphDBModel(data)](#new_GraphDBModel_new)
    * [.createDocument(data)](#GraphDBModel+createDocument) ⇒ [<code>GraphDBDocument</code>](#GraphDBDocument)
    * [.generateCreationQuery(id, data)](#GraphDBModel+generateCreationQuery) ⇒ <code>Promise.&lt;{footer: string, instanceName: string, innerQueryBodies: Array.&lt;string&gt;, header: string, queryBody: string}&gt;</code>
    * [.findById(id, options)](#GraphDBModel+findById) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
    * [.findOne(filter, [options])](#GraphDBModel+findOne) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
    * [.findOneAndUpdate(filter, update)](#GraphDBModel+findOneAndUpdate) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
    * [.findByIdAndUpdate(id, update)](#GraphDBModel+findByIdAndUpdate) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
    * [.findOneAndDelete(filter)](#GraphDBModel+findOneAndDelete) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
    * [.findByIdAndDelete(id)](#GraphDBModel+findByIdAndDelete) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)

<a name="new_GraphDBModel_new"></a>

### new GraphDBModel(data)
Create a document based on the model.Note: The constructor does not comply OOP since it is dynamically generated.Same as `GraphDBModel.createDocument`


| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | The data / properties in the new document |

<a name="GraphDBModel+createDocument"></a>

### graphDBModel.createDocument(data) ⇒ [<code>GraphDBDocument</code>](#GraphDBDocument)
Create a document based on the model.Identical to `Model(data)`

**Kind**: instance method of [<code>GraphDBModel</code>](#GraphDBModel)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | The data / properties in the new document |

<a name="GraphDBModel+generateCreationQuery"></a>

### graphDBModel.generateCreationQuery(id, data) ⇒ <code>Promise.&lt;{footer: string, instanceName: string, innerQueryBodies: Array.&lt;string&gt;, header: string, queryBody: string}&gt;</code>
Generate creation query.

**Kind**: instance method of [<code>GraphDBModel</code>](#GraphDBModel)  

| Param | Type |
| --- | --- |
| id | <code>number</code> \| <code>string</code> | 
| data |  | 

<a name="GraphDBModel+findById"></a>

### graphDBModel.findById(id, options) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
Find an document by ID in the model.

**Kind**: instance method of [<code>GraphDBModel</code>](#GraphDBModel)  
**See**: [GraphDBModel.find](GraphDBModel.find) for further information  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | ID of the document, usually represents as `_id` |
| options | <code>Object</code> |  |

**Example**  
```js// Same as(await Model.find({_id: id}, {populates}))[0];// Find one document with _id = 1 and populateModel.findById(1, {populates: ['primary_contact']});```
<a name="GraphDBModel+findOne"></a>

### graphDBModel.findOne(filter, [options]) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
Find one document in the model.

**Kind**: instance method of [<code>GraphDBModel</code>](#GraphDBModel)  
**See**: [GraphDBModel.find](GraphDBModel.find) for further information  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>Object</code> | The filter |
| [options] | <code>Object</code> |  |

**Example**  
```js// Same asawait (Model.find(filter, {populates}))[0];// Find one document and populateModel.findOne({age: 50}, {populates: ['primary_contact']});```
<a name="GraphDBModel+findOneAndUpdate"></a>

### graphDBModel.findOneAndUpdate(filter, update) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
Find one document and update.

**Kind**: instance method of [<code>GraphDBModel</code>](#GraphDBModel)  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>Object</code> | The filter |
| update | <code>Object</code> | The Update to the found document |

**Example**  
```js// Find a document has _id = 1 and update the primary_contact.first_name to 'Lester'// The document has smaller id will be updated if it finds multiple matched documents.const doc = await Model.findOneAndUpdate({_id: 1}, {primary_contact: {first_name: 'Lester'}});```
<a name="GraphDBModel+findByIdAndUpdate"></a>

### graphDBModel.findByIdAndUpdate(id, update) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
Find one document by ID and update

**Kind**: instance method of [<code>GraphDBModel</code>](#GraphDBModel)  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The identifier |
| update | <code>Object</code> | The Update to the found document |

**Example**  
```js// Find a document has id = 1 and update the primary_contact.first_name to 'Lester'const doc = await Model.findByIdAndUpdate(1, {primary_contact: {first_name: 'Lester'}});```
<a name="GraphDBModel+findOneAndDelete"></a>

### graphDBModel.findOneAndDelete(filter) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
Find one document matched to the filter and delete.

**Kind**: instance method of [<code>GraphDBModel</code>](#GraphDBModel)  
**Returns**: [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument) - - The deleted document.  

| Param | Type | Description |
| --- | --- | --- |
| filter | <code>Object</code> | The filter |

**Example**  
```js// Find one document have primary_contact.first_name equal to 'Lester' and delete it.// The document with smaller id will be deleted if found multiple documents.const doc = await Model.findOneAndDelete({primary_contact: {first_name: 'Lester'}});```
<a name="GraphDBModel+findByIdAndDelete"></a>

### graphDBModel.findByIdAndDelete(id) ⇒ [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument)
Find one document by ID and delete it.

**Kind**: instance method of [<code>GraphDBModel</code>](#GraphDBModel)  
**Returns**: [<code>Promise.&lt;GraphDBDocument&gt;</code>](#GraphDBDocument) - - The deleted document.  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> \| <code>number</code> | The identifier |

**Example**  
```js // Find one document has id 1 and delete it. const doc = await Model.findByIdAndDelete(1);```
<a name="createGraphDBModel"></a>

## createGraphDBModel(schema, schemaOptions) ⇒ [<code>GraphDBModel</code>](#GraphDBModel) \| <code>function</code>
**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| schema | <code>object.&lt;string, (GraphDBPropertyOptions\|String\|Number\|Date\|NamedIndividual\|Boolean)&gt;</code> | [GraphDBPropertyOptions](#GraphDBPropertyOptions) |
| schemaOptions | [<code>SchemaOptions</code>](#SchemaOptions) |  |

<a name="SchemaOptions"></a>

## SchemaOptions
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The prefix of the created documents' identifier.    e.g. if `name="primary_contact"`, the new created document will have id `:primary_contact_1` |
| rdfTypes | <code>Array.&lt;string&gt;</code> | The list of value in rdf:type.    e.g. `[Types.NamedIndividual, ":primary_contact"]` => `some_instance rdf:type owl:NamedIndividual, :primary_contact.` |

**Example**  
```js{name: 'primary_contact', rdfTypes: [Types.NamedIndividual, ':primary_contact']}```
<a name="GraphDBPropertyOptions"></a>

## GraphDBPropertyOptions
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| type | <code>String</code> \| <code>Number</code> \| <code>Date</code> \| <code>NamedIndividual</code> \| <code>Boolean</code> |  | Data type, |
| [prefix] | <code>string</code> | <code>&quot;has_&quot;</code> | The prefix add to each predicate, |
| [suffix] | <code>string</code> | <code>&quot;s&quot;</code> | For array datatype only, the suffix append to the external key, |
| [internalKey] | <code>string</code> | <code>null</code> | The internal key, internal keys are used in GraphDB, |
| [externalKey] | <code>string</code> | <code>null</code> | The external key, external keys are used in javascript. (documents, filters, populates) |
| [onDelete] | <code>string</code> | <code>&quot;DeleteType.NON_CASCADE&quot;</code> | The delete operation on nested models, default to non cascade. |

