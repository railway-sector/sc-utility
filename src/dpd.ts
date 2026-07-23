import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

//--- 1. Define foundational building blocks
interface QueryBase {
  layer?: any;
  query?: any;
  fieldList: string[] | any;
  attributes?: any;
}

interface FieldBase {
  field1: string;
  field2?: string;
  field3?: string;
}

interface DropdownBase {
  dropdown1: boolean;
  dropdown2?: boolean;
  dropdown3?: boolean;
}

//--- 2. Derive domain-specific interfaces using 'extends'
interface DupFieldPairs extends QueryBase {
  response: any;
}

interface CompileFieldList extends DropdownBase {
  uniqueField1: any;
  pairs?: any;
}

//--- 3. Combine base interfaces for larget objects
interface ResponseQuery extends QueryBase, FieldBase {}
interface DropdownList extends QueryBase, FieldBase, DropdownBase {}

//--- Queried features
async function responseQuery({
  query,
  fieldList,
  field1,
  layer,
}: ResponseQuery) {
  query.outFields = fieldList;
  query.where = `${field1} IS NOT NULL`;
  query.groupByFieldsForStatistics = fieldList;
  return await layer?.queryFeatures(query);
}

//--- Return field list
function fieldListReturn({ field1, field2, field3 }: FieldBase) {
  if (!field2 && !field3) {
    return [field1];
  }

  if (!field3) {
    return [field1, field2];
  }

  if (field3) {
    return [field1, field2, field3];
  }
}

//--- Transform an field object into a format:
// {field1: 'Biñan', field2: 'Canlalay'}, {field1: 'Muntinlupa', field2: 'Tunasan'}
async function fieldsArray({ fieldList, attributes }: QueryBase) {
  return fieldList.reduce(
    (acc: any, field: any, index: any) => {
      acc[`field${index + 1}`] = attributes[field];
      return acc;
    },
    {} as Record<string, any>,
  );
}

//--- Duplicated pairs of subject fields
async function dupFieldPairs({ fieldList, response }: DupFieldPairs) {
  const values = await Promise.all(
    response.features.map(async (result: any) => {
      const { attributes } = result; // short cut for const attributes = result.attributes;

      if (!fieldList[1] && !fieldList[2]) {
        return { field1: attributes[fieldList[0]] };
      }

      return await fieldsArray({
        fieldList: fieldList,
        attributes: attributes,
      });
    }),
  );
  //--- Duplicated pairs of {field1: '', field2: ''}....
  // {field1: 'Taguig', field2: 'North Daang Hari'}
  // {field1: 'Taguig', field2: 'North Daang Hari'}
  return values;
}

//--- Return an unique pair
interface uniquePairsType {
  values: any;
  fieldList: any;
  pairs?: any;
}

async function uniquePairs({ values, fieldList }: uniquePairsType) {
  let pairs: any;
  const uniqueKeys = new Set(); //-- remove duplicated values
  pairs = values.filter((val: any) => {
    // Build a composite key (e.g., "val1|val2|val3" depending on fieldName presence)
    const keys = [val.field1];
    if (fieldList[1]) keys.push(val.field2);
    if (fieldList[2]) keys.push(val.field3);

    const key = keys.join("|");

    //-- Empty uniqueKeys if any
    if (uniqueKeys.has(key)) {
      return false;
    }

    uniqueKeys.add(key);
    return true;
  });
  pairs.sort((a: any, b: any) => a.field1.localeCompare(b.field1));

  //-- Remove pairs with null values in field2 and field3
  const filtered = pairs.filter((f: any) => f.field2 && f.field3);

  return filtered;
}

interface uField1ListType {
  pairs: any;
}

async function uField1List({ pairs }: uField1ListType) {
  //--- Unique values for field1
  //-- ['Calamba', 'San Pedro',...]
  return [...new Set(pairs.map((item: any) => item.field1))];
}

async function compileFieldList({
  dropdown1,
  dropdown2,
  dropdown3,
  uniqueField1,
  pairs,
}: CompileFieldList) {
  if (dropdown1) {
    return uniqueField1.map((field1: any) => ({ field1 }));
  }

  if (dropdown2) {
    return uniqueField1.map((field1: any) => {
      const uniqueField2 = [
        ...new Set(
          pairs
            .filter((pair: any) => pair.field1 === field1)
            .map((pair: any) => pair.field2)
            .sort((a: any, b: any) => a.localeCompare(b)),
        ),
      ];

      return {
        field1,
        field2: uniqueField2.map((field2: any) => ({ name: field2 })),
      };
    });
  }

  if (dropdown3) {
    //--- helper: unique values of 'key' among pairs matching 'match'
    const uniqueValues = (match: Partial<any>, key: string) => [
      ...new Set(
        pairs
          .filter((pair: any) =>
            Object.entries(match).every(([k, v]) => pair[k] === v),
          )
          .map((pair: any) => pair[key])
          .sort((a: any, b: any) => a.localeCompare(b)),
      ),
    ];

    return uniqueField1.map((field1: any) => {
      const field2Array = uniqueValues({ field1 }, "field2").map(
        (field2: any) => {
          const field3Array = uniqueValues({ field1, field2 }, "field3").map(
            (field3: any) => ({ name: field3 }),
          );

          return {
            name: field2,
            field3: field3Array,
          };
        },
      );

      return {
        field1,
        field2: field2Array,
      };
    });
  }
}

