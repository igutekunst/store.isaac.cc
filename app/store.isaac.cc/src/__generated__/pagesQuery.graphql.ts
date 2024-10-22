/**
 * @generated SignedSource<<b3cd620229e87936729a085688de2e5e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type pagesQuery$variables = Record<PropertyKey, never>;
export type pagesQuery$data = {
  readonly products: ReadonlyArray<{
    readonly description: string;
    readonly id: string;
    readonly name: string;
    readonly price: any;
    readonly variants: ReadonlyArray<{
      readonly color: string;
      readonly id: string;
      readonly size: string;
      readonly stock: number;
    }>;
  } | null | undefined> | null | undefined;
};
export type pagesQuery = {
  response: pagesQuery$data;
  variables: pagesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ProductType",
    "kind": "LinkedField",
    "name": "products",
    "plural": true,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "description",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "price",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "ProductVariantType",
        "kind": "LinkedField",
        "name": "variants",
        "plural": true,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "size",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "color",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "stock",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pagesQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pagesQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d64f015b2a4f6b861bef274f189866cb",
    "id": null,
    "metadata": {},
    "name": "pagesQuery",
    "operationKind": "query",
    "text": "query pagesQuery {\n  products {\n    id\n    name\n    description\n    price\n    variants {\n      id\n      size\n      color\n      stock\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "049bbdaf605f09a83117c98ed36e9bea";

export default node;
