/**
 * @fileoverview Helper functions for generating Solidity for blocks.
 * @author jeanmarc.leroux@google.com (Jean-Marc Le Roux)
 * @author rekmarks@icloud.com  (Erik Marks)
 */
'use strict';

goog.require('Blockly.Solidity');

Blockly.Solidity['contract'] = function(block) {

  var ancestors = Blockly.Solidity.statementToCode(block, 'ANCESTORS');
  // trim weirdly prepended space from string and ', ' from final ancestor
  if (ancestors.length > 0) {
    ancestors = ' is' + ancestors.slice(1, -2);
  }

  var states = Blockly.Solidity.statementToCode(block, 'STATES');
  if (states.length > 0) {states += '\n'};

  var ctor = Blockly.Solidity.statementToCode(block, 'CTOR');

  var methods = Blockly.Solidity.statementToCode(block, 'METHODS');
  // trim newline before ultimate closing curly brace
  if (methods.length > 0) {
    methods = methods.slice(0, -2);
  } else if (ctor.length > 0) {
    ctor = ctor.slice(0, -2);
  }

  var code = 'pragma solidity ^0.4.2;\n\n'
    + 'contract ' + block.getFieldValue('NAME')
    + ancestors + ' {\n\n'
    + states
    + ctor
    + methods
    + '}\n';

  return code;
};

// TODO: inheritance generation has to be fixed somewhere, maybe here
// specifically, I need to represent the Zeppelin libraries as a DAG
// and only generate the necessary inheritances (e.g. if a contract is
// Heritable it is also Ownable). Perhaps the user should just be stopped
// upfront from adding invalid inheritances?
Blockly.Solidity['contract_inheritance'] = function(block) {
  console.log(getZeppelinPath(block.getAncestor())); // test
  return block.getAncestor() + ', ';
}

Blockly.Solidity['contract_state'] = function(block) {
  var name = block.getFieldValue('NAME');
  var value = Blockly.Solidity.valueToCode(block, 'VALUE', Blockly.Solidity.ORDER_ASSIGNMENT);
  var type = block.getFieldValue('TYPE');
  var types = {
    'TYPE_BOOL': 'bool',
    'TYPE_INT': 'int',
    'TYPE_UINT': 'uint',
  };
  var defaultValue = {
    'TYPE_BOOL': 'false',
    'TYPE_INT': '0',
    'TYPE_UINT': '0',
  };

  if (value === '') {
    value = defaultValue[type];
  }

  return types[type] + ' ' + name + ' = ' + value + ';\n';
};

Blockly.Solidity['contract_state_get'] = function(block) {
  var variableId = block.getFieldValue('STATE_NAME');
  var variable = block.workspace.getVariableById(variableId);

  if (!variable) {
    return '';
  }

  return [Blockly.Solidity.getVariableName(variable), Blockly.Solidity.ORDER_ATOMIC];
};

Blockly.Solidity['contract_state_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Solidity.valueToCode(block, 'STATE_VALUE',
      Blockly.Solidity.ORDER_ASSIGNMENT) || '0';
  var variableId = block.getFieldValue('STATE_NAME');
  var variable = block.workspace.getVariableById(variableId);

  if (!variable) {
    return '';
  }

  return Blockly.Solidity.getVariableName(variable) + ' = ' + argument0 + ';\n';
};