async function dropdownList({
  query,
  fieldList,
  field1,
  layer,
  dropdown1,
  dropdown2,
  dropdown3,
}: DropdownList) {
  const response = await responseQuery({
    query,
    fieldList,
    field1,
    layer,
  });

  const values = await dupFieldPairs({
    fieldList,
    response,
  });

  const pairs = await uniquePairs({
    values,
    fieldList,
  });

  const uniqueField1 = await uField1List({ pairs });

  return await compileFieldList({
    dropdown1,
    dropdown2,
    dropdown3,
    uniqueField1,
    pairs,
  });
}

interface pairsTwoFeaturesType {
  query: any;
  fieldList: any;
  field1: any;
  layers: any;
}

async function pairsTwoFeatures({
  query,
  fieldList,
  field1,
  layers,
}: pairsTwoFeaturesType) {
  return await Promise.all(
    layers.map(async (layer: any) => {
      const response = await responseQuery({
        query: query,
        fieldList,
        field1,
        layer: layer,
      });

      const values = await dupFieldPairs({
        fieldList,
        response,
      });

      const pairs = await uniquePairs({
        values,
        fieldList,
      });

      //--- Return the pairs for this specific layer
      return pairs;
    }),
  );
}

class GenerateDropdownData {
  featureLayers: [FeatureLayer, FeatureLayer?] | any;
  fieldNames: [string, string?, string?] | any;

  constructor(featureLayers: any, fieldNames: any) {
    this.featureLayers = featureLayers;
    this.fieldNames = fieldNames;
  }

  dropDownQuery = async () => {
    //--- Define field lists
    const fieldList1 = fieldListReturn({
      field1: this.fieldNames[0],
    });

    const fieldList2 = fieldListReturn({
      field1: this.fieldNames[0],
      field2: this.fieldNames[1],
    });

    const fieldList3 = fieldListReturn({
      field1: this.fieldNames[0],
      field2: this.fieldNames[1],
      field3: this.fieldNames[2],
    });

    //-------------------------------------------------------//
    //                    ONE feature layer                  //
    //-------------------------------------------------------//
    if (this.featureLayers.length === 1) {
      const query = this.featureLayers[0].createQuery();

      //--- One dropdown (= one field)
      if (!this.fieldNames[1] && !this.fieldNames[2]) {
        return await dropdownList({
          query,
          fieldList: fieldList1,
          field1: this.fieldNames[0],
          layer: this.featureLayers[0],
          dropdown1: true,
          dropdown2: false,
          dropdown3: false,
        });

        //--- Two dropdown lists (= two fields)
      } else if (!this.fieldNames[2]) {
        return await dropdownList({
          query,
          fieldList: fieldList2,
          field1: this.fieldNames[0],
          layer: this.featureLayers[0],
          dropdown1: false,
          dropdown2: true,
          dropdown3: false,
        });

        //--- Three dropdown lists (= three fields)
      } else {
        return await dropdownList({
          query,
          fieldList: fieldList3,
          field1: this.fieldNames[0],
          layer: this.featureLayers[0],
          dropdown1: false,
          dropdown2: false,
          dropdown3: true,
        });
      }

      //-------------------------------------------------------//
      //                    TWO feature layers                 //
      //-------------------------------------------------------//
    } else {
      const layers = [this.featureLayers[0], this.featureLayers[1]];
      const query = this.featureLayers[0].createQuery();

      //--- One dropdown (= one field)
      if (!this.fieldNames[1] && !this.fieldNames[2]) {
        let pairsAll: any = [];

        const results = await pairsTwoFeatures({
          query,
          fieldList: fieldList1,
          field1: this.fieldNames[0],
          layers,
        });

        pairsAll.push(...results.flat());
        const uniqueField1 = await uField1List({ pairs: pairsAll });

        return await compileFieldList({
          dropdown1: true,
          dropdown2: false,
          dropdown3: false,
          uniqueField1,
          pairs: pairsAll,
        });

        // Two dropdowns (= two fields):-----------------------
      } else if (!this.fieldNames[2]) {
        let pairsAll: any = [];

        const results = await pairsTwoFeatures({
          query,
          fieldList: fieldList2,
          field1: this.fieldNames[0],
          layers,
        });

        pairsAll.push(...results.flat());
        const uniqueField1 = await uField1List({ pairs: pairsAll });

        return await compileFieldList({
          dropdown1: false,
          dropdown2: true,
          dropdown3: false,
          uniqueField1,
          pairs: pairsAll,
        });

        // Three dropdowns (= three fields):-----------------------
      } else {
        let pairsAll: any = [];

        const results = await pairsTwoFeatures({
          query,
          fieldList: fieldList3,
          field1: this.fieldNames[0],
          layers,
        });

        pairsAll.push(...results.flat());
        const uniqueField1 = await uField1List({ pairs: pairsAll });

        return await compileFieldList({
          dropdown1: false,
          dropdown2: false,
          dropdown3: true,
          uniqueField1,
          pairs: pairsAll,
        });
      }
    }
  }; // end of dropdown method
}

export default GenerateDropdownData;
