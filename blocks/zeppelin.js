/**
 * @fileoverview Variables & functions for generating Zeppelin import statements
 * @author rekmarks@icloud.com  (Erik Marks)
 */
'use strict'

// ancestors to choose from
const zeppelinContracts = [
  [ 'Ownable' ],
  [ 'Heritable' ],
  [ 'ERC20Basic'],
  [ 'ERC20' ],
  [ 'BasicToken' ],
  [ 'StandardToken' ]
];

// dependency DAG: predecessors are dependent on successors
// e.g. given: 'x': ['y', 'z']
// then x is depedent on y and z
const zeppelinDependencies = {
  'Ownable': {
    'dependencies': [],
    'category': 'ownership'
    },
  'Heritable': {
    'dependencies': ['Ownable'],
    'category': 'ownership'
    },
  'ERC20Basic': {
    'dependencies': [],
    'category': 'ERC20'
    },
  'ERC20': {
    'dependencies': ['ERC20Basic'],
    'category': 'ERC20'
    },
  'BasicToken': {
    'dependencies': ['ERC20Basic'],
    'category': 'ERC20'
    },
  'StandardToken': {
    'dependencies': ['ERC20', 'BasicToken'],
    'category': 'ERC20'
    }
}

// object for generating import statement path from type
const zeppelinPaths = {
  'ERC20': 'token/ERC20/',
  'ownership': 'ownership/',
  'token': 'token/'
}

function getZeppelinPath(ancestor) {

  cat = zeppelinDependencies.ancestor.category;

  return zeppelinPaths.cat;
}
